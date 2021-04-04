import seperTest from 'supertest';
import { App } from '../../../app';
import { dataBase } from '../../../utils';

const api = seperTest(App);
const baseUrl = '/api/coupons';

describe('GET /user', () => {
    test('responds with json', async (done) => {
      return await api
        .get(baseUrl)
        .expect(200, done)
    });
});

afterAll(async () => {
  console.log('test')
  dataBase.destroy()
});