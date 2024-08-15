import ZClass from "./ZClass";
import ZDialog from "./ZDialog";
import ZDispatch from "./ZDispatch";

export const SYMBOL = new ZClass("Symbol");
export const VALUE = SYMBOL.subclass("Value");
export const OBJECT = VALUE.subclass("Object");
export const CLASS = OBJECT.subclass("Class");

export const NIL_CLASS = VALUE.subclass("NilClass");
export const TRUE_CLASS = VALUE.subclass("TrueClass");
export const FALSE_CLASS = VALUE.subclass("FalseClass");

function singleton(klass) {
  let instance = undefined;
  return function constructor() {
    if (instance == undefined) {
      instance = klass.allocate();
    }
    return instance;
  };
}

export const NIL = singleton(NIL_CLASS);
export const TRUE = singleton(TRUE_CLASS);
export const FALSE = singleton(FALSE_CLASS);

// Messaging Protocol
SYMBOL.defineInstanceMethod(
  ZMessageTemplate.keyword("ifResponds", ["to", "do"]),
  (self, method, block) =>
    self.respondsTo(method) ? block.invoke(method) : FALSE()
);
SYMBOL.defineInstanceMethod(
  ZMessageTemplate.binary("methodMissing"),
  (self, message) => self.methodMissing(message)
);
NIL_CLASS.defineInstanceMethod(
  ZMessageTemplate.keyword("ifResponds", ["to", "do"]),
  (self, method, block) => block.call(self, self, method)
);
NIL_CLASS.defineInstanceMethod(
  ZMessageTemplate.binary("methodMissing"),
  (self, method, args) => self
);

// Creation Protocol
CLASS.defineInstanceMethod(
  ZMessageTemplate.unary("allocate"),
  (self) => new ZObject(self)
);
CLASS.defineSlot("name");
CLASS.defineInstanceMethod(ZMessageTemplate.unary("name"), (self) =>
  self.getVariable("name").getValue()
);
CLASS.defineMethod(
  ZMessageTemplate.unary("subclass"),
  // async (self, classname) => {
  //   const klass = await self.send(ZMessage.unary("allocate"));
  //   klass.setVariable("name", classname);
  //   return klass;
  // },
  new ZBlock(
    ["classname"],
    new ZDialog()
      .setVariable("klass", ZDispatch.send(ZMessage.unary("allocate"), "self"))
      .send(
        ZMessage.binary("setVariable", new ZVariableReference("classname")),
        new ZVariableReference("klass")
      )
  )
);

CLASS.defineInstanceMethod("new", async (self) => {});

// Mutability Protocol
Symbol.defineInstanceMethod("mutable?", () => FALSE());
Object.defineInstanceMethod("mutable?", (self) =>
  self.send("frozen?").send("not")
);
Object.defineSlot("frozen");
Object.defineInstanceMethod(
  "initialize",
  (self) => {
    self.setSlotValue("frozen", FALSE());
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
  self.object_id === other.object_id ? TRUE() : FALSE()
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
