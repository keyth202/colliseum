const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {app, runServer, closeServer} = require('../server');
const {DATABASE_URL} = require('../config');
const {User} = require('../models/models');


const should = chai.should();

chai.use(chaiHttp);

function seedUserData(){
	console.info('Seeding blog data');
	const seedData =[];

	for(let i=0; i<=10; i++){
		seedData.push(generateUserData());
	}
	
	return User.insertMany(seedData);
}

function randomTeam(){
	const team = ['Ares','Apollo','Athena'];
	return team[Math.floor(Math.random()*2)];
}

function generateUserData(){
	return {
		username: faker.internet.userName(),
		email:faker.internet.email(),
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

// testing basic on

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

// testing Get endpoints

describe('This is the beginning of all the endpoint tests', function(){
		before(function(){
		return runServer(DATABASE_URL);
	});
	beforeEach(function(){
		//console.log(randomTeam());
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
					//console.log(res.body);


					res.body.forEach(function(users){
						//console.log(users);
						users.should.be.a('object');
						users.should.include.keys('id','username','email','firstName','lastName','age', 'weight','team','totalPoints');
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

		it('should return 1 users information', function(){
			const knownUser = generateUserData();
			

			User.create(knownUser)
				.then(function(){
					User.find({username: knownUser.username}).exec(function(err,resolve){
						if(err){
							console.log(err);
						} else {
							console.log('Resolve',resolve);
						}
					});
					console.log('End Results');
					//console.log(User.find().exec());
				});

			 

			return chai.request(app)
				.get(`/api/profile/${knownUser.username}`)
				.then(function(res){
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.should.have.length.of.at.least(1);

					res.body.forEach(function(users){
						users.should.be.a('object');
						users.should.include.keys('id','username','email','firstName','lastName','age', 'weight','team','totalPoints');
					});

					return res.body[0]
				})
				.then(function(res){
					console.log("res username", res.username);
					//console.log('fullres', res);
					res.username.should.to.equal(knownUser.username);
					res.firstName.should.to.equal(knownUser.firstName);
					res.lastName.should.to.equal(knownUser.lastName);
					res.age.should.to.equal(knownUser.age);
					res.weight.should.be.equal(knownUser.weight);
					res.team.should.be.equal(knownUser.team);
					res.totalPoints.should.be.equal(knownUser.totalPoints);
				}); 

		});



		it('should test the put endpoint and update fields', function(){
			const knownUser = generateUserData();

			const newData ={
				age:18,
				weight:400,
				team:'Athena'
			}

			return User.create(knownUser)
			.then(function(err,resolve){
						if(err){
							console.log(err);
						} else {
							console.log('User Has been Found With Put Test');
						}
					

				})			
			
					.then(function(){
						//console.log('Before Chai request');

						 chai.request(app)
						.put(`/api/profile/${knownUser.username}/update`)
						.send(newData)
						.then(res =>{         
							//console.log('Chai request before tests');
				          	res.should.have.status(201);
				          	res.should.be.json;
				          	res.body.should.be.a('object');

		           		return res.body[0]

				})
				.then(users =>{
					//console.log('Here is the user',users.username);
					users.username.should.to.equal(knownUser.username);
					users.firstName.should.to.equal(knownUser.firstName);
					users.lastName.should.to.equal(knownUser.lastName);
					users.age.should.to.equal(newData.age);
					users.weight.should.not.be.equal(newData.weight);
					users.team.should.be.equal(newData.team);
					users.totalPoints.should.be.equal(knownUser.totalPoints);
				});	
			});	
		}); 


		// Starting the POST test 

		it('should post a new user to the database', function(){
			const addUser = generateUserData(); 

			return chai.request(app)
				.post('/api/users')
				.send(addUser)
				.then(res =>{
					res.should.have.status(201);
	        		res.should.be.json;
	        		res.body.should.be.a('object');
	        		res.body.should.include.keys('id','username','firstName','lastName','age', 'weight','team','totalPoints');
				return User.findById(res.body.id).exec();
				})
				.then(function(user){
					users.username.should.to.equal(addUser.username);
					users.firstName.should.to.equal(addUser.firstName);
					users.lastName.should.to.equal(addUser.lastName);
					users.age.should.to.equal(addUser.age);
					users.weight.should.not.be.equal(addUser.weight);
					users.team.should.be.equal(addUser.team);
					users.totalPoints.should.be.equal(addUser.totalPoints)
				});
		});

	
});
/*
// Post tests
describe('Test Post endpoint', function(){
	it('should post a new user', function(){
		const addUser = generateUserData();
	})

	return chai.request(app)
		.post('/api/')



})
*/
/*describe('Put endpoint', function(){
	it('should update fields', function(){
		const knownUser = generateUserData();

		const newData ={
			age:18,
			weight:400,
			team:'Athena'
		}

		return User.create(knownUser)
		.then(function(err,resolve){
					if(err){
						console.log(err);
					} else {
						console.log('User Has been Found With Put Test');
					}
				

			})			
		
				.then(function(){
					console.log('Before Chai request');

					 chai.request(app)
					.put(`/api/profile/${knownUser.username}/update`)
					.send(newData)
					.then(res =>{         
						console.log('Chai request before tests');
			          	res.should.have.status(201);
			          	res.should.be.json;
			          	res.body.should.be.a('object');

	           		return res.body[0]

			})
			.then(users =>{
				console.log('Here is the user',users.username);
				users.username.should.to.equal(knownUser.username);
				users.firstName.should.to.equal(knownUser.firstName);
				users.lastName.should.to.equal(knownUser.lastName);
				users.age.should.to.equal(newData.age);
				users.weight.should.not.be.equal(newData.weight);
				users.team.should.be.equal(newData.team);
				users.totalPoints.should.be.equal(knownUser.totalPoints);
			});	
		});	
	}); 
});


*/


