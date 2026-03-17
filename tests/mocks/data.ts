export const MOCK_TOKEN = ".eyJfdCI6IiIsImlkIjoiMzY0ODA2MDI5ODc2NTU1Nzc2In0=.";

export const RAW_PROJECT = {
  id: "218109768489992192",
  name: "Miki",
  type: "bot",
  platform: "discord",
  headline:
    "A great bot with tons of features! language | admin | cards | fun | levels | roles | marriage | currency | custom commands!",
  tags: [
    "anime",
    "customizable-behavior",
    "economy",
    "fun",
    "game",
    "leveling",
    "multifunctional",
    "role-management",
    "roleplay",
    "social"
  ],
  votes: 1120,
  votes_total: 313389,
  review_score: 4.38,
  review_count: 62245
};

export const PROJECT = {
  id: RAW_PROJECT.id,
  name: RAW_PROJECT.name,
  type: RAW_PROJECT.type,
  platform: RAW_PROJECT.platform,
  headline: RAW_PROJECT.headline,
  tags: RAW_PROJECT.tags,
  votes: {
    current: RAW_PROJECT.votes,
    total: RAW_PROJECT.votes_total
  },
  review: {
    score: RAW_PROJECT.review_score,
    count: RAW_PROJECT.review_count
  }
};

export const RAW_PARTIAL_VOTE = {
  created_at: "2025-09-09T08:55:16.218761+00:00",
  expires_at: "2025-09-09T20:55:16.218761+00:00",
  weight: 1
};

export const PARTIAL_VOTE = {
  votedAt: new Date(RAW_PARTIAL_VOTE.created_at),
  expiresAt: new Date(RAW_PARTIAL_VOTE.expires_at),
  weight: RAW_PARTIAL_VOTE.weight
};

export const RAW_VOTE = {
  user_id: "1234567890",
  platform_id: "1234567890",
  created_at: "2025-09-09T08:55:16.218761+00:00",
  expires_at: "2025-09-09T20:55:16.218761+00:00",
  weight: 1
};

export const VOTE = {
  voterId: RAW_VOTE.user_id,
  platformId: RAW_VOTE.platform_id,
  votedAt: new Date(RAW_VOTE.created_at),
  expiresAt: new Date(RAW_VOTE.expires_at),
  weight: RAW_VOTE.weight
};

export const RAW_PAGINATED_VOTES = {
  data: [RAW_VOTE],
  cursor: "0123456789abcdef"
};
