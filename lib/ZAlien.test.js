import ZAlien from './ZAlien';
import ZMessage from './ZMessage';
import { describe, it, expect } from 'vitest';

describe(ZAlien, () => {
  const alien = new ZAlien({
    two: 2,
    one() { return 1 }
  });

  it('responds to messages that correspond to JS methods', () => {
    expect(alien.send(ZMessage.unary('one'))).resolves.toEqual(1);
  });

  it('responds to messages that correspond to JS properties', () => {
    expect(alien.send(ZMessage.unary('two'))).resolves.toEqual(2);
  });

  it('throws an error if there is no corresponding method or property', () => {
    expect(alien.send(ZMessage.unary('someRandomMessage'))).rejects.toThrowError(/unknown method/);
  });

  it('can assign property values to the subject', () => {
    alien.send(ZMessage.binary('two', 3, new Map([['assignment', true]])));


    expect(alien.send(ZMessage.unary('two'))).resolves.toEqual(3);
  });
});
