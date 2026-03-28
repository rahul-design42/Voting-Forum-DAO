# Voting Forum DAO

---

## Table of Contents

- [Project Title](#voting-forum-dao)
- [Project Description](#project-description)
- [Project Vision](#project-vision)
- [Key Features](#key-features)
- [Future Scope](#future-scope)

---

## Project Description

**Voting Forum DAO** is a decentralised autonomous organisation (DAO) smart contract built on the **Stellar blockchain** using the **Soroban SDK**. It provides a transparent, on-chain governance forum where community members can submit proposals, cast votes, and collectively decide outcomes — without any centralised authority controlling the process.

The contract exposes four core functions:

| Function | Actor | Purpose |
|---|---|---|
| `create_proposal(title, descrip)` | Community Member | Submit a new governance proposal for the DAO |
| `cast_vote(proposal_id, vote_in_favour)` | Community Member | Vote FOR (`true`) or AGAINST (`false`) an active proposal |
| `close_proposal(proposal_id)` | Admin / Authorised Caller | Finalise voting and record the pass/reject outcome |
| `view_proposal(proposal_id)` | Anyone | Read the full state of any proposal by its ID |
| `view_forum_stats()` | Anyone | Read aggregate statistics across all proposals |

Proposals **pass** when `votes_for > votes_against` at the time of closing. All data — vote counts, timestamps, outcomes — lives fully on-chain and is immutable once recorded.

---

## Project Vision

The vision behind Voting Forum DAO is to make **decentralised community governance accessible, transparent, and tamper-proof** for any organisation, protocol, or community that wants to move beyond back-room decision-making.

By anchoring every proposal, vote, and outcome on the Stellar blockchain:

- **No single actor** can alter votes or override outcomes.
- **Every decision** is permanently auditable by anyone.
- **Trust is replaced by verifiability** — members don't have to trust the DAO admin; they can verify every state change on-chain.

The long-term vision is a thriving DAO ecosystem where communities of any size — from small DAOs of a dozen members to large protocols with thousands of token holders — can govern themselves with confidence, using this contract as their governance backbone.

---

## Key Features

- **On-Chain Proposal Submission** — Any member can create a proposal with a title and description. Each proposal is assigned a unique, auto-incremented ID and timestamped at creation using the Stellar ledger clock.

- **Directional Voting** — Voters cast either a FOR (`true`) or AGAINST (`false`) vote on any active proposal. Vote counts accumulate transparently in contract storage.

- **Proposal Lifecycle Management** — Proposals begin in an `is_active = true` state. Once `close_proposal` is called, the contract evaluates the vote tally, marks the proposal as passed or rejected, and locks it from further voting.

- **Global Forum Statistics** — The `view_forum_stats` function returns a live aggregate of total, active, passed, and rejected proposals — giving a real-time dashboard view of DAO health.

- **Default-Safe Storage** — All storage reads use safe `unwrap_or` defaults, ensuring the contract never panics on missing keys and always returns a well-defined value.

- **Soroban-Native Design** — Built entirely with `soroban-sdk` primitives (`symbol_short!`, `contracttype`, `contractimpl`, ledger timestamps, instance storage with TTL extension) following idiomatic Soroban patterns.

---

## Future Scope

The current contract is a minimal, auditable governance core. Planned enhancements include:

- **Token-Weighted Voting** — Integrate with a Stellar token contract (SEP-41 / SAC) so that a member's voting power is proportional to their token balance, preventing Sybil attacks.

- **Quorum Requirements** — Enforce a minimum participation threshold (e.g., ≥ 10% of circulating supply must vote) before a proposal can be closed and counted as valid.

- **Voting Deadlines** — Attach a ledger-sequence or timestamp deadline to each proposal so that voting closes automatically without a manual admin call.

- **Delegation / Proxy Voting** — Allow token holders to delegate their vote to a trusted representative, enabling participation even when members are inactive.

- **Role-Based Access Control** — Introduce admin, moderator, and member roles with different permission levels (e.g., only admins can close proposals, only verified members can create them).

- **Multi-Choice Proposals** — Extend beyond binary FOR/AGAINST to support ranked-choice or multiple-option proposals for richer community decision-making.

- **On-Chain Treasury Integration** — Link passed proposals to automatic fund disbursements from a DAO treasury contract, enabling trustless grant and bounty execution.

- **Event Emission** — Emit structured Soroban events on proposal creation, vote casting, and proposal closure so that off-chain indexers and frontends can react in real time.

---

## Contract Details:
Contract ID: CAVULOTLV6XDIVSRIEUWGBHGORKEVWUNVLDBHIXXKVXDA5RKVQFJIVIY
<img width="1919" height="870" alt="image" src="https://github.com/user-attachments/assets/23b72fa0-79b4-47e3-aab2-4780e2094b06" />


> Built with ❤️ on [Stellar](https://stellar.org) using the [Soroban SDK](https://soroban.stellar.org).
