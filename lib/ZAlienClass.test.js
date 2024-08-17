import ZAlienClass from './ZAlienClass';
import ZMessage from './ZMessage';
import { describe, it, expect } from 'vitest';

describe(ZAlienClass, () => {
  const describedClass = ZAlienClass;

  it('treats new as a message', async () => {
    const ZDate = describedClass.new(Date);
    const init = ZMessage.unary('new');
    const year = ZMessage.unary('getFullYear');

    const now = await ZDate.send(init);

    await expect(now.send(year)).resolves.to.equal(new Date().getFullYear());
  });
});
