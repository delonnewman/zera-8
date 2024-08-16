import ZBinaryOp from './ZBinaryOp';
import { describe, it, expect } from 'vitest';

describe(ZBinaryOp, () => {
  it('performs operations atomically', () => {
    const op = ZBinaryOp.add();
    op.firstTerm = 1
    op.secondTerm = 3

    expect(op.perform()).toBe(4);
  });

  it("won't permit first term to be set twice", () => {
    const op = ZBinaryOp.add();
    op.firstTerm = 1

    expect(() => { op.firstTerm = 3 }).toThrowError(/first term has been set/);
  });

  it("won't permit second term to be set twice", () => {
    const op = ZBinaryOp.add();
    op.secondTerm = 1

    expect(() => { op.secondTerm = 3 }).toThrowError(/second term has been set/);
  });

  it('resets the terms when the operation is performed', () => {
    const op = ZBinaryOp.add();
    op.firstTerm = 1;
    op.secondTerm = 3;
    op.perform();
    op.firstTerm = 4;
    op.secondTerm = 5;

    expect(op.perform()).toBe(9);
  });
});
