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
			res.render('profile', {users});
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

router.post('/users', (req,res)=>{
	const requiredFields =['username','team'];
	for (let i=0; i<requiredFields.length; i++) {
    	const field = requiredFields[i];
   		 if (!(field in req.body)) {
     		const message = `Missing \`${field}\` in request body`;
     		console.error(message);
      		return res.status(400).send(message);
   		 }
 	}
 	console.log(req.body);
	User
		.create({
			username:req.body.username,
			email:req.body.email,
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

router.put('/profile/:username/update', (req,res)=>{

	const updateFields = ['firstName','lastName','age', 'weight','team'];
	
	const toUpdate = req.body; 
	console.log('From the Route', req.body);
	
	updateFields.forEach(field =>{
		if(field in req.body){
			toUpdate[field] = req.body[field]
		}
	}); 

	//console.log(toUpdate);

	User.findOneAndUpdate({username:req.params.username},{$set:toUpdate}, {new:true})
		.exec()
    	.then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
    	.catch(err => res.status(500).json({message: 'Internal server error'}));
    console.log('End of the put function on apiroute', req.params.username);
});
	

router.delete('/profile/:id', (req,res) =>{
	User
		.findByIdAndRemove(req.params.id)
		.exec()
		.then(users => res.status(204).json({message:'Profile Deleted'}))
		.catch(err => res.status(500).json({message:'Internal Server Error'}))
});





module.exports = router;