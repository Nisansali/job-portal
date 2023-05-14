const request = require('supertest')
const app = require('../app')

describe('POST /auth/login', () => {
    it('Should not login non existing user', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                email: 'someone@example.com',
                password: 'MyPass777!'
            }).expect(401)
    });

    it('Should login existing user', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                email: 'john@example.com',
                password: 'MyPass777!'
            }).expect(200)
    });
});