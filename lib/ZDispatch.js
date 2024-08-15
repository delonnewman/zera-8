export default class ZDispatch {
  static async send(toObject, message) {
    return toObject.send(message);
  }
}
