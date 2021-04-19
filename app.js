var users = {'k':'k'}
var userLog;

var ballsAmpunt = 70; //amount
var food_eaten = 0;
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
var key_up;
var key_down;
var key_left;
var key_right;

var context;
var board;
var board_size = 15;
var score;
var start_time;
var time_elapsed;
var cell_height;
var cell_width;

var pacMan;
var ghosts;
var food_50_obj;
var watch_obj;
var heart_obj;
var pacMan_interval;
var ghosts_interval;
var special_food_interval;
var watch_interval;
var heart_inrerval;

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
    food_50: 10,
	watch: 11,
	heart: 12,
};


$(document).ready(function() {
	switchDivs('welcomeDiv');

	window.addEventListener("keydown", function(e) {
		if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
			e.preventDefault();
		}
	}, false);

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
			regForm[0].reset();
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

$(document).keydown(function(e) {
	var code = e.keyCode || e.which;
	if (code == 27) $("#myModal").hide();
  });

function clearIntervals(){
	window.clearInterval(pacMan_interval);
	window.clearInterval(ghosts_interval);
	window.clearInterval(special_food_interval);
	window.clearInterval(watch_interval);
	window.clearInterval(heart_inrerval);

	stopMusic();
}

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

	ShowConfigValues();

	InitilizeBoard();

	placeWalls();

	placeGhosts();

	placeSpecialFood();

	PlaceWatch();

	PlaceHeart();

	placeFood();

	placePacMan();

	startMusic();

	score = 0;
	start_time = new Date();

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
	pacMan_interval = setInterval(UpdatePacManPosition, 100);
	ghosts_interval = setInterval(UpdateGhostPosition, 400);
	special_food_interval = setInterval(MoveSpecialFood, 300);
	watch_interval = setInterval(resetWatch, 20000);
	heart_inrerval = setInterval(resetHeart, 20000);
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
	return -1;
}

function Draw() {
	canvas.width = canvas.width; //clean board
	context.fillStyle = "pink";
	context.fillRect(0, 0, canvas.width, canvas.height);
	let min_radius = Math.min(cell_height, cell_width);
	lblScore.value = score;
	lblTime.value = time_remaining - time_elapsed;
	lblLives.value = pacMan.lives;
	lblName.innerHTML = userLog;
	for (let i = 0; i < board_size; i++) {
		for (let j = 0; j < board_size; j++) {
			let center = new Object();
			center.y = (i * cell_height);
			center.x = (j * cell_width);
			cell_array = board[i][j];
			for(let k=0; k<cell_array.length; k++){
				drawObject(i,j,cell_array[k], min_radius, center);
			}
		}
	}
}

function drawPacManRight(center, min_radius){
	context.beginPath();
	context.arc(center.x + (cell_width/2), center.y + (cell_height/2), (min_radius / 2), 0.25 * Math.PI, 1.25 * Math.PI, false);
	context.fillStyle = "rgb(255, 255, 0)";
	context.fill();
	context.strokeStyle = "black";
	context.stroke();
	context.beginPath();
	context.arc(center.x + (cell_width/2), center.y + (cell_height/2), (min_radius / 2), 0.75 * Math.PI, 1.75 * Math.PI, false);
	context.fill();
	context.strokeStyle = "black";
	context.stroke();
	context.beginPath();
	context.arc(center.x + (cell_width/2), center.y + (cell_height/4), (min_radius / 2)*0.2, 0, 2 * Math.PI, false);
	context.fillStyle = "rgb(0, 0, 0)";
	context.fill();
}

function drawPacManDown(center, min_radius){
	context.beginPath();
	context.arc(center.x + (cell_width/2), center.y + (cell_height/2), (min_radius / 2),  1.25 * Math.PI, 0.25 * Math.PI, false);
	context.fillStyle = "rgb(255, 255, 0)";
	context.fill();
	context.strokeStyle = "black";
	context.stroke();
	context.beginPath();
	context.arc(center.x + (cell_width/2), center.y + (cell_height/2), (min_radius / 2), 0.75 * Math.PI, 1.75 * Math.PI, false);
	context.fill();
	context.strokeStyle = "black";
	context.stroke();
	context.beginPath();
	context.arc(center.x + (3*cell_width/4), center.y + (cell_height/2), (min_radius / 2)*0.2, 0, 2 * Math.PI, false);
	context.fillStyle = "rgb(0, 0, 0)";
	context.fill();
}

