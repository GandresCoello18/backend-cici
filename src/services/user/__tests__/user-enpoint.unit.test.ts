import seperTest from 'supertest';
import { App } from '../../../app';

const api = seperTest(App);
const baseUrl = '/api/users';

describe('TEST /user', () => {
    it('todos los usuarios', (done) => {
      api
        .get(baseUrl)
        .expect(401, done)
    });

    it('obtener mi user', (done) => {
      api
        .get(`${baseUrl}/me`)
        .set('Authorization', 'Bearer fwfreffw')
        .expect(401, done)
    });

    it('invitacion usuario', (done) => {
      api
      .get(`${baseUrl}/invite/gandresCoello`)
      .expect(200, done);
    });
});