const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {DATABASE_URL} = require('../config');
const {User} = require('../models/models');


const should = chai.should();

chai.use(chaiHttp);

function seedUserData(){
	console.info('Seeding blog data');
	const seedData =[];

	for(let i=0; i<=10; i++){
		seedData.push(generateBlogData());
	}
	
	return User.insertMany(seedData);
}

function randomTeam(){
	const teamName = ['Ares','Apollo','Athena'];
	return teamName[Math.floor(Math.random()*2)];
}

function generateUserData(){
	return {
		username: faker.internet.userName(),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		age: faker.random.number({min:16, max:99}),
		weight: faker.random.number({min:100, max:300}),
		team: randomTeam(),
		totalPoints: faker.random.number({min:0, max:400})
	}
}	

function tearDownDB(){
  	return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}


describe('Intial Test', function(){
	it('should return a 200', function(){
		return chai.request(app)
			.get('/')
			.then(function(_res){
				res = _res;
				res.should.have.status(200);
			});

	});
});

describe('Get tests', function(){
		before(function(){
		return runServer(DATABASE_URL);
	});
	beforeEach(function(){
		return seedUserData();
	});
	afterEach(function(){
		return tearDownDB();
	});
	after(function() {
    	return closeServer();
 	});

	it('should return all users', function(){
		return chai.request(app)
			.get('/api/profile')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.should.have.length.of.at.least(1);
				res.body.forEach(function(users){
					users.should.be.a('object');
					users.should.include.keys('id','username','firstName','lastName','age', 'weight','team','totalPoints');
				});

				userOne = res.body[0];

				return User.findById(userOne.id).exec();
			})
			.then(users => {
				userOne.username.should.equal(users.username);
				userOne.firstName.should.equal(users.firstName);
				userOne.lastName.should.equal(users.lastName);
				userOne.team.should.equal(users.team);
			});
	});
});