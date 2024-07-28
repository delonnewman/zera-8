const { ZObject } = await import('../../lib/zera.js');

describe(ZObject, () => {
  const object = new ZObject();

  describe('send', () => {
    it('throws and undefined method error', () => {
      expect(() => { object.send('testing') }).toThrow(/undefined method/);
    })
  });
});
