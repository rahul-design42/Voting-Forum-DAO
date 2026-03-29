import {
  Contract,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  nativeToScVal,
  scValToNative,
  rpc as StellarRpc,
} from "@stellar/stellar-sdk";
import { userSignTransaction } from "./Freighter";

/* ================= Config ================= */
const RPC_URL = "https://soroban-testnet.stellar.org:443";
const NETWORK = Networks.TESTNET;
const CONTRACT_ADDRESS = "CAVULOTLV6XDIVSRIEUWGBHGORKEVWUNVLDBHIXXKVXDA5RKVQFJIVIY"; // From README

const server = new StellarRpc.Server(RPC_URL);

const TX_PARAMS = {
  fee: BASE_FEE,
  networkPassphrase: NETWORK,
};

/* ================= Helpers ================= */
const stringToScVal = (value) => nativeToScVal(value, { type: "string" });
const boolToScVal = (value) => nativeToScVal(value, { type: "bool" });
const numberToU64 = (value) => nativeToScVal(value, { type: "u64" });

/* ================= Core Contract Interaction ================= */
async function contractInt(caller, fnName, values) {
  console.log(`[Soroban] contractInt called: fn="${fnName}", caller="${caller}"`);
  try {
    // 1. Load account
    console.log("[Soroban] Step 1: Loading account...");
    const sourceAccount = await server.getAccount(caller);
    console.log("[Soroban] Account loaded, sequence:", sourceAccount.sequenceNumber());
    const contract = new Contract(CONTRACT_ADDRESS);

    // 2. Build tx
    console.log("[Soroban] Step 2: Building transaction...");
    const builder = new TransactionBuilder(sourceAccount, TX_PARAMS);

    if (Array.isArray(values)) {
      builder.addOperation(contract.call(fnName, ...values));
    } else if (values !== undefined && values !== null) {
      builder.addOperation(contract.call(fnName, values));
    } else {
      builder.addOperation(contract.call(fnName));
    }

    const tx = builder.setTimeout(30).build();
    console.log("[Soroban] Transaction built successfully");

    // 3. Prepare tx
    console.log("[Soroban] Step 3: Preparing transaction (simulating)...");
    const preparedTx = await server.prepareTransaction(tx);
    const xdr = preparedTx.toXDR();
    console.log("[Soroban] Transaction prepared, XDR length:", xdr.length);

    // 4. Sign with Freighter
    console.log("[Soroban] Step 4: Signing with Freighter...");
    const signed = await userSignTransaction(xdr, caller);
    console.log("[Soroban] Transaction signed successfully");
    const signedTx = TransactionBuilder.fromXDR(signed.signedTxXdr, NETWORK);

    // 5. Send tx
    console.log("[Soroban] Step 5: Sending transaction...");
    const send = await server.sendTransaction(signedTx);
    console.log("[Soroban] Transaction sent, hash:", send.hash, "status:", send.status);

    if (send.status === "ERROR") {
      console.error("[Soroban] Send returned ERROR:", JSON.stringify(send));
      throw new Error("Transaction send failed with ERROR status");
    }

    // 6. Poll for success
    console.log("[Soroban] Step 6: Polling for result...");
    for (let i = 0; i < 15; i++) {
      const res = await server.getTransaction(send.hash);
      console.log(`[Soroban] Poll #${i + 1}: status="${res.status}"`);
      if (res.status === "SUCCESS") {
        const returnValue = res.returnValue ? scValToNative(res.returnValue) : null;
        console.log("[Soroban] Transaction SUCCESS, returnValue:", returnValue);
        return returnValue;
      }
      if (res.status === "FAILED") {
        console.error("[Soroban] Transaction FAILED, full response:", JSON.stringify(res));
        throw new Error("Transaction failed");
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
    throw new Error("Transaction timeout");
  } catch (err) {
    console.error(`[Soroban] contractInt ERROR in "${fnName}":`, err);
    throw err;
  }
}

/* ================= Read-Only Helpers ================= */

/**
 * Simulates a read-only contract call and returns the native JS value.
 * Uses the current SDK v14 `sim.result.retval` API.
 */
async function simulateReadOnly(caller, fnName, args = []) {
  console.log(`[Soroban] simulateReadOnly: fn="${fnName}", caller="${caller}"`);
  try {
    const contract = new Contract(CONTRACT_ADDRESS);
    const sourceAccount = await server.getAccount(caller);
    const builder = new TransactionBuilder(sourceAccount, TX_PARAMS);
    builder.addOperation(contract.call(fnName, ...args));
    const tx = builder.setTimeout(30).build();

    console.log(`[Soroban] Simulating "${fnName}"...`);
    const sim = await server.simulateTransaction(tx);

    // Log the full simulation response shape for debugging
    console.log(`[Soroban] Simulation response keys:`, Object.keys(sim));
    console.log(`[Soroban] sim.result:`, sim.result);

    if (sim.error) {
      console.error(`[Soroban] Simulation error for "${fnName}":`, sim.error);
      return null;
    }

    // SDK v14+: sim.result.retval is the xdr.ScVal
    if (sim.result && sim.result.retval) {
      const native = scValToNative(sim.result.retval);
      console.log(`[Soroban] "${fnName}" result (native):`, native);
      return native;
    }

    console.warn(`[Soroban] "${fnName}" returned no result. Full sim:`, JSON.stringify(sim));
    return null;
  } catch (err) {
    console.error(`[Soroban] simulateReadOnly ERROR in "${fnName}":`, err);
    throw err;
  }
}

/* ================= Contract Functions ================= */

// `create_proposal(title, descrip)`
export async function createProposal(caller, title, descrip) {
  console.log(`[Soroban] createProposal: title="${title}"`);
  return await contractInt(caller, "create_proposal", [
    stringToScVal(title),
    stringToScVal(descrip)
  ]);
}

// `cast_vote(proposal_id, vote_in_favour)`
export async function castVote(caller, proposalId, voteInFavour) {
  console.log(`[Soroban] castVote: proposalId=${proposalId}, favour=${voteInFavour}`);
  return await contractInt(caller, "cast_vote", [
    numberToU64(proposalId),
    boolToScVal(voteInFavour)
  ]);
}

// `close_proposal(proposal_id)`
export async function closeProposal(caller, proposalId) {
  console.log(`[Soroban] closeProposal: proposalId=${proposalId}`);
  return await contractInt(caller, "close_proposal", numberToU64(proposalId));
}

// `view_proposal(proposal_id)` — read-only via simulation
export async function viewProposal(caller, proposalId) {
  return await simulateReadOnly(caller, "view_proposal", [numberToU64(proposalId)]);
}

// `view_forum_stats()` — read-only via simulation
export async function viewForumStats(caller) {
  return await simulateReadOnly(caller, "view_forum_stats");
}
