import ZMessage from './ZMessage';
import ZMessageTemplate from './ZMessageTemplate';
import { describe, it, expect } from 'vitest';

describe(ZMessageTemplate, () => {
  const template = ZMessageTemplate.unary('to_s');

  describe('unary messages', () => {
    it('have a name', () => {
      expect(template.name).toEqual('to_s');
    });

    it('generates a hashCode based on value', () => {
      expect(template.hashCode()).toEqual(ZMessageTemplate.unary('to_s').hashCode())
    });

    it('is hash equal to the equivalent message', () => {
      const message = ZMessage.unary('to_s');

      expect(template.hashCode()).toEqual(message.hashCode());
    });
  });

  describe('binary messages', () => {
    const template = ZMessageTemplate.binary('+');

    it('have a name', () => {
      expect(template.name).toEqual('+');
    });

    it('generates a hashCode based on value', () => {
      expect(template.hashCode()).toEqual(ZMessageTemplate.binary('+').hashCode())
    });

    it('is hash equal to the equivalent message', () => {
      const message = ZMessage.binary('+', 1);

      expect(template.hashCode()).toEqual(message.hashCode());
    });
  });

  describe('keyword messages', () => {
    const template = ZMessageTemplate.keyword('send', ['from', 'to']);

    it('have a name', () => {
      expect(template.name).toEqual('send');
    });

    it('have keywords', () => {
      expect(template.keywords).toEqual(['from', 'to']);
    });

    it('generates a hashCode based on value', () => {
      const other = ZMessageTemplate.keyword('send', ['from', 'to']);

      expect(template.hashCode()).toEqual(other.hashCode())
    });

    it('is hash equal to the equivalent message', () => {
      const message = ZMessage.keyword('send', { from: 'Me', to: 'You' });

      expect(template.hashCode()).toEqual(message.hashCode());
    });
  })
});
