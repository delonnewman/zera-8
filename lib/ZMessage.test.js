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
  });

  describe("keyword messages", () => {
    const message = ZMessage.keyword("send", { from: "Me", to: "You" });

    it("have a name", () => {
      expect(message.name).toEqual("send");
    });

    it("have keywords", () => {
      expect(message.keywords).toEqual(["from", "to"]);
    });

    it("provides access to arguments by keyword", () => {
      expect(message.keywordArgument("from")).toEqual("Me");
    });

    it("generates a hashCode based on value", () => {
      const other = ZMessage.keyword("send", { from: "Me", to: "You" });

      expect(message.hashCode()).toEqual(other.hashCode());
    });
  });
});
