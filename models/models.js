const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username:{type: String, required: true},
	firstName:String,
	lastName:String, 
	age:Number,
	weight: Number,
	team: {type: String, required: true},
	workouts: [{ type: Schema.Types.ObjectId, ref: 'Workouts' }]

});

const workoutSchema = new mongoose.Schema({

})

const User  = mongoose.model('User', userSchema);
const Workouts = mongoose.model('Workouts', workoutSchema);