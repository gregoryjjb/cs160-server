const chai = require('chai');
const chai_http = require('chai-http');
const models = require('../models');
const app = require('../app');

const SESSION_ID = 'valid_session_id';
const INVALID_SID = 'invalid_session_id';

const expect = chai.expect;
chai.use(chai_http);

beforeEach(async function() {
	
	await models.sequelize.sync();
	
	await models.User.bulkCreate([
		{ googleId: '0123ABCD', firstname: 'John', lastname: 'Smith', email: 'john.smith@gmail.com', sessionId: SESSION_ID }
	]);
})

describe('POST /login', function() {
	
	it('should allow return sign-in with valid session ID and return user', function() {
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
	
	it('should prevent sign-in with invalid session ID and return error', function() {
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
})