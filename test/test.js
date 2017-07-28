const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

const should = chai.should();

chai.use(chaiHttp);

describe('Intial Test', function(){
	it('should return a 200', function(){
		return chai.request(app)
			.get('/index')
			.then(function(_res){
				res = _res;
				res.should.have.status(200);
			});

	});
});