import { deepStrictEqual, rejects, strictEqual } from "node:assert";
import { it, describe } from "node:test";

import { ANNOUNCEMENT, METRIC, METRIC_BATCH, MOCK_TOKEN, PARTIAL_VOTE, PROJECT, PROJECT_PAYLOAD, VOTE } from "./mocks/data";
import { registerMocks } from "./mocks/index";
import { Api, Widget } from "../src/index";

const client = new Api(MOCK_TOKEN);

registerMocks();

describe("API getSelf test", () => {
  it("getSelf should work", async () => {
    deepStrictEqual(await client.getSelf(), PROJECT);
  });
});

describe("API editSelf test", () => {
  it("editSelf should work", async () => {
    strictEqual(await client.editSelf(PROJECT_PAYLOAD), undefined);
  });
});

describe("API postAnnouncement test", () => {
  it("postAnnouncement should work", async () => {
    deepStrictEqual(
      await client.postAnnouncement(ANNOUNCEMENT.title, ANNOUNCEMENT.content),
      ANNOUNCEMENT
    );
  });
});

describe("API postMetrics test", () => {
  it("postMetrics single should work", async () => {
    strictEqual(await client.postMetrics(METRIC), undefined);
  });

  it("postMetrics batch should work", async () => {
    strictEqual(await client.postMetrics(METRIC_BATCH), undefined);
  });
});

describe("API postCommands test", () => {
  it("postCommands should work", async () => {
    strictEqual(
      await client.postCommands([
        {
          id: "1",
          type: 1,
          application_id: "1",
          name: "test",
          description: "command description",
          default_member_permissions: "",
          version: "1"
        }
      ]),
      undefined
    );
  });
});

describe("API getVote test", () => {
  it("getVote should work", async () => {
    deepStrictEqual(await client.getVote("1"), PARTIAL_VOTE);
  });

  it("getVote should return null when an invalid id is provided", async () => {
    strictEqual(await client.getVote("0"), null);
  });

  it("getVote should throw error when no id is provided", async () => {
    await rejects(() => client.getVote(""), { name: "Error" });
  });

  it("getVote should throw error when no token is provided", async () => {
    await rejects(() => new Api("").getVote("1"), { name: "TopGGAPIError" });
  });
});

describe("API getVotes test", () => {
  it("getVotes should work", async () => {
    const response = await client.getVotes(new Date("2026-01-01"));

    deepStrictEqual(response.votes, [VOTE]);
    deepStrictEqual((await response.next()).votes, [VOTE]);
  });
});

describe("Widgets test", () => {
  for (const type of ["large", "owner", "social", "votes"]) {
    it(`${type} widget should work`, () =>
      (Widget as any)[type]("discord", "bot", "12345"));
  }
});
