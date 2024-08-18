import ZBasicObject from './ZBasicObject.js';
import { hashString, hashCombine, hashCode, isFunction } from './utils.js';

export default class ZMessage extends ZBasicObject {
  static unary(name, metaData = new Map()) {
    return new ZUnaryMessage(name, metaData);
  }

  static binary(name, argument, metaData = new Map()) {
    return new ZBinaryMessage(name, argument, metaData);
  }

  static keyword(name, keywordArguments, metaData = new Map()) {
    return new ZKeywordMessage(name, keywordArguments, metaData);
  }

  static argumentList(name, arglist, metaData = new Map()) {
    return new ZArgumentListMessage(name, arglist, metaData);
  }

  #name;
  #metaData;

  constructor(name, metaData) {
    super();
    this.#name = name;
    this.#metaData = metaData;
  }

  get name() { return this.#name }
  get metaData() { return this.#metaData }

  isAssignment() { return false }

  withMetaData(metaData) {
    this.subclassShouldImplement();
  }

  toArguments() {
    this.subclassShouldImplement();
  }

  hashCode() {
    this.subclassShouldImplement();
  }

  evaluateArguments() {
    this.subclassShouldImplement();
  }
}

class ZUnaryMessage extends ZMessage {
  #hashCode;

  withMetaData(metaData) {
    return new ZUnaryMessage(this.name, metaData);
  }

  toString() {
    return this.name.toString();
  }

  toArguments() {
    return [];
  }

  hashCode() {
    if (this.#hashCode === undefined) {
      this.#hashCode = hashString(this.name);
    }

    return this.#hashCode;
  }

  evaluateArguments() { return this }
}

class ZBinaryMessage extends ZMessage {
  #argument;
  #hashCode;

  constructor(name, argument, metaData) {
    super(name, metaData);
    this.#argument = argument;
  }

  get argument() { return this.#argument }

  withMetaData(metaData) {
    return new ZBinaryMessage(this.name, this.argument, metaData);
  }

  isAssignment() {
    return this.metaData.has('assignment');
  }

  toString() {
    return `${this.name}(${this.argument})`
  }

  toArguments() {
    return [this.argument];
  }

  hashCode() {
    if (this.#hashCode === undefined) {
      this.#hashCode = hashString(this.name);
    }

    return this.#hashCode;
  }

  evaluateArguments() {
    if (isFunction(this.#argument.value)) {
      this.#argument = this.#argument.value();
    }
    return this;
  }
}

class ZKeywordMessage extends ZMessage {
  #keywordArguments;
  #hashCode;

  constructor(name, keywordArguments, metaData) {
    super(name, metaData);
    this.#keywordArguments = keywordArguments;
  }

  get keywords() { return Object.keys(this.#keywordArguments) }

  keywordArgument(keyword) {
    const arg = this.#keywordArguments[keyword];
    if (arg === undefined) {
      throw new Error(`unknown keyword: ${keyword}`)
    }

    return arg;
  }

  withMetaData(metaData) {
    return new ZKeywordMessage(this.name, this.#keywordArguments, metaData);
  }

  toString() {
    const buffer = [this.name.toString()];
    buffer.push('(')

    const args = []
    for (const keyword of this.keywords) {
      args.push(`${keyword}: ${this.keywordArgument(keyword).toString()}`)
    }

    buffer.push(args.join(', '));
    buffer.push(')');

    return buffer.join('');
  }

  toArguments() {
    return this.keywordArguments;
  }

  hashCode() {
    if (this.#hashCode === undefined) {
      let code = 0;

      for (const keyword of this.keywords) {
        code += hashCombine(code, hashString(keyword));
      }

      this.#hashCode = code;
    }

    return this.#hashCode;
  }

  evaluateArguments() {
    const entries = Object.entries(this.#keywordArguments);

    this.#keywordArguments = entries.reduce((args, [key, value]) => {
      args[key] = isFunction(value.value) ? value.value() : value;
    }, {});

    return this;
  }
}

class ZArgumentListMessage extends ZMessage {
  #argumentList;
  #hashCode;

  constructor(name, argumentList, metaData) {
    super(name, metaData);
    this.#argumentList = argumentList;
  }

  get argumentList() { return this.#argumentList }

  toArguments() {
    return this.argumentsList;
  }

  withMetaData(metaData) {
    return new ZArgumentListMessage(this.name, this.argumentsList, metaData);
  }

  hashCode() {
    if (this.#hashCode === undefined) {
      let code = 0;

      for (const arg of this.argumentList) {
        code += hashCombine(code, hashCode(arg));
      }

      this.#hashCode = code;
    }

    return this.#hashCode;
  }

  evaluateArguments() {
    this.#argumentList = this.#argumentList.map(
      (value) => isFunction(value.value) ? value.value() : value
    );

    return this;
  }
}
