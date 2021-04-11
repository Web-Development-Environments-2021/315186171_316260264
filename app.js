var users = {'k':'k'}
var userLog;
var ballsAmpunt = 70; //amount
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

var context;
var shape = new Object();
var board;
var board_size = 15;
var score;
var pac_color = "yellow";
var start_time;
var time_elapsed;
var interval;
var cell_height;
var cell_width;

var pacMan;
var ghosts;

boardEnum = // Table enum
{
    empty: 0,
    pacman: 1,
    wall: 2,
    ghost_1: 3,
	ghost_2: 4,
	ghost_3: 5,
	ghost_4: 6,
    food_5: 7,
    food_15: 8,
    food_25: 9,
    
};


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

		submitHandler: function(form, event) {
			event.preventDefault();
			configurate();

			let regForm = $("#configurationForm");
			regForm.reset();
		}
	});
	
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

	InitilizeBoard();

	placeWalls();

	placeFood();

	placeGhosts();

	placePacMan();

	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	/*
	board = []();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = []();
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
	*/
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
	//interval = setInterval(UpdatePosition, 150);
	Draw();
}

function findRandomEmptyCell(board) {
	let counter = 0;
	var i = Math.floor(Math.random() * 14);
	var j = Math.floor(Math.random() * 14);
	while (board[i][j][0] != boardEnum.empty && counter < 50) {
		i = Math.floor(Math.random() * 14);
		j = Math.floor(Math.random() * 14);
		counter++;
	}
	if(counter == 50){
		for(let k = 0; k < board_size; k++){
			for(let s = 0; s < board_size; s++){
				if(board[k][s][0] == boardEnum.empty){
					return [k, s];
				}
			}
		}
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
	let min_radius = Math.min(cell_height, cell_width);
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (let i = 0; i < board_size; i++) {
		for (let j = 0; j < board_size; j++) {
			let center = new Object();
			center.y = (i + (1 / 2)) * cell_height;
			center.x = (j + (1 / 2)) * cell_width;
			cell_array = board[i][j];
			for(let k=0; k<cell_array.length; k++){
				drawObject(i,j,cell_array[k], min_radius, center);
			}
		}
	}
}

function drawObject(i, j, cell_object, min_radius, center){
	if (cell_object == boardEnum.pacman) {
		context.beginPath();
		context.arc(center.x, center.y, min_radius, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x, center.y - 10, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	} else if (cell_object == boardEnum.food_5) {
		context.beginPath();
		context.arc(center.x, center.y, (min_radius / 7), 0, 2 * Math.PI); // circle
		context.fillStyle = smallBallColor; //color
		context.fill();
	}
	else if (cell_object == boardEnum.food_15) {
		context.beginPath();
		context.arc(center.x, center.y, (min_radius / 6), 0, 2 * Math.PI); // circle
		context.fillStyle = mediumBallColor; //color
		context.fill();
	} 
	else if (cell_object == boardEnum.food_25) {
		context.beginPath();
		context.arc(center.x, center.y, (min_radius / 7), 0, 2 * Math.PI); // circle
		context.fillStyle = largeBallColor; //color
		context.fill();
	}else if (cell_object == boardEnum.ghost_1) {
		context.beginPath();
		context.rect(center.x, center.y, cell_width, cell_height);
		context.fillStyle = "red"; //color
		context.fill();
	}
	else if (cell_object == boardEnum.ghost_2) {
		context.beginPath();
		context.rect(center.x, center.y, cell_width, cell_height);
		context.fillStyle = "green"; //color
		context.fill();
	}
	else if (cell_object == boardEnum.ghost_3) {
		context.beginPath();
		context.rect(center.x, center.y, cell_width, cell_height);
		context.fillStyle = "blue"; //color
		context.fill();
	}
	else if (cell_object == boardEnum.ghost_4) {
		context.beginPath();
		context.rect(center.x, center.y, cell_width, cell_height);
		context.fillStyle = "grey"; //color
		context.fill();
	}
	else if (cell_object == boardEnum.wall) {
		context.beginPath();
		context.rect(center.x, center.y, cell_width, cell_height);
		context.fillStyle = "black"; //color
		context.fill();
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

function InitilizeBoard(){
	board = [];

	for(let i=0; i< board_size; i++){
		board[i] = [];
		for(let j=0; j< board_size; j++){
			board[i][j] = [boardEnum.empty];
		}
	}

	cell_height = canvas.height / board_size;
	cell_width = canvas.width / board_size;
}

function placeWalls(){
	board[6][0] = [boardEnum.wall];
	board[7][0] = [boardEnum.wall];
	board[8][0] = [boardEnum.wall];
	board[6][1] = [boardEnum.wall];
	board[7][1] = [boardEnum.wall];
	board[8][1] = [boardEnum.wall];

	board[1][1] = [boardEnum.wall];
	board[1][2] = [boardEnum.wall];
	board[2][1] = [boardEnum.wall];
	board[2][2] = [boardEnum.wall];

	board[12][1] = [boardEnum.wall];
	board[12][2] = [boardEnum.wall];
	board[13][1] = [boardEnum.wall];
	board[13][2] = [boardEnum.wall];	

	board[3][4] = [boardEnum.wall];

	board[11][4] = [boardEnum.wall];

	board[7][4] = [boardEnum.wall];
	board[7][3] = [boardEnum.wall];
	board[7][5] = [boardEnum.wall];
	board[6][4] = [boardEnum.wall];
	board[8][4] = [boardEnum.wall];

	board[14][6] = [boardEnum.wall];
	board[13][6] = [boardEnum.wall];
	board[12][6] = [boardEnum.wall];
	board[12][7] = [boardEnum.wall];

	board[5][7] = [boardEnum.wall];
	board[5][8] = [boardEnum.wall];
	board[6][8] = [boardEnum.wall];

	board[8][8] = [boardEnum.wall];
	board[9][8] = [boardEnum.wall];
	board[9][7] = [boardEnum.wall];

	board[0][6] = [boardEnum.wall];
	board[1][6] = [boardEnum.wall];
	board[2][6] = [boardEnum.wall];
	board[2][7] = [boardEnum.wall];

	board[2][10] = [boardEnum.wall];
	board[3][10] = [boardEnum.wall];
	board[4][10] = [boardEnum.wall];


	board[10][10] = [boardEnum.wall];
	board[11][10] = [boardEnum.wall];
	board[12][10] = [boardEnum.wall];

	board[1][12] = [boardEnum.wall];
	board[2][12] = [boardEnum.wall];
	board[1][13] = [boardEnum.wall];
	board[2][13] = [boardEnum.wall];

	board[12][12] = [boardEnum.wall];
	board[13][12] = [boardEnum.wall];
	board[12][13] = [boardEnum.wall];
	board[13][13] = [boardEnum.wall];

	board[6][12] = [boardEnum.wall];
	board[7][12] = [boardEnum.wall];
	board[8][12] = [boardEnum.wall];
	board[7][13] = [boardEnum.wall];

}

function placeFood(){
	let food_25_amount = Math.round(ballsAmpunt * 0.1);
	let food_15_amount = Math.round(ballsAmpunt * 0.3);
	let food_5_amount = ballsAmpunt - food_15_amount - food_25_amount;

	while (food_25_amount > 0) {
		let emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = [boardEnum.food_25];
		food_25_amount--;
	}

	while (food_15_amount > 0) {
		let emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = [boardEnum.food_15];
		food_15_amount--;
	}

	while (food_5_amount > 0) {
		let emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = [boardEnum.food_5];
		food_5_amount--;
	}
}


function placeGhosts(){

	ghosts = [];

	ghosts.push(new Object());
	if(board[0][0][0] == boardEnum.empty){
		board[0][0] = [boardEnum.ghost_1];
	}
	else{
		board[0][0].push(boardEnum.ghost_1);
	}
	ghosts[0].row = 0;
	ghosts[0].col = 0;

	if(monstersAmount >= 2){
		ghosts.push(new Object());
		if(board[14][0][0] == boardEnum.empty){
			board[14][0] = [boardEnum.ghost_2];
		}
		else{
			board[14][0].push(boardEnum.ghost_2);
		}
		ghosts[1].row = 14;
		ghosts[1].col = 0;
	}

	if(monstersAmount >= 3){
		ghosts.push(new Object());
		if(board[0][14][0] == boardEnum.empty){
			board[0][14] = [boardEnum.ghost_3];
		}
		else{
			board[0][14].push(boardEnum.ghost_3);
		}
		ghosts[2].row = 0;
		ghosts[2].col = 14;
	}

	if(monstersAmount >= 4){
		ghosts.push(new Object());
		if(board[14][14][0] == boardEnum.empty){
			board[14][14] = [boardEnum.ghost_4];
		}
		else{
			board[14][14].push(boardEnum.ghost_4);
		}
		ghosts[3].row = 14;
		ghosts[3].col = 14;
	}
}

function placePacMan(){
	pacMan = new Object();

	let emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = [boardEnum.pacman];

	pacMan.row = emptyCell[0];
	pacMan.col = emptyCell[1];
	pacMan.leftImage = "";
	pacMan.upImage = "";
	pacMan.rightImage = "";
	pacMan.downImage = "";
	pacMan.draw = pacMan.leftImage;
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
				switchDivs('configurationDiv')
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
	context = canvas.getContext("2d");
	Start();
}


function randonConfiguration(){
	tmpUpKey = 38;
	tmpDownKey = 40;
	tmpLeftKey = 37;
	tmpRightKey = 39;
	document.getElementById("upKey").value = "ArrowUp";
	document.getElementById("downKey").value = "ArrowDown";
	document.getElementById("leftKey").value = "ArrowLeft";
	document.getElementById("rightKey").value = "ArrowRight";

	let rndBalls = Math.floor(Math.random() * 40) + 50;
	document.getElementById("ballsRange").value = rndBalls;
	let balls = document.getElementById("ballsAmount");
	balls.innerHTML = rndBalls;

	let rndTime = Math.floor(Math.random() * 60) + 60;
	document.getElementById("timer").value = rndTime;

	let randomColorSmall = Math.floor(Math.random()*16777215).toString(16);
	document.getElementById("smallColor").value = '#'+randomColorSmall;

	let randomColorMedium = Math.floor(Math.random()*16777215).toString(16);
	document.getElementById("mediumColor").value = '#'+randomColorMedium;

	let randomColorLarge = Math.floor(Math.random()*16777215).toString(16);
	document.getElementById("largeColor").value = '#'+randomColorLarge;

	let arrayMonster = document.getElementsByName('monsters');
  	let randomNumber = Math.floor(Math.random()*4);

  	arrayMonster[randomNumber].checked = true;
}

