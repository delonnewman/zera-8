const isFunction = (object) =>
  Object.prototype.toString.call(object) === "[object Function]";

const EMPTY_ARRAY = Object.freeze([]);

let NIL = undefined; // initial definition;
let TRUE = undefined; // initial definition;
let FALSE = undefined; // initial definition;

export class ZObject {
  static CURRENT_ID = 0;
  #slotValues;

  constructor(klass = undefined) {
    this.object_id = CURRENT_ID++;
    this.hashCode = this.object_id;
    this.class = klass ?? new ZClass(); // if a class isn't given generate an eigen class
    this.#slotValues = {};
  }

  getSlotValue(name) {
    if (!this.class.hasSlot(name)) {
      throw new Error(`undefined slot ${name}`);
    }

    return this.#slotValues[name] ?? NIL;
  }

  setSlotValue(name, value) {
    if (!this.class.hasSlot(name)) {
      throw new Error(`undefined slot ${name}`);
    }

    // TODO: Add observability
    this.#slotValues[name] = value;

    return this;
  }

  defineMethod(...args) {
    return this.class.defineInstanceMethod(...args);
  }

  async send(method, args = EMPTY_ARRAY) {
    const data = this.findMethodData(method);
    if (method === undefined) return this.methodMissing(method, args);
    if (data.meta.private === TRUE) {
      // TODO: need to pass along the object / context to be able to handle properly
      return this.privateMethodCalled(method, args);
    }

    return data.body.apply(this, [this].concat(args));
  }

  methodMissing(method, args) {
    throw new Error(`undefined method ${method}`);
  }

  privateMethodCalled(method, args) {
    throw new Error(`private method ${method} called from `);
  }

  respondsTo(method) {
    return this.class.hasMethod(method);
  }

  findMethodData(method) {
    return this.class.findMethodData(method);
  }
}

// Treat JavaScript objects as Zera Objects
export class ZAlien extends ZObject {
  #alien;
  #methods;

  constructor(alien, methods = undefined) {
    this.#alien = alien;
    this.#methods = methods ?? new Set(methods);
  }

  async send(method, args = EMPTY) {
    if (this.#methods && !this.#methods.has(method)) {
      return this.methodMissing(method, args);
    }

    const fn = this.#alien[method];
    if (fn === undefined) {
      return this.methodMissing(method, args);
    }

    if (isFunction(fn)) {
      // TODO: add arity check
      return fn.apply(this.#alien, args);
    } else {
      // treat properties has zero-argument methods
      return fn;
    }
  }
}

export class ZClass extends ZObject {
  #slots;
  #instanceMethods;

  constructor(name = NIL, superclass = NIL) {
    super();
    this.name = name;
    this.superclass = superclass;
    this.#instanceMethods = {};
    this.#slots = {};
    // expose these methods for the ancestral classes
    this.class.defineInstanceMethods("allocate", this.allocate.bind(this));
    this.class.defineInstanceMethods("subclass", this.subclass.bind(this));
    this.class.defineInstanceMethods("class", () => Class);
  }

  defineSlot(name) {
    this.#slots[name] = true;
    return name;
  }

  hasSlot(name) {
    return this.#slots[name];
  }

  defineInstanceMethod(name, body, parameters = EMPTY_ARRAY, meta = {}) {
    this.#instanceMethods[name] = { parameters, body, meta };
    return name;
  }

  allocate() {
    return new ZObject(this);
  }

  hasMethod(method) {
    if (this.superclass === NIL) {
      return this.#instanceMethods[method] !== undefined;
    }
  }

  subclass(name) {
    return new ZClass(name, self);
  }
}

export const Symbol = new ZClass("Symbol");
export const Value = Symbol.subclass("Value");
export const Object$ = Value.subclass("Object");
export const Class = Object$.subclass("Class");

export const NilClass = Value.subclass("NilClass");
export const TrueClass = Value.subclass("TrueClass");
export const FalseClass = Value.subclass("FalseClass");

export const Dialog = Object$.subclass("Dialog");

NIL = NilClass.allocate();
TRUE = TrueClass.allocate();
FALSE = FalseClass.allocate();

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
Object.defineInstanceMethod("mutable?", (self) =>
  self.send("frozen?").send("not")
);
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
