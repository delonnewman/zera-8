import ZObject from './ZObject';
import { describe, it, expect, describe as context } from 'vitest';

describe(ZObject, () => {
  context('identity', () => {
    it('generates an object id', () => {
      expect(new ZObject().objectId).toBe(1);
    });

    it('generates a new object id for each object', () => {
      expect(new ZObject().objectId).not.toBe(new ZObject().objectId);
    });
  });
});
