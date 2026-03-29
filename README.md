# Voting Forum DAO: Transparent Institutional Terminal

![DAO Banner](<!-- Add your project banner image url here -->)

---

## Table of Contents

- [Overview](#overview)
- [Application Features \& Functionality](#application-features--functionality)
- [Video Demo](#video-demo)
- [Screenshots](#screenshots)
- [Smart Contract Architecture](#smart-contract-architecture)
- [Future Scope](#future-scope)

---

## Overview

**Voting Forum DAO** is a decentralised autonomous organisation (DAO) built on the **Stellar blockchain** using the **Soroban SDK**. It provides a transparent, on-chain governance forum where community members can submit proposals, cast votes, and collectively decide outcomes without centralised authority.

The frontend has been completely overhauled into a **Transparent DAO Institutional Terminal**—a sleek, modern, and data-rich interface designed for professional governance and ecosystem administration.

---

## Application Features & Functionality

### 1. Dashboard & Live Statistics
The main dashboard gives an instant overview of the DAO's health. It tracks total proposals, active votes, passed proposals, and rejected proposals, pulling real-time aggregate data directly from the Soroban smart contract.

### 2. Proposal Creation & Funding
Any community member can draft and publish a new governance proposal.
- **Title & Description:** Clean inputs for proposing network parameters, core protocol upgrades, or ecosystem grants.
- **Required Funding Field:** A dedicated field allows users to request XLM funding. This data is seamlessly formatted and appended to the on-chain description payload for full transparency.

### 3. Interactive Voting & Vote Caching
Voters can browse active proposals and cast directional votes (Yes / No).
- **Progress Tracking:** Every proposal card dynamically calculates and displays a "Yes" percentage and a "Quorum" percentage bar based on total network participation.
- **Persistent UX:** Once a vote is cast via the Freighter wallet, the choice is cached locally. The voting buttons are replaced with a persistent, clean success badge acknowledging the exact choice made, preventing UX clutter.

### 4. Search & Filtering
A global search bar located in the header allows users to instantly filter the list of active proposals by title, working seamlessly across different views and pagination limits.

### 5. Multi-View Navigation 
The application features a robust state-based routing system without heavy page reloads:
- **Active Votes Feed:** A dedicated view to see all historical and active proposals without the dashboard constraints.
- **Placeholder Ecosystem Modules:** Beautifully designed mock-up views for future modules like *Treasury*, *Delegation*, *Analytics*, and *Settings*, ensuring the institutional aesthetic remains unified as the DAO scales.

### 6. Admin Finalization
Authorised administrators can conclude an active vote. The contract evaluates the tallies and mathematically auto-accepts or auto-rejects the proposal based on the final count. The frontend provides a clear **"Finalize"** action lock specifically for this immutable state transition.

---

## Video Demo

> **Watch the full platform walkthrough below:**
> 
> [![Voting Forum DAO Demo](<!-- Add video thumbnail image url here -->)](<!-- Add your video link/URL here -->)
> *(Click the image above to watch the video demo)*

---

## Screenshots

### Main Dashboard & Active Votes
<img width="800" alt="Dashboard View Placeholder" src="<!-- Add Dashboard Screenshot URL here -->" />
*Overview of the network governance statistics and the latest active proposals.*

### Proposal Creation
<img width="800" alt="Create Proposal Placeholder" src="<!-- Add Create Proposal Screenshot URL here -->" />
*The drafting terminal where users propose ecosystem grants and require funding.*

### Voting UX & Finalization
<img width="800" alt="Voting UX Placeholder" src="<!-- Add Voting UX Screenshot URL here -->" />
*Detail of the progress bars and the persistent "You voted Yes" UX.*

---

## Smart Contract Architecture

The core logic lives entirely on-chain. Trust is replaced by verifiability.

| Function | Actor | Purpose |
|---|---|---|
| `create_proposal(title, descrip)` | Community Member | Submit a new governance proposal for the DAO |
| `cast_vote(proposal_id, vote_in_favour)` | Community Member | Vote FOR (`true`) or AGAINST (`false`) an active proposal |
| `close_proposal(proposal_id)` | Admin / Authorised Caller | Finalise voting and record the pass/reject outcome |
| `view_proposal(proposal_id)` | Anyone | Read the full state of any proposal by its ID |
| `view_forum_stats()` | Anyone | Read aggregate statistics across all proposals |

**Contract ID:** `CAVULOTLV6XDIVSRIEUWGBHGORKEVWUNVLDBHIXXKVXDA5RKVQFJIVIY`

---

## Future Scope

- **Token-Weighted Voting:** Integrate SEP-41 token contracts to make voting power proportional to token balance.
- **Quorum Enforcement:** Strict on-chain participation minimums before a proposal can successfully pass.
- **Automated Treasury Execution:** Link passed ecosystem grants directly to an automated disbursement treasury contract.

> Built with ❤️ on [Stellar](https://stellar.org) using the [Soroban SDK](https://soroban.stellar.org).
