import ZObject from './ZObject'

// Treat JavaScript objects as Zera Objects
export default class ZAlien extends ZObject {
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
