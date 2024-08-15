import ZObject from "./ZObject";
import ZMessage from "./ZMessage";
import { describe, it, expect, describe as context } from "vitest";

describe(ZObject, () => {
  context("identity", () => {
    it("generates an object id", () => {
      expect(new ZObject().id).toBe(1);
    });

    it("generates a new object id for each object", () => {
      expect(new ZObject().id).not.toBe(new ZObject().id);
    });
  });

  context("messaging", () => {
    const to_s = ZMessage.unary("to_s");

    it("receives messages asynchronously", () => {
      expect(new ZObject().send(to_s)).toBeInstanceOf(Promise);
    });

    it("throws an error if the object isn't in a receiving state", async () => {
      expect.assertions(1);
      await expect(new ZObject().send(to_s)).rejects.toThrowError();
    });
  });
});
