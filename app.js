var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var users = {'k':'k'}
var userLog;
var ballsAmpunt = 70;
var smallBallColor = '#04ff00';
var mediumBallColor = '#ff0000';
var largeBallColor = '#1100ff';
var time_remaining = 60;
var monstersAmount = 4;
var keysControls = {'keyUp': 38, 'keyDown': 40, 'keyLeft': 37, 'keyRight': 39}
var tmpUpKey = 38;
var tmpDownKey = 40;
var tmpLeftKey = 37;
var tmpRightKey = 39;



$(document).ready(function() {
	switchDivs('configurationDiv');

	$('#registerForm').validate({
		rules: {
			firstname: {
				required: true,
				lettersonly: true
			},
			lastname: {
				required: true,
				lettersonly: true
			},
			email: {
			  required: true,
			  email: true
			},
			passWord: {
			  required: true,
			  minlength: 6,
			  strongPassword: true
			},
			username: {
				required: true,
				validateUserName: true
			}
		  },
		  // Specify validation error messages
		  messages: {
			firstname: {
				required: "Please enter your first name",
				lettersonly: "First name must contains letters only"
			},
			lastname:  {
				required: "Please enter your last name",
				lettersonly: "Last name must contains letters only"
			},
			passWord: {
			  required: "Please provide a password",
			  minlength: "Your password must be at least 6 characters long",
			  strongPassword: "Your password must contains letters and numbers"
			},
			email: {
				required: "Please enter your email",
				email: "Please enter a valid email address"
			},
			username: {
				required: "Please enter your user name",
				validateUserName: "User name you choose already exist"
			}
		  },
		  submitHandler: function(form) {
			register();

			let regForm = $("#registerForm");
			regForm[0].reset();
		  }

	});

	$('#configurationForm').validate({
		rules: {
			upKey: {
				differentKey: '#upKey'
			},
			downKey: {
				differentKey: '#downKey'
			},
			leftKey:{
				differentKey: '#leftKey'
			},
			rightKey:{
				differentKey: '#rightKey'
			}
		},

		messages: {
			downKey: {
				differentKey: 'There is already an identicall key selected'
			},
			leftKey:{
				differentKey: 'There is already an identicall key selected'
			},
			rightKey:{
				differentKey: 'There is already an identicall key selected'
			},
			upKey:{
				differentKey: 'There is already an identicall key selected'
			}
		},

		submitHandler: function(form) {
			configurate();

			let regForm = $("#configurationForm");
			regForm[0].reset();
		  }
	});

	context = canvas.getContext("2d");
	Start();
});

$(function() {
	$.validator.addMethod('validateUserName', function (value, element) {
		return !(value in users);
	});

	$.validator.addMethod('strongPassword', function (value, element) {
		return this.optional(element) || /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(value);
	});

	$.validator.addMethod('differentKey', function (value, element, param) {
		let comp = true;
		if (param.localeCompare('#upKey') != 0){
			let val = document.getElementById("upKey").value;
			comp = comp && value.localeCompare(val) != 0;
		}
		if (param.localeCompare('#leftKey') != 0){
			let val = document.getElementById("leftKey").value;
			comp = comp && value.localeCompare(val) != 0;
		}
		if (param.localeCompare('#downKey') != 0){
			let val = document.getElementById("downKey").value;
			comp = comp && value.localeCompare(val) != 0;
		}
		if (param.localeCompare('#rightKey') != 0){
			let val = document.getElementById("rightKey").value;
			comp = comp && value.localeCompare(val) != 0;
		}
		return comp;
	});
});


function kyeConfig(event, inputField){
	event.preventDefault();
	inputField.value = event.key;
	if(inputField.id.localeCompare('upKey') == 0){
		tmpUpKey = event.keyCode;
	}
	else if(inputField.id.localeCompare('downKey') == 0){
		tmpDownKey = event.keyCode;
	}
	else if(inputField.id.localeCompare('leftKey') == 0){
		tmpLeftKey = event.keyCode;
	}
	else if(inputField.id.localeCompare('rightKey') == 0){
		tmpRightKey = event.keyCode;
	}
}

function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 150);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[keysControls['keyUp']]) {
		return 1;
	}
	if (keysDown[keysControls['keyDown']]) {
		return 2;
	}
	if (keysDown[keysControls['keyLeft']]) {
		return 3;
	}
	if (keysDown[keysControls['keyRight']]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}



function switchDivs(divStr){
	$("#welcomeDiv").hide();
	$("#registerDiv").hide();
	$("#loginDiv").hide();
	$("#gameDiv").hide();
	$("#configurationDiv").hide();

	$("#"+ divStr).show();
}


function validateLoginForm(){
	var submittedForm = document.forms["loginForm"];
	var userName = submittedForm["userName"].value;
	var password = submittedForm["password"].value;	
	if(userName in users){
		let psw = users[userName];
		if (psw.localeCompare(password) === 0){
				userLog = userName;
				switchDivs('gameDiv')
				submittedForm.reset();
		}
		else{
			alert("incorrect password or user_name! try again...")
			return false;
		}
	}
	else{
		alert("incorrect password or user_name! try again...")
	}
	return false;
}


function register(){
	let username = document.getElementById("username").value;
	let password = document.getElementById("passWord").value;

	users[username] = password;

	switchDivs('loginDiv');
}


function configurate(){
	keysControls['keyUp'] = tmpUpKey;
	keysControls['keyDown'] = tmpDownKey;
	keysControls['keyLeft'] = tmpLeftKey;
	keysControls['keyRight'] = tmpRightKey;

	ballsAmpunt = parseInt(document.getElementById("ballsRange").value);

	smallBallColor = document.getElementById("smallColor").value;
	mediumBallColor = document.getElementById("mediumColor").value;
	largeBallColor = document.getElementById("largeColor").value;

	time_remaining = parseInt(document.getElementById("timer").value);

	var radios = document.getElementsByName('monsters');

	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			// do whatever you want with the checked radio
			monstersAmount = parseInt(radios[i].value);

			// only one radio can be logically checked, don't check the rest
			break;
		}
	}

	switchDivs('gameDiv');
}

