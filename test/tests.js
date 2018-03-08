const chai = require('chai');
const chai_http = require('chai-http');
const models = require('../models');
const app = require('../app');

const SESSION_ID = 'valid_session_id';
const INVALID_SID = 'invalid_session_id';
const INVALID_TID = 'invalid_token_id';

const expect = chai.expect;
chai.use(chai_http);

before(async () => {
	
	await models.sequelize.sync();
	
	await models.User.bulkCreate([
		{ googleId: '0123ABCD', firstname: 'John', lastname: 'Smith', email: 'john.smith@gmail.com', sessionId: SESSION_ID },
		{ googleId: '4567EFGH', firstname: 'Dick', lastname: 'Smith', email: 'dick.smith@gmail.com', sessionId: null }
	]);
	
	await models.Video.bulkCreate([
		{ name: 'Video1', length: 10, userId: 1 },
		{ name: 'Video2', length: 10, userId: 1 },
		{ name: 'Video2', length: 10, userId: 2 }
	]);
})

describe('POST /login', () => {
	
	it('should allow return sign-in with valid session ID and return user', () => {
		return chai.request(app)
		.post('/api/login')
		.send({
			sessionId: SESSION_ID
		})
		.then((res) => {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.user).to.exist;
			expect(res.body.user.sessionId).to.equal(SESSION_ID);
			expect(res.body.user.firstname).to.equal('John');
		})
	})
	
	it('should prevent sign-in with invalid session ID and return error', () => {
		return chai.request(app)
		.post('/api/login')
		.send({
			sessionId: INVALID_SID
		})
		.catch(err => err.response)
		.then(res => {
			expect(res).to.have.status(400);
			expect(res).to.be.json;
			expect(res.body.error).to.exist;
		})
	})
	
	it('should prevent sign-in with invalid Google token ID and return error', () => {
		return chai.request(app)
		.post('/api/login')
		.send({
			token: INVALID_TID
		})
		.catch(err => err.response)
		.then(res => {
			expect(res).to.have.status(400);
			expect(res).to.be.json;
			expect(res.body.error).to.exist;
		})
	})
})

describe('GET /videos/:userId', () => {
	
	it('should NOT be unauthorized if proper session cookie is sent', () => {
		return chai.request(app)
		.get('/api/videos/1')
		.set('Cookie', 'sessionId=' + SESSION_ID)
		.then(res => {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
		})
	})

	it('should get videos only belonging to this user', () => {
		return chai.request(app)
		.get('/api/videos/1')
		.set('Cookie', 'sessionId=' + SESSION_ID)
		.then(res => {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.have.lengthOf(2);
			expect(res.body[0]).to.include({ name: 'Video1', length: 10, userId: 1 });
			expect(res.body[1]).to.include({ name: 'Video2', length: 10, userId: 1 });
		})
	})
	
	it('should refuse (401) if session id cookie is incorrect', () => {
		return chai.request(app)
		.get('/api/videos/1')
		.set('Cookie', 'sessionId=' + INVALID_SID)
		.catch(err => err.response)
		.then(res => {
			expect(res).to.have.status(401);
		})
	})

	it('should refuse (401) if no session id cookie is sent', () => {
		return chai.request(app)
		.get('/api/videos/1')
		.catch(err => err.response)
		.then(res => {
			expect(res).to.have.status(401);
		})
	})
})