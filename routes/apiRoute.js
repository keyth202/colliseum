const express = require('express');
const router = express.Router();

const {User, Workouts} = require('../models/models');
const {PORT, DATABASE_URL} = require('../config');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

router.get('/profile', (req,res) => {
	User.find().exec()
		.then(users => {
			res.json( users.map( users => users.apiRepr))
		})
		.catch(err => {
        	console.error(err);
        	res.status(500).json({message: 'Internal server error'});
    });
});


module.exports = router;