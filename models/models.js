const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username:{type: String, required: true},
	firstName:String,
	lastName:String, 
	age:Number,
	weight: Number,
	team: {type: String, required: true},
	totalPoints: {type: String, required: true},
	//workouts: [{ type: Schema.Types.ObjectId, ref: 'Workouts' }]

});

const workoutSchema = new mongoose.Schema({
	//_creator : { type: Number, ref: 'User' },
	weight : Number,
	type: String, 
	distance: Number,
	timeSpent: Number, 
	points: Number, 

});

userSchema.methods.apiRepr = function(){
	return{
		id:this._id,
		username: this.username,
		firstName: this.firstName,
		lastName: this.lastName,
		age: this.age,
		weight: this.weight,
		team: this.team,
		totalPoints: this.totalPoints
	};
}


const User  = mongoose.model('User', userSchema);
const Workouts = mongoose.model('Workouts', workoutSchema);

module.exports ={User, Workouts};