import ZDispatch from './ZDispatch';

export default class ZDialog {
  #dispatches;

  constructor() {
    this.#dispatches = [];
  }

  assignVariable(name, value) {

  }

  send(...args) {
    this.dispatches.push(ZDispatch.send(...args));
  }

  return(value) {

  }
}