function drawPacManUp(center, min_radius){
	context.beginPath();
	context.arc(center.x + (cell_width/2), center.y + (cell_height/2), (min_radius / 2),  1.75 * Math.PI, 0.75 * Math.PI, false);
	context.fillStyle = "rgb(255, 255, 0)";
	context.fill();
	context.strokeStyle = "black";
	context.stroke();
	context.beginPath();
	context.arc(center.x + (cell_width/2), center.y + (cell_height/2), (min_radius / 2), 0.25 * Math.PI, 1.25 * Math.PI, false);
	context.fill();
	context.strokeStyle = "black";
	context.stroke();
	context.beginPath();
	context.arc(center.x + (cell_width/4), center.y + (cell_height/2), (min_radius / 2)*0.2, 0, 2 * Math.PI, false);
	context.fillStyle = "rgb(0, 0, 0)";
	context.fill();
}

function drawPacManLeft(center, min_radius){
	context.beginPath();
	context.arc(center.x + (cell_width/2), center.y + (cell_height/2), (min_radius / 2),  1.75 * Math.PI, 0.75 * Math.PI, false);
	context.fillStyle = "rgb(255, 255, 0)";
	context.fill();
	context.strokeStyle = "black";
	context.stroke();
	context.beginPath();
	context.arc(center.x + (cell_width/2), center.y + (cell_height/2), (min_radius / 2), 1.25 * Math.PI, 0.25 * Math.PI, false);
	context.fill();
	context.strokeStyle = "black";
	context.stroke();
	context.beginPath();
	context.arc(center.x + (cell_width/2), center.y + (cell_height/4), (min_radius / 2)*0.2, 0, 2 * Math.PI, false);
	context.fillStyle = "rgb(0, 0, 0)";
	context.fill();
}

function drawObject(i, j, cell_object, min_radius, center){
	if (cell_object == boardEnum.pacman) {
		let dirr = pacMan.draw;
		if(dirr == 1){
			drawPacManUp(center, min_radius);
		}
		else if(dirr == 2){
			drawPacManDown(center, min_radius);
		}
		else if(dirr == 3){
			drawPacManLeft(center, min_radius);
		}
		else{
			drawPacManRight(center, min_radius);
		}

	} else if (cell_object == boardEnum.food_5) {
		context.beginPath();
		context.arc(center.x + (cell_width/2), center.y + (cell_height/2), (min_radius / 7), 0, 2 * Math.PI); // circle
		context.fillStyle = smallBallColor; //color
		context.fill();
	}
	else if (cell_object == boardEnum.food_15) {
		context.beginPath();
		context.arc(center.x + (cell_width/2), center.y + (cell_height/2), (min_radius / 5), 0, 2 * Math.PI); // circle
		context.fillStyle = mediumBallColor; //color
		context.fill();
	} 
	else if (cell_object == boardEnum.food_25) {
		context.beginPath();
		context.arc(center.x + (cell_width/2), center.y + (cell_height/2), (min_radius / 4), 0, 2 * Math.PI); // circle
		context.fillStyle = largeBallColor; //color
		context.fill();
	}else if (cell_object == boardEnum.ghost_1) {
		context.drawImage(ghosts[0].draw, center.x, center.y, cell_width, cell_height);
	}
	else if (cell_object == boardEnum.ghost_2) {
		context.drawImage(ghosts[1].draw, center.x, center.y, cell_width, cell_height);
	}
	else if (cell_object == boardEnum.ghost_3) {
		context.drawImage(ghosts[2].draw, center.x, center.y, cell_width, cell_height);
	}
	else if (cell_object == boardEnum.ghost_4) {
		context.drawImage(ghosts[3].draw, center.x, center.y, cell_width, cell_height);
	}
	else if (cell_object == boardEnum.wall) {
		context.beginPath();
		context.rect(center.x, center.y, cell_width, cell_height);
		context.fillStyle = "black"; //color
		context.fill();
	}
	else if (cell_object == boardEnum.empty){
		//context.beginPath();
		//context.rect(center.x, center.y, cell_width, cell_height);
		//context.fillStyle = "red"; //color
		//context.fill();
		//context.strokeRect(center.x, center.y, cell_width, cell_height);
	}
	else if(cell_object == boardEnum.food_50){
		let imgg = new Image();
		imgg.src = "images/special_food.png";
		context.drawImage(imgg, center.x, center.y, cell_width, cell_height);
	}
	else if(cell_object == boardEnum.watch){
		let watch_img = new Image();
		watch_img.src = "images/watch.png";
		context.drawImage(watch_img, center.x, center.y, cell_width, cell_height);
	}
	else if(cell_object == boardEnum.heart){
		let heart_img = new Image();
		heart_img.src = "images/heart.png";
		context.drawImage(heart_img, center.x, center.y, cell_width, cell_height);
	}
}

