import ZBasicObject from './ZBasicObject.js';
import ZBinding from './ZBinding.js';
import { copyArray } from './utils.js';

export default class ZScript extends ZBasicObject {
  #statements;
  #binding;

  constructor() {
    super();
    this.#statements = [];
    this.#binding = new ZBinding();
  }

  get binding() { return this.#binding }
  get length() { return this.#statements.length }

  get statements() {
    return Object.freeze(copyArray(this.#statements));
  }

  say(subject, message) {
    this.sayAndAwait(subject, message);
    return this;
  }

  sayAndAwait(subject, message) {
    const statement = new ZStatement(this, subject, message);
    this.#statements.push(statement);
    return statement;
  }

  identify(statement, { as: name }) {
    this.#binding.setName(name, statement);
    return this;
  }

  callUpon(name) {
    return this.#binding.getValueOf(name);
  }

  perform() {
    let result;
    for (const statement of this.#statements) {
      result = statement.execute();
    }
    return result;
  }

  toString() {
    return this.#statements.join(";\n");
  }
}

export class ZStatement extends ZBasicObject {
  #script;
  #subject;
  #messageChain;
  #value;

  constructor(script, subject, message) {
    super();
    this.#script = script;
    this.#subject = subject;
    this.#messageChain = [message];
  }

  get subject() { return this.#subject }
  get length() { return this.#messageChain.length }

  get value() {
    if (this.#value === undefined) {
      return this.execute();
    }

    return this.#value
  }

  andThenSay(message) {
    this.#messageChain.push(message);
    return this;
  }

  say(subject, message) {
    return this.#script.say(subject, message);
  }

  execute() {
    this.#value = this.#messageChain.reduce(
      (subject, message) => subject.send(message),
      this.#subject
    );
    return this.#value;
  }

  toString() {
    return `${this.#subject}.${this.#messageChain.join('.')}`;
  }
}
