export const MOCK_TOKEN = ".eyJfdCI6IiIsImlkIjoiMzY0ODA2MDI5ODc2NTU1Nzc2In0=.";

export const MOCK_WEBHOOK_SECRET = "testsecret1234";
export const MOCK_WEBHOOK_TRACE = "trace";

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

export const RAW_PROJECT_PAYLOAD = {
  headline: {
    en: "A great bot with tons of features!"
  },
  page_content: {
    en: "# Welcome\nThis is the full page description for your project..."
  }
}

export const PROJECT_PAYLOAD = {
  headline: RAW_PROJECT_PAYLOAD.headline,
  content: RAW_PROJECT_PAYLOAD.page_content
}

export const RAW_ANNOUNCEMENT = {
  title: "Version 2.0 Released!",
  content: "We just released version 2.0 with a bunch of new features and improvements.",
  created_at: "2026-03-14T15:09:26Z"
}

export const ANNOUNCEMENT = {
  title: RAW_ANNOUNCEMENT.title,
  content: RAW_ANNOUNCEMENT.content,
  createdAt: RAW_ANNOUNCEMENT.created_at
}

export const RAW_METRIC = {
  server_count: 420,
  shard_count: 67
}

export const METRIC = {
  serverCount: RAW_METRIC.server_count,
  shardCount: RAW_METRIC.shard_count
}

export const METRIC_BATCH = [
  {
    timestamp: "2026-04-17T10:00:00Z",
    serverCount: 419
  },
  {
    timestamp: "2026-04-17T10:05:00Z",
    serverCount: RAW_METRIC.server_count,
    shardCount: RAW_METRIC.shard_count
  }
]

export const RAW_METRIC_BATCH = {
  data: [
    {
      timestamp: "2026-04-17T10:00:00Z",
      metrics: { server_count: 419 }
    },
    {
      timestamp: "2026-04-17T10:05:00Z",
      metrics: RAW_METRIC
    }
  ]
}

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

export const INTEGRATION_CREATE_PAYLOAD = {
  type: "integration.create",
  data: {
    connection_id: "112402021105124",
    webhook_secret: MOCK_WEBHOOK_SECRET,
    project: {
      id: "1230954036934033243",
      platform: "discord",
      platform_id: "3949456393249234923",
      type: "bot"
    },
    user: {
      id: "3949456393249234923",
      platform_id: "3949456393249234923",
      name: "username",
      avatar_url: "<avatar url>"
    }
  }
};

export const INTEGRATION_DELETE_PAYLOAD = {
  type: "integration.delete",
  data: { connection_id: "112402021105124" }
};

export const TEST_PAYLOAD = {
  type: "webhook.test",
  data: {
    user: {
      id: "160105994217586689",
      platform_id: "160105994217586689",
      name: "username",
      avatar_url: "<avatar url>"
    },
    project: {
      id: "803190510032756736",
      type: "bot",
      platform: "discord",
      platform_id: "160105994217586689"
    }
  }
};

export const VOTE_CREATE_PAYLOAD = {
  type: "vote.create",
  data: {
    id: "808499215864008704",
    weight: 1,
    created_at: "2026-02-09T00:47:14.2510149+00:00",
    expires_at: "2026-02-09T12:47:14.2510149+00:00",
    project: {
      id: "803190510032756736",
      type: "bot",
      platform: "discord",
      platform_id: "160105994217586689"
    },
    query: {
      key1: "value",
      key2: "value2"
    },
    user: {
      id: "160105994217586689",
      platform_id: "160105994217586689",
      name: "username",
      avatar_url: "<avatar url>"
    }
  }
};

export const PAYLOADS = [
  INTEGRATION_CREATE_PAYLOAD,
  INTEGRATION_DELETE_PAYLOAD,
  TEST_PAYLOAD,
  VOTE_CREATE_PAYLOAD
];
