const express = require('express');
const router = express.Router();

const {User, Workouts} = require('../models/models');
const {PORT, DATABASE_URL} = require('../config');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

mongoose.Promise = global.Promise;

router.get('/profile', (req,res) => {
	User.find().exec()
		.then(users => {
			res.json( users.map( users => users.apiRepr()));
		})
		.catch(err => {
        	console.error(err);
        	res.status(500).json({message: 'Internal server error'});
    });
});

router.get('/profile/:username', (req,res)=>{
	User.find({username: req.params.username}).exec()
		.then(users =>{
			console.log('Requested Username',req.params.username)
			res.json(users.map(users => users.apiRepr()));
		})
	    .catch(err => {
	      console.error(err);
	      res.statys(500).json({message: 'Internal server error'});
	    });
})

router.post('/', (req,res)=>{
	const requiredFields =['username','team'];
	for (let i=0; i<requiredFields.length; i++) {
    	const field = requiredFields[i];
   		 if (!(field in req.body)) {
     		const message = `Missing \`${field}\` in request body`;
     		console.error(message);
      		return res.status(400).send(message);
   		 }
 	}

	User
		.create({
			username:req.body.username,
			firstName:req.body.firstName,
			lastName:req.body.lastName, 
			age:req.body.age,
			weight: req.body.weight,
			team: req.body.team,
			totalPoints: 0,
			})
		.then(users => res.status(201).json(users.apiRepr()))
		.catch(err => {
		    console.error(err);
		    res.status(500).json({error:'Internal Server Error'});
		});
});

router.put('/profile/:id', (req,res)=>{

	const requiredFields = ['username','firstName','lastName','age', 'weight','team','totalPoints'];

  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({error:'Ids do not match'});
  }
	const toUpdate ={}; 
	
	requiredFields.forEach(field =>{
		if(field in req.body){
			toUpdate[field] = req.body[field]
		}
	})


     User
    	.findByIdAndUpdate(req.params.id, {$set:toUpdate}, {new:true})
   		.exec()
    	.then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
    	.catch(err => res.status(500).json({message: 'Internal server error'}));
			
});
	





module.exports = router;