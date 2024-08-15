import ZDispatch from "./ZDispatch";
import ZObject from "./ZObject";

export default class ZDialog extends ZObject {
  #dispatches;

  constructor() {
    super();
    this.#dispatches = [];
  }

  isSlotUndefined(_name) {
    return false;
  }

  send() {}

  then(dispatch) {
    this.dispatches.push(dispatch);
  }

  return() {}
}
