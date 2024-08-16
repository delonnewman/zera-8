import ZBasicObject from "./ZBasicObject";
import ZMessage from "./ZMessage";
import { describe, it, expect, describe as context } from "vitest";

describe(ZBasicObject, () => {
  const describedClass = ZBasicObject;

  context("identity", () => {
    it("generates an object id", () => {
      expect(new describedClass().id).to.be.a('number');
    });

    it("generates a new object id for each object", () => {
      expect(new describedClass().id).not.toBe(new describedClass().id);
    });
  });

  context("messaging", () => {
    it("receives messages asynchronously", () => {
      const object = new describedClass();
      const id = ZMessage.unary("id");

      expect(object.send(id)).to.be.instanceOf(Promise);
    });

    it('throws an error when a message is unknown', async () => {
      const object = new describedClass();
      const someMessage = ZMessage.unary("someMessage");

      await expect(object.send(someMessage)).rejects.to.throw(/unknown method/)
    });
  });
});