function UpdatePacManPosition(){
	board[pacMan.row][pacMan.col] = [boardEnum.empty];

	let move = GetKeyPressed();
	if(move != -1)
		pacMan.draw = move;

	if (move == 1 && pacMan.row > 0 && board[pacMan.row - 1][pacMan.col][0] != boardEnum.wall) {

		pacMan.row--;
		pacMan.draw = 1;
	}
	else if (move == 2 && pacMan.row < board_size-1 && board[pacMan.row + 1][pacMan.col][0] != boardEnum.wall) {

		pacMan.row++;
		pacMan.draw = 2;
	}
	else if (move == 3 && pacMan.col > 0 && board[pacMan.row][pacMan.col - 1][0] != boardEnum.wall) {

		pacMan.col--;
		pacMan.draw = 3;
	}
	else if (move == 4 && pacMan.col < board_size-1 && board[pacMan.row][pacMan.col + 1][0] != boardEnum.wall ) {

		pacMan.col++;
		pacMan.draw = 4;
	}

	//score
	if(board[pacMan.row][pacMan.col].find(element => element == boardEnum.food_5)){
		score+=5;
		food_eaten++;
	}
	if(board[pacMan.row][pacMan.col].find(element => element == boardEnum.food_15)){
		score+=15;
		food_eaten++;
	}
	if(board[pacMan.row][pacMan.col].find(element => element == boardEnum.food_25)){
		score+=25;
		food_eaten++;
	}
	if(pacMan.col == food_50_obj.col && pacMan.row == food_50_obj.row){
		score+=50;
		ResetSpecialFood();
	}

	//special
	if(watch_obj.appear && pacMan.col == watch_obj.col && pacMan.row == watch_obj.row){
		time_remaining += 10;
		watch_obj.appear = false;
		//resetWatch();
		//clearInterval(watch_interval);
		//watch_interval = setInterval(resetWatch, 20000);
	}
	if(heart_obj.appear && pacMan.col == heart_obj.col && pacMan.row == heart_obj.row){
		pacMan.lives++;
		heart_obj.appear = false;
		//resetHeart();
		//clearInterval(heart_inrerval);
		//heart_inrerval = setInterval(resetHeart, 20000);
	}

	board[pacMan.row][pacMan.col] = [boardEnum.pacman];

	let currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;	

	if (time_elapsed >= time_remaining) {
		clearIntervals();

		if(score < 100)
		{
			Draw();
			window.alert("You are better than " + score + " points!");
		}
		else
		{
			Draw();
			window.alert("Winner!!!");
		}
	}
	else if (isAllCandyEaten()) {
		clearIntervals();
		Draw();
		
		window.alert("Winner!!!\nYour Score : " + score);
	} else if(checkIfPacManHitGhost()){
		let disqualify = checkDisqualify();
		if(disqualify){
			clearIntervals();
			window.alert("Loser!!!");
		}
		else{
			Draw();
		}
	}
	else{
		Draw();
	}
	
}

function isAllCandyEaten(){
	for(let i = 0; i < board_size; i++){
		for(let j = 0; j < board_size; j++){
			if(board[i][j].find(element => element == boardEnum.food_5)){
				return false;
			}
			if(board[i][j].find(element => element == boardEnum.food_15)){
				return false;
			}
			if(board[i][j].find(element => element == boardEnum.food_25)){
				return false;
			}
		}
	}
	return true;
}

function find_special_food(cell){
	return cell == boardEnum.food_50;
}

function ResetSpecialFood(){
	let indx = board[food_50_obj.row][food_50_obj.col].findIndex(find_special_food);
	board[food_50_obj.row][food_50_obj.col].splice(indx, 1);
	let emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]].push(boardEnum.food_50);
	food_50_obj.row = emptyCell[0];
	food_50_obj.col = emptyCell[1];
}

function MoveSpecialFood(){
	let indx = board[food_50_obj.row][food_50_obj.col].findIndex(find_special_food);
	board[food_50_obj.row][food_50_obj.col].splice(indx, 1);
	let rnd_move = Math.floor(Math.random() * 4) + 1;
	if (rnd_move == 1 && food_50_obj.row > 0 && board[food_50_obj.row - 1][food_50_obj.col][0] != boardEnum.wall) {

		food_50_obj.row--;
	}
	else if (rnd_move == 2 && food_50_obj.row < board_size-1 && board[food_50_obj.row + 1][food_50_obj.col][0] != boardEnum.wall) {

		food_50_obj.row++;
	}
	else if (rnd_move == 3 && food_50_obj.col > 0 && board[food_50_obj.row][food_50_obj.col - 1][0] != boardEnum.wall) {

		food_50_obj.col--;
	}
	else if (rnd_move == 4 && food_50_obj.col < board_size-1 && board[food_50_obj.row][food_50_obj.col + 1][0] != boardEnum.wall ) {

		food_50_obj.col++;
	}
	board[food_50_obj.row][food_50_obj.col].push(boardEnum.food_50);
	if(pacMan.col == food_50_obj.col && pacMan.row == food_50_obj.row){
		score+=50;
		ResetSpecialFood();
	}
}

function UpdateGhostPosition(){
	for(let i=0; i < ghosts.length; i++){
		let current_ghost = ghosts[i];
		let best_move = [current_ghost.row, current_ghost.col];
		let dist = 1000;
		let curr_dist;
		if(current_ghost.row > 0 && board[current_ghost.row - 1][current_ghost.col][0] != boardEnum.wall && !checkForAnotherGhost(current_ghost.row - 1, current_ghost.col)){//up
			if(current_ghost.row - 1 != current_ghost.last_place[0] || current_ghost.col != current_ghost.last_place[1]){
				curr_dist = calculateDistanceFromPacMan(current_ghost.row - 1,current_ghost.col);
				if(curr_dist < dist){
					dist = curr_dist;
					best_move = [current_ghost.row - 1, current_ghost.col];
				}
			}
		}
		if(current_ghost.row < board_size-1 && board[current_ghost.row + 1][current_ghost.col][0] != boardEnum.wall && !checkForAnotherGhost(current_ghost.row + 1, current_ghost.col)){//down
			if(current_ghost.row + 1 != current_ghost.last_place[0] || current_ghost.col != current_ghost.last_place[1]){
				curr_dist = calculateDistanceFromPacMan(current_ghost.row + 1,current_ghost.col);
				if(curr_dist < dist){
					dist = curr_dist;
					best_move = [current_ghost.row + 1, current_ghost.col];
				}
			}
		}
		if(current_ghost.col > 0 && board[current_ghost.row][current_ghost.col - 1][0] != boardEnum.wall && !checkForAnotherGhost(current_ghost.row, current_ghost.col - 1)){//left
			if(current_ghost.row != current_ghost.last_place[0] || current_ghost.col-1 != current_ghost.last_place[1]){
				curr_dist = calculateDistanceFromPacMan(current_ghost.row,current_ghost.col-1);
				if(curr_dist < dist){
					dist = curr_dist;
					best_move = [current_ghost.row, current_ghost.col-1];
				}
			}
		}
		if(current_ghost.col < board_size-1 && board[current_ghost.row][current_ghost.col + 1][0] != boardEnum.wall && !checkForAnotherGhost(current_ghost.row, current_ghost.col + 1)){//right
			if(current_ghost.row != current_ghost.last_place[0] || current_ghost.col+1 != current_ghost.last_place[1]){
				curr_dist = calculateDistanceFromPacMan(current_ghost.row,current_ghost.col+1);
				if(curr_dist < dist){
					dist = curr_dist;
					best_move = [current_ghost.row, current_ghost.col+1];
				}
			}
		}
		for(let j=0; j< board[current_ghost.row][current_ghost.col].length; j++){
			if(board[current_ghost.row][current_ghost.col][j] == i+3){
				board[current_ghost.row][current_ghost.col].splice(j, 1);
			}
		}
		ghosts[i].last_place = [ghosts[i].row, ghosts[i].col];
		ghosts[i].row = best_move[0];
		ghosts[i].col = best_move[1];
		board[best_move[0]][best_move[1]].push(i+3);
	}
	if(checkIfPacManHitGhost()){
		let disqualify = checkDisqualify();
		if(disqualify){
			clearIntervals();
			window.alert("Loser!!!");
		}
		else{
			Draw();
		}
	}
	else{
		Draw();
	}

}

function calculateDistanceFromPacMan(curr_row,curr_col){
	let pac_col = pacMan.col;
	let pac_row = pacMan.row;
	return Math.abs(curr_col-pac_col) + Math.abs(curr_row-pac_row);
}

function checkForAnotherGhost(row, col){
	for(let i = 0; i < ghosts.length; i++){
		let curr = ghosts[i];
		if(curr.row == row && curr.col == col)
			return true;
	}
	return false;
}

function checkIfPacManHitGhost(){
	for(let i = 0; i < ghosts.length; i++){
		current_ghost = ghosts[i];
		if(pacMan.row == current_ghost.row && pacMan.col == current_ghost.col){
			return true;
		}
	}
	return false;
}

function checkDisqualify(){
	pacMan.lives--;
	score-=10;
	let current_lives = pacMan.lives;

	if(pacMan.lives == 0){
		return true;
	}
	else{
		board[pacMan.row][pacMan.col] = [boardEnum.empty];
		for(let i = 0; i < ghosts.length; i++){
			let current_ghost = ghosts[i];
			for(let j=0; j< board[current_ghost.row][current_ghost.col].length; j++){
				if(board[current_ghost.row][current_ghost.col][j] == i+3){
					board[current_ghost.row][current_ghost.col].splice(j, 1);
				}
			}
		}
		placeGhosts();
		placePacMan();
		pacMan.lives = current_lives;
		return false;
	}
}

function ShowConfigValues(){
	document.getElementById('moveUp').innerHTML = key_up;
	document.getElementById('moveDown').innerHTML = key_down;
	document.getElementById('moveLeft').innerHTML = key_left;
	document.getElementById('moveRight').innerHTML = key_right;

	document.getElementById('color-5').style.backgroundColor = smallBallColor;
	document.getElementById('color-5').style.color = smallBallColor;

	document.getElementById('color-15').style.backgroundColor = mediumBallColor;
	document.getElementById('color-15').style.color = mediumBallColor;

	document.getElementById('color-25').style.backgroundColor = largeBallColor;
	document.getElementById('color-25').style.color = largeBallColor;

	let food_25_amount = Math.round(ballsAmpunt * 0.1);
	let food_15_amount = Math.round(ballsAmpunt * 0.3);
	let food_5_amount = ballsAmpunt - food_15_amount - food_25_amount;
	document.getElementById('amount-5').innerHTML = food_5_amount;
	document.getElementById('amount-15').innerHTML = food_15_amount;
	document.getElementById('amount-25').innerHTML = food_25_amount;

	document.getElementById('ghost_amount').innerHTML = monstersAmount;
	document.getElementById('game_dur').innerHTML = time_remaining;
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

function PlaceWatch(){
	if(watch_obj === undefined || watch_obj == null)
		watch_obj = new Object();
	let emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]].push(boardEnum.watch);
	watch_obj.row = emptyCell[0];
	watch_obj.col = emptyCell[1];
	watch_obj.appear = true;
}

function findWatch(cell){
	return cell == boardEnum.watch;
}


function resetWatch(){
	if(watch_obj.appear){
		let indx = board[watch_obj.row][watch_obj.col].findIndex(findWatch);
		board[watch_obj.row][watch_obj.col].splice(indx, 1);
		watch_obj.row = -1;
		watch_obj.col = -1;
		watch_obj.appear = false;
	}
	else{
		PlaceWatch();
	}
	Draw();
}

function findHeart(cell){
	return cell == boardEnum.heart;
}


function PlaceHeart(){
	if(heart_obj === undefined || heart_obj == null)
		heart_obj = new Object();
	let emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]].push(boardEnum.heart);
	heart_obj.row = emptyCell[0];
	heart_obj.col = emptyCell[1];
	heart_obj.appear = true;
}

function resetHeart(){
	if(heart_obj.appear){
		let indx = board[heart_obj.row][heart_obj.col].findIndex(findHeart);
		board[heart_obj.row][heart_obj.col].splice(indx, 1);
		heart_obj.row = -1;
		heart_obj.col = -1;
		heart_obj.appear = false;
	}
	else{
		PlaceHeart();
	}
	Draw();
}

function placeSpecialFood(){
	food_50_obj = new Object();
	food_50_obj.row = 7;
	food_50_obj.col = 7;
	board[7][7].push(boardEnum.food_50);
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
	ghosts[0].draw = new Image();
	ghosts[0].draw.src = "images/ghost_1.png";
	ghosts[0].last_place = [ghosts[0].row, ghosts[0].col];

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
		ghosts[1].draw = new Image();
		ghosts[1].draw.src = "images/ghost_2.png";
		ghosts[1].last_place = [ghosts[1].row, ghosts[1].col];
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
		ghosts[2].draw = new Image();
		ghosts[2].draw.src = "images/ghost_3.png";
		ghosts[2].last_place = [ghosts[2].row, ghosts[2].col];
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
		ghosts[3].draw = new Image();
		ghosts[3].draw.src = "images/ghost_4.png";
		ghosts[3].last_place = [ghosts[3].row, ghosts[3].col];
	}
}

function placePacMan(){
	pacMan = new Object();

	let emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = [boardEnum.pacman];

	pacMan.row = emptyCell[0];
	pacMan.col = emptyCell[1];
	pacMan.draw = 4;
	pacMan.lives = 5;
}

function startMusic() {
	document.getElementById("main_sound").play();
	document.getElementById("main_sound").volume = 0.5;
}

function stopMusic(){
	document.getElementById("main_sound").pause();
	document.getElementById("main_sound").currentTime = 0;
}

function resetGame(){
	clearIntervals();
	canvas.width = canvas.width;

	ballsAmpunt = 70; //amount
	food_eaten = 0;
	smallBallColor = '#04ff00';
	mediumBallColor = '#ff0000';
	largeBallColor = '#1100ff';
	time_remaining = 60;
	monstersAmount = 4;
	keysControls = {'keyUp': 38, 'keyDown': 40, 'keyLeft': 37, 'keyRight': 39}
	tmpUpKey = 38;
	tmpDownKey = 40;
	tmpLeftKey = 37;
	tmpRightKey = 39;
	score = 0;
	time_elapsed = 0;
	key_up = "ArrowUp";
	key_down = "ArrowDown";
	key_left = "ArrowLeft";
	key_right = "ArrowRight";
	board = null;
	ghosts = null;
	watch_obj = null;
	heart_obj = null;

	lblScore.value = null;
	lblTime.value = null;
	lblLives.value = null;
	lblName.innerHTML = null;

}



function switchDivs(divStr){
	if(divStr.localeCompare("configurationDiv") == 0 && userLog === undefined){
		alert("You must Log In before you can play!");
		return;
	}

	$("#welcomeDiv").hide();
	$("#registerDiv").hide();
	$("#loginDiv").hide();
	$("#gameDiv").hide();
	$("#configurationDiv").hide();

	if(divStr.localeCompare("gameDiv") != 0)
		resetGame();

	let regForm1 = $("#configurationForm");
	if(regForm1 != undefined)
		regForm1[0].reset();
	let regForm2 = $("#registerForm");
	if(regForm2 != undefined){
		regForm2[0].reset();
		var output = document.getElementById("ballsAmount");
		output.innerHTML = 70;
	}
	let regForm3 = $("#loginForm");
	if(regForm3 != undefined)
		if(regForm3.length > 0)
			regForm3[0].reset();


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

	key_up = document.getElementById("upKey").value;
	key_down = document.getElementById("downKey").value;
	key_left = document.getElementById("leftKey").value;
	key_right = document.getElementById("rightKey").value;

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


