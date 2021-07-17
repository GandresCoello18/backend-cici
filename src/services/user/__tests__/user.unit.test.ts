import { getUserUtil } from '../../../utils';

describe('TEST STORAGE USER', () => {
  test('obtener usuario', async () => {
    const users = await getUserUtil({ email: 'goyeselcoca@gmail.com' });

    expect(users).toHaveLength(1);
  });
});
