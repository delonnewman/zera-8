import ZMessage from "./ZMessage";
import { describe, it, expect } from "vitest";

describe(ZMessage, () => {
  const message = ZMessage.unary("to_s");

  describe("unary messages", () => {
    it("have a name", () => {
      expect(message.name).toEqual("to_s");
    });

    it("generates a hashCode based on value", () => {
      expect(ZMessage.unary("to_s").hashCode()).toEqual(
        ZMessage.unary("to_s").hashCode()
      );
    });

    it("can't be an attribute assignment", () => {
      const meta = new Map([['assignment', true]])

      expect(message.withMetaData(meta).isAssignment()).toBe(false);
    });
  });

  describe("binary messages", () => {
    const message = ZMessage.binary("+", 1);

    it("have a name", () => {
      expect(message.name).toEqual("+");
    });

    it("have an argument", () => {
      expect(message.argument).toEqual(1);
    });

    it("generates a hashCode based on value", () => {
      expect(message.hashCode()).toEqual(ZMessage.binary("+", 1).hashCode());
    });

    it("could be an attribute assignment", () => {
      const meta = new Map([['assignment', true]])

      expect(message.withMetaData(meta).isAssignment()).toBe(true);
    });
  });

  describe("keyword messages", () => {
    const message = ZMessage.keyword("send", { from: "Me", to: "You" });

    it("has a name", () => {
      expect(message.name).toEqual("send");
    });

    it("has keywords", () => {
      expect(message.keywords).toEqual(["from", "to"]);
    });

    it("provides access to arguments by keyword", () => {
      expect(message.keywordArgument("from")).toEqual("Me");
    });

    it("generates a hashCode based on value", () => {
      const other = ZMessage.keyword("send", { from: "Me", to: "You" });

      expect(message.hashCode()).toEqual(other.hashCode());
    });

    it("can't be an attribute assignment", () => {
      const meta = new Map([['assignment', true]])

      expect(message.withMetaData(meta).isAssignment()).toBe(false);
    });
  });

  describe("argument list messages", () => {
    const message = ZMessage.argumentList("log", [1, 2, 3]);

    it('has a name', () => {
      expect(message.name).toEqual("log");
    });

    it('has an argument list', () => {
      expect(message.argumentList).toEqual([1, 2, 3]);
    });

    it("generates a hashCode based on value", () => {
      const other = ZMessage.argumentList("log", [1, 2, 3]);

      expect(message.hashCode()).toEqual(other.hashCode());
    });

    it("can't be an attribute assignment", () => {
      const meta = new Map([['assignment', true]])

      expect(message.withMetaData(meta).isAssignment()).toBe(false);
    });
  });
});
