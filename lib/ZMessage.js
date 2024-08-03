export default class ZMessage {
  static unary(name) {
    return new ZUnaryMessage(name);
  }

  static binary(name, argument) {
    return new ZBinaryMessage(name, argument);
  }

  static keyword(name, keywordArguments) {
    return new ZKeywordMessage(name, keywordArguments);
  }

  #name;
  #argument;
  #keywordArguments;

  constructor(name, argument, keywordArguments) {
    this.#name = name;
    this.#argument = argument;
    this.#keywordArguments = keywordArguments;
  }

  get name() { return this.#name }
  get argument() { return this.#argument }
  get keywords() { return Object.keys(this.#keywordArguments) }

  keywordArgument(keyword) {
    const arg = this.#keywordArguments[keyword];
    if (arg === undefined) {
      throw new Error(`unknown keyword: ${keyword}`)
    }

    return arg;
  }

  isUnary() {
    return false;
  }

  isBinary() {
    return false;
  }

  isKeyword() {
    return false;
  }
}

class ZUnaryMessage extends ZMessage {
  constructor(name) {
    super(name, undefined, undefined);
  }

  isUnary() {
    return true;
  }

  toString() {
    return this.name.toString();
  }
}

class ZBinaryMessage extends ZMessage {
  constructor(name, argument) {
    super(name, argument, undefined);
  }

  isBinary() {
    return true;
  }

  toString() {
    return `${this.name}(${this.argument})`
  }
}

class ZKeywordMessage extends ZMessage {
  constructor(name, keywordArguments) {
    super(name, undefined, keywordArguments);
  }

  isKeyword() {
    return true;
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
}
