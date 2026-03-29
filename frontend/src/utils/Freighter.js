import {
  signTransaction,
  setAllowed,
  getAddress,
  requestAccess,
} from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

const checkConnection = async () => {
  return await setAllowed();
};

const getRequestAccess = async () => {
  return await requestAccess();
};

const retrievePublicKey = async () => {
  console.log("[Freighter] Retrieving public key...");
  const { address } = await getAddress();
  console.log("[Freighter] Public key retrieved:", address);
  return address;
};

const getBalance = async () => {
  await setAllowed();
  try {
    const { address } = await getAddress();
    const account = await server.loadAccount(address);
    const xlm = account.balances.find((b) => b.asset_type === "native");
    const balance = xlm?.balance || "0";
    console.log("[Freighter] XLM balance:", balance);
    return balance;
  } catch (e) {
    console.error("[Freighter] getBalance error:", e);
    return "0";
  }
};

const userSignTransaction = async (xdr, signWith) => {
  console.log("[Freighter] Requesting signature from wallet for:", signWith);
  try {
    const result = await signTransaction(xdr, {
      networkPassphrase: StellarSdk.Networks.TESTNET,
      accountToSign: signWith,
    });
    console.log("[Freighter] Transaction signed successfully");
    return result;
  } catch (err) {
    console.error("[Freighter] Signing failed:", err);
    throw err;
  }
};

export {
  checkConnection,
  retrievePublicKey,
  getBalance,
  userSignTransaction,
  getRequestAccess,
};
