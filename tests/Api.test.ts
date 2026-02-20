import { Api } from "../src/index";
import { PARTIAL_VOTE, PROJECT, VOTE } from "./mocks/data";

/* mock token */
const client = new Api(".eyJfdCI6IiIsImlkIjoiMzY0ODA2MDI5ODc2NTU1Nzc2In0=.");

describe("API getSelf test", () => {
  it("getSelf should work", () => {
    expect(client.getSelf()).resolves.toStrictEqual(PROJECT);
  });
});

describe("API postCommands test", () => {
  it("postCommands should work", () => {
    expect(
      client.postCommands([
        {
          id: "1",
          type: 1,
          application_id: "1",
          name: "test",
          description: "command description",
          default_member_permissions: "",
          version: "1"
        }
      ])
    ).resolves.toBeUndefined();
  });
});

describe("API getVote test", () => {
  it("getVote should return 200 when token is provided", () => {
    expect(client.getVote("1")).resolves.toStrictEqual(PARTIAL_VOTE);
  });

  it("getVote should throw error when no id is provided", () => {
    expect(client.getVote("")).rejects.toThrow(Error);
  });
});

describe("API getVotes test", () => {
  it("getVotes should work", async () => {
    const response = await client.getVotes(new Date("2026-01-01"));

    expect(response).toHaveProperty("votes", [VOTE]);
    expect(response.next()).resolves.toHaveProperty("votes", [VOTE]);
  });
});
