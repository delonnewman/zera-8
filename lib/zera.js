export const SYMBOL = new ZClass("Symbol");
export const VALUE  = Symbol.subclass("Value");
export const OBJECT = Value.subclass("Object");
export const CLASS  = Object$.subclass("Class");

export const NIL_CLASS = Value.subclass("NilClass");
export const TRUE_CLASS = Value.subclass("TrueClass");
export const FALSE_CLASS = Value.subclass("FalseClass");

function singlton(klass) {
  let instance = undefined;
  return function constructor() {
    if (instance == undefined) {
      instance = klass.allocate();
    }
    return instance;
  };
}

export const NIL   = singleton(NIL_CLASS);
export const TRUE  = singleton(TRUE_CLASS);
export const FALSE = singleton(FALSE_CLASS);

// Messaging Protocol
// Not sure what to do with the promise send will return, should it be a call frame or something like that?
Symbol.defineInstanceMethod(
  "send",
  async function (self, method, args) {
    return await self.send(method, args);
  },
  ["method", "arguments"]
);
Symbol.defineInstanceMethod(
  "respondsTo?",
  (self, method) => (self.respondsTo(method) ? TRUE : FLASE),
  ["method"]
);
Symbol.defineInstanceMethod(
  "ifRespondsTo",
  (self, method, block) =>
    self.respondsTo(method) ? block.call(self, self, method) : FALSE,
  ["method"]
);
Symbol.defineInstanceMethod(
  "methodMissing",
  (self, method, args) => self.methodMissing(method, args),
  ["method", "args"],
  { private: TRUE }
);
NilClass.defineInstanceMethod("respondsTo?", (self, method) => TRUE, [
  "method",
]);
NilClass.defineInstanceMethod(
  "ifRespondsTo",
  (self, method, block) => block.call(self, self, method),
  ["method"]
);
NilClass.defineInstanceMethod(
  "methodMissing",
  (self, method, args) => self,
  ["method", "args"],
  { private: TRUE }
);

// Creation Protocol
Class.defineInstanceMethod("allocate", (self) => new ZObject(self));
Class.defineSlot("name");
Class.defineInstanceMethod("name", (self) => self.getSlotValue("name"));
Class.defineMethod("subclass", async (self, classname) => {
  const klass = await self.send("allocate");
  klass.setSlotValue("name", classname);
  return klass;
});

Class.defineInstanceMethod("new", async (self) => {});

// Mutability Protocol
Symbol.defineInstanceMethod("mutable?", () => FALSE);
Object.defineInstanceMethod("mutable?", (self) => self.send("frozen?").send("not"));
Object.defineSlot("frozen");
Object.defineInstanceMethod(
  "initialize",
  (self) => {
    self.setSlotValue("frozen", FALSE);
  },
  { private: TRUE }
);
Object.defineInstanceMethod("frozen?", (self) => self.getSlotValue("frozen"));
Object.defineInstanceMethod("freeze!", (self) => {
  self.setSlotValue("frozen", TRUE);
  return self;
});

// Equality Protocol
Symbol.defineInstanceMethod("identical?", (self, other) =>
  self.object_id === other.object_id ? TRUE : FALSE
);
Symbol.defineInstanceMethod("==", (self, other) =>
  self.object_id === other.object_id ? TRUE : FALSE
);
Symbol.defineInstanceMethod("===", (self, other) =>
  self.object_id === other.object_id ? TRUE : FALSE
);
Symbol.defineInstanceMethod("hashCode", (self) => self.hashCode);
Symbol.defineInstanceMethod(
  "sameValue?",
  (self, other) => self.hashCode === self.hashCode
);

// Nil Protocol
Symbol.defineInstanceMethod("nil?", () => FALSE);
Symbol.defineInstanceMethod("ifNil", (self, block) => self, ["block"]);
Symbol.defineInstanceMethod(
  "ifNotNil",
  (self, block) => {
    block.call(self);
    return self;
  },
  ["block"]
);
NilClass.defineInstanceMethod(
  "ifNil",
  (self, block) => {
    block.call(self);
    return self;
  },
  ["block"]
);
NilClass.defineInstanceMethod("ifNotNil", (self, block) => self, ["block"]);
NilClass.defineInstanceMethod("nil?", () => TRUE);

// Boolean Protocol
TrueClass.defineInstanceMethod(
  "ifTrue",
  (self, block) => {
    block.call(self);
    return self;
  },
  ["block"]
);
TrueClass.defineInstanceMethod("ifFalse", (self, block) => self, ["block"]);
TrueClass.defineInstanceMethod("not", () => FALSE);
FalseClass.defineInstanceMethod("ifTrue", (self, block) => self, ["block"]);
FalseClass.defineInstanceMethod(
  "ifFalse",
  (self, block) => {
    block.call(self);
    return self;
  },
  ["block"]
);
FalseClass.defineInstanceMethod("not", () => TRUE);

// If/Else Protocol
Symbol.defineInstanceMethod(
  "if",
  (self, block) => {
    block.call(self);
    return self;
  },
  ["block"]
);
Symbol.defineInstanceMethod("else", (self, block) => self, ["block"]);
FalseClass.defineInstanceMethod("if", (self, block) => self, ["block"]);
FalseClass.defineInstanceMethod(
  "else",
  (self, block) => {
    block.call(self);
    return self;
  },
  ["block"]
);
NilClass.defineInstanceMethod("if", (self, block) => self, ["block"]);
NilClass.defineInstanceMethod(
  "else",
  (self, block) => {
    block.call(self);
    return self;
  },
  ["block"]
);
