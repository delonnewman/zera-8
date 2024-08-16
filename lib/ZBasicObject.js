import ZObject from './ZObject.js';
import JavaScript from './JavaScript';
import { isFunction } from './utils.js';

export default class ZBasicObject extends ZObject {
  async send(message) {
    return JavaScript.messageDispatch(this, message);
  }
}
