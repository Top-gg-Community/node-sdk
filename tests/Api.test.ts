import { Api } from "../src/index";
import ApiError from "../src/utils/ApiError";
import { BOT, BOT_STATS, VOTES } from "./mocks/data";

/* mock token */
const client = new Api(
  ".eyJpZCI6IjEwMjY1MjU1NjgzNDQyNjQ3MjQiLCJib3QiOnRydWV9."
);

describe("API postStats test", () => {
  it("postStats without server count should throw error", async () => {
    await expect(client.postStats({ shardCount: 0 })).rejects.toThrow(Error);
  });

  it("postStats with invalid negative server count should throw error", () => {
    expect(client.postStats({ serverCount: -1 })).rejects.toThrow(Error);
  });

  it("postStats should return 200", async () => {
    await expect(client.postStats({ serverCount: 1 })).resolves.toBeInstanceOf(
      Object
    );
  });
});

describe("API getStats test", () => {
  it("getStats should return 200 when bot is found", async () => {
    expect(client.getStats("1")).resolves.toStrictEqual({
      serverCount: BOT_STATS.server_count,
      shardCount: BOT_STATS.shard_count,
      shards: BOT_STATS.shards
    });
  });
});

describe("API getBot test", () => {
  it("getBot should return 404 when bot is not found", () => {
    expect(client.getBot("0")).rejects.toThrow(ApiError);
  });

  it("getBot should return 200 when bot is found", async () => {
    expect(client.getBot("1")).resolves.toStrictEqual(BOT);
  });

  it("getBot should throw when no id is provided", () => {
    expect(client.getBot("")).rejects.toThrow(Error);
  });
});

describe("API getVotes test", () => {
  it("getVotes should return 200 when token is provided", () => {
    expect(client.getVotes()).resolves.toEqual(VOTES);
  });
});

describe("API hasVoted test", () => {
  it("hasVoted should return 200 when token is provided", () => {
    expect(client.hasVoted("1")).resolves.toBe(true);
  });

  it("hasVoted should throw error when no id is provided", () => {
    expect(client.hasVoted("")).rejects.toThrow(Error);
  });
});

describe("API isWeekend tests", () => {
  it("isWeekend should return true", async () => {
    expect(client.isWeekend()).resolves.toBe(true);
  });
});
