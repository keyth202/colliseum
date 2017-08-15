const state={
	username:undefined,
	firstName:undefined,
	lastName:undefined,
	email:undefined, 
	age:0,
	weight: 0,
	team: {type: undefined, 
	totalPoints: 0,
}

const newUser = {};

/** When the next button is clicked,
 * hide first half of form  and show second
 * When the form is submitted, make object
 * out of the whole form
 */


$(document).ready(function(){
	$('.next').click(function(e){
		e.preventDefault();
// Hide fist half of form, thenm show second half 

	})

	$('#signupform').submit(function(e){
		e.preventDefault
		takeProfile();
		sendProfile();
	});

});




function takeProfile(){

	var form = $('#signupform');

	var inputs = $('#signupform input');

	$.each(inputs, function(i, input){
		newUser[input.name] = input.value;
		newUser.team =$('#signupform select').val();
	});
	console.log(newUser);

	var params = newUser;

	$.ajax({
		type:"POST",
		data:params,
		dataType:'JSONP',
		url('/api/users'),
		succes: callback,
		error: function(data){
			console.log('failure');
		}
	});
}

function checkProfile(){

}

/*function sendProfile(){
	var params = newUser;

	$.ajax({
		type:"POST",
		data:params,
		dataType:'JSONP',
		url('/api/users'),
		succes: callback,
		error: function(data){
			console.log('failure');
		}
	});

} */