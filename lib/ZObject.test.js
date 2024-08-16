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
      const object = new ZObject();

      expect(object.send(to_s)).toBeInstanceOf(Promise);
    });

    it('can respond to messages with a receiver', () => {
      expect.assertions(1);

      const object = new ZObject();
      object.receive((message) => {
        expect(message.name).toEqual('to_s')
      });

      object.send(to_s);
    });

    it('throws an error when trying to set a receiver if one is already set', () => {
      const object = new ZObject();

      object.receive(() => {});

      expect(() => { object.receive(() => {}) }).toThrowError(/receiver has been set/);
    });
  });
});
