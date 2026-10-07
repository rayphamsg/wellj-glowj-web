import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STAGES } from "./stage.ts";

describe("stages", () => {
  it("defines the three planned stages", () => {
    assert.deepEqual([...STAGES], ["coming-soon", "crowdfunding", "launch"]);
  });
});
