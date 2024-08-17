import ZAlien from './ZAlien.js';

export default class ZAlienClass extends ZAlien {
  static OBJECTS = new WeakMap();

  static new(constructor) {
    if (!this.OBJECTS.has(constructor)) {
      this.OBJECTS.set(constructor, new this(constructor));
    }

    return this.OBJECTS.get(constructor);
  }
  
  async send(message) {
    if (message.name === 'new') {
      return new ZAlien(new this.subject(...message.toArguments()));
    }
    return super.send(message);
  }
}
