#![allow(non_snake_case)]
#![no_std]
use soroban_sdk::{contract, contracttype, contractimpl, log, Env, Symbol, String, symbol_short};

// ============================================================
// DATA STRUCTURES
// ============================================================
// CAVULOTLV6XDIVSRIEUWGBHGORKEVWUNVLDBHIXXKVXDA5RKVQFJIVIY   --> Contract Address
/// Tracks aggregate stats across all proposals in the DAO.
#[contracttype]
#[derive(Clone)]
pub struct ForumStats {
    pub total_proposals: u64,   // Total proposals ever submitted
    pub active_proposals: u64,  // Proposals currently open for voting
    pub passed_proposals: u64,  // Proposals that have passed
    pub rejected_proposals: u64 // Proposals that have been rejected/closed
}

/// Stores all voting data for a single proposal.
#[contracttype]
#[derive(Clone)]
pub struct Proposal {
    pub proposal_id: u64,   // Unique identifier for this proposal
    pub title: String,      // Short title of the proposal
    pub descrip: String,    // Detailed description of the proposal
    pub votes_for: u64,     // Count of votes in favour
    pub votes_against: u64, // Count of votes against
    pub is_active: bool,    // Whether voting is still open
    pub is_passed: bool,    // Whether the proposal passed upon closing
    pub created_at: u64,    // Ledger timestamp at creation
}

// ============================================================
// STORAGE KEYS
// ============================================================

/// Key for the global ForumStats object.
const FORUM_STATS: Symbol = symbol_short!("F_STATS");

/// Key used to auto-increment proposal IDs.
const COUNT_PROP: Symbol = symbol_short!("C_PROP");

/// Maps a proposal_id → Proposal struct.
#[contracttype]
pub enum ProposalBook {
    Proposal(u64)
}

// ============================================================
// CONTRACT
// ============================================================

#[contract]
pub struct VotingForumDAO;

#[contractimpl]
impl VotingForumDAO {

    // ----------------------------------------------------------
    // 1. CREATE PROPOSAL
    //    Any community member can submit a new proposal for voting.
    // ----------------------------------------------------------
    pub fn create_proposal(env: Env, title: String, descrip: String) -> u64 {
        // Increment the global proposal counter.
        let mut count: u64 = env.storage().instance().get(&COUNT_PROP).unwrap_or(0);
        count += 1;

        let time = env.ledger().timestamp();

        // Build the new Proposal object.
        let proposal = Proposal {
            proposal_id: count,
            title,
            descrip,
            votes_for: 0,
            votes_against: 0,
            is_active: true,
            is_passed: false,
            created_at: time,
        };

        // Update aggregate stats.
        let mut stats = Self::view_forum_stats(env.clone());
        stats.total_proposals += 1;
        stats.active_proposals += 1;

        // Persist everything.
        env.storage().instance().set(&ProposalBook::Proposal(count), &proposal);
        env.storage().instance().set(&FORUM_STATS, &stats);
        env.storage().instance().set(&COUNT_PROP, &count);
        env.storage().instance().extend_ttl(5000, 5000);

        log!(&env, "New Proposal created with ID: {}", count);
        count // Return the new proposal ID to the caller.
    }

    // ----------------------------------------------------------
    // 2. CAST VOTE
    //    Any community member can cast exactly one directional
    //    vote (for / against) on an active proposal.
    //    vote_in_favour = true  → vote FOR
    //    vote_in_favour = false → vote AGAINST
    // ----------------------------------------------------------
    pub fn cast_vote(env: Env, proposal_id: u64, vote_in_favour: bool) {
        let mut proposal = Self::view_proposal(env.clone(), proposal_id);

        // Only allow voting on active proposals.
        if !proposal.is_active {
            log!(&env, "Proposal {} is no longer active.", proposal_id);
            panic!("Voting is closed for this proposal.");
        }

        if vote_in_favour {
            proposal.votes_for += 1;
            log!(&env, "Vote FOR recorded on Proposal {}", proposal_id);
        } else {
            proposal.votes_against += 1;
            log!(&env, "Vote AGAINST recorded on Proposal {}", proposal_id);
        }

        env.storage().instance().set(&ProposalBook::Proposal(proposal_id), &proposal);
        env.storage().instance().extend_ttl(5000, 5000);
    }

    // ----------------------------------------------------------
    // 3. CLOSE PROPOSAL
    //    The admin (or any authorised caller) finalises a proposal.
    //    A proposal PASSES when votes_for > votes_against.
    //    Once closed, no further votes are accepted.
    // ----------------------------------------------------------
    pub fn close_proposal(env: Env, proposal_id: u64) {
        let mut proposal = Self::view_proposal(env.clone(), proposal_id);

        if !proposal.is_active {
            log!(&env, "Proposal {} is already closed.", proposal_id);
            panic!("Proposal is already closed.");
        }

        // Determine outcome.
        let passed = proposal.votes_for > proposal.votes_against;
        proposal.is_active = false;
        proposal.is_passed = passed;

        // Update aggregate stats.
        let mut stats = Self::view_forum_stats(env.clone());
        stats.active_proposals -= 1;
        if passed {
            stats.passed_proposals += 1;
        } else {
            stats.rejected_proposals += 1;
        }

        // Persist.
        env.storage().instance().set(&ProposalBook::Proposal(proposal_id), &proposal);
        env.storage().instance().set(&FORUM_STATS, &stats);
        env.storage().instance().extend_ttl(5000, 5000);

        log!(&env, "Proposal {} closed. Passed: {}", proposal_id, passed);
    }

    // ----------------------------------------------------------
    // 4. VIEW PROPOSAL  (read-only helper)
    //    Returns the full Proposal struct for a given ID.
    //    Returns a default "not found" struct if the ID is unknown.
    // ----------------------------------------------------------
    pub fn view_proposal(env: Env, proposal_id: u64) -> Proposal {
        let key = ProposalBook::Proposal(proposal_id);
        env.storage().instance().get(&key).unwrap_or(Proposal {
            proposal_id: 0,
            title: String::from_str(&env, "Not_Found"),
            descrip: String::from_str(&env, "Not_Found"),
            votes_for: 0,
            votes_against: 0,
            is_active: false,
            is_passed: false,
            created_at: 0,
        })
    }

    // ----------------------------------------------------------
    // BONUS VIEW: VIEW FORUM STATS  (read-only helper)
    //    Returns the global ForumStats object.
    // ----------------------------------------------------------
    pub fn view_forum_stats(env: Env) -> ForumStats {
        env.storage().instance().get(&FORUM_STATS).unwrap_or(ForumStats {
            total_proposals: 0,
            active_proposals: 0,
            passed_proposals: 0,
            rejected_proposals: 0,
        })
    }
}