import ZBasicObject from './ZBasicObject.js';
import ZBinding from './ZBinding.js';

export default class ZScript extends ZBasicObject {
  #statements;
  #binding;

  constructor() {
    super();
    this.#statements = [];
    this.#binding = new ZBinding();
  }

  get length() { return this.#statements.length }
  get binding() { return this.#binding }

  say(subject, message) {
    this.#statements.push(new ZStatement(subject, message));
    return this;
  }

  sayAndAwait(subject, message) {
    const statement = new ZStatement(subject, message);
    this.say(statement);
    return statement;
  }

  identify(statement, { as: name }) {
    this.#binding.setName(name, statement);
    return this;
  }

  callUpon(name) {
    return this.#binding.getValueOf(name);
  }
}

export class ZStatement {
  #script;
  #subject;
  #messageChain;

  constructor(script, subject, message) {
    this.#script = script;
    this.#subject = subject;
    this.#messageChain = [message];
  }

  get subject() { return this.#subject }
  get length() { return this.#messageChain.length }

  andThenSay(message) {
    this.#messageChain.push(message);
    return this;
  }

  say(subject, message) {
    return this.#script.say(subject, message);
  }
}
