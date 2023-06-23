/*----- constants -----*/
//Call AUDIO.play to trigger this -> const AUDIO = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3');
const ROWS = 6;
const COLS = 10;

// An object to store the color values for the player board
const PLAYERCOLORS = {
  '-2': 'green',      //Safe
  '-1': 'red',        //Bombed Ship
  '0': 'lightgrey',   //Empty Square
  '1': 'grey',        //Healthy Ship
}
// An object to store the color values for the computer board, which hides the computer ships
const COMPCOLORS = {
  '-2': 'green',      //Safe
  '-1': 'red',        //Bombed Ship
  '0': 'lightgrey',   //Empty Square
  '1': 'lightgrey',   //Healthy Ship
}

// An object to store the player names, incase I want to adjust these
const TURNS = {
  player: 'Player',
  computer: 'Computer',
}

/*----- state variables -----*/
let computerBoardArr;
let playerBoardArr;
let computerFleet;
let playerFleet;
let turn; // 1 = Players Turn & -1 = Computers Turn 
let winner; // null = game in play, 1 = Player Wins, -1 = Computer Wins

/*----- cached elements  -----*/
const computerBoard = document.querySelector('#computerBoard');
const playerBoard = document.querySelector('#playerBoard');
const messageEl = document.querySelector('#messageBar');

/*----- event listeners -----*/
computerBoard.addEventListener('click', boardClick);
//playerBoard.addEventListener('click', boardClick);

/*----- functions -----*/
function init() {

  computerBoardArr = [
    [0, 0, 0, 0, 0, 0], //col 0
    [0, 0, 0, 0, 0, 0], //col 1
    [0, 0, 0, 0, 0, 0], //col 2
    [0, 0, 0, 0, 0, 0], //col 3
    [0, 0, 0, 0, 0, 0], //col 4
    [0, 0, 0, 0, 0, 0], //col 5
    [0, 0, 0, 0, 0, 0], //col 6
    [0, 0, 0, 0, 0, 0], //col 7
    [0, 0, 0, 0, 0, 0], //col 8
    [0, 0, 0, 0, 0, 0], //col 9
  ];
  playerBoardArr = [
    [0, 0, 0, 0, 0, 0], //col 0
    [0, 0, 0, 0, 0, 0], //col 1
    [0, 0, 0, 0, 0, 0], //col 2
    [0, 0, 0, 0, 0, 0], //col 3
    [0, 0, 0, 0, 0, 0], //col 4
    [0, 0, 0, 0, 0, 0], //col 5
    [0, 0, 0, 0, 0, 0], //col 6
    [0, 0, 0, 0, 0, 0], //col 7
    [0, 0, 0, 0, 0, 0], //col 8
    [0, 0, 0, 0, 0, 0], //col 9
  ];
  computerFleet = [
    [1, 1, 1, 1, 1], //xl-ship
    [1, 1, 1, 1],    //l-ship
    [1, 1, 1],       //md-ship
    [1, 1, 1],       //md-ship
    [1, 1],          //sm-ship
  ];
  playerFleet = [
    [1, 1, 1, 1, 1], //xl-ship
    [1, 1, 1, 1],    //l-ship
    [1, 1, 1],       //md-ship
    [1, 1, 1],       //md-ship
    [1, 1],          //sm-ship
  ];

  generateBoard(computerBoard, false);
  generateBoard(playerBoard, true);
  placeShipsOnBoard(playerFleet, playerBoardArr)
  placeShipsOnBoard(computerFleet, computerBoardArr)
  turn = 1;
  winner = null;
  render();
}

function boardClick(evt) {
  // Guards:
  // returns without processing, if someone has won already or it's a tie
  if (winner !== null) {
    return;
  }

  const idOfSquare = evt.target.id.slice(2).split('r');
  const colIdx = parseInt(idOfSquare[0]);
  const rowIdx = parseInt(idOfSquare[1]);

  // On player's turn, interact with computer's board
  if (turn === 1 && evt.target.id.startsWith('C')) {
    computerBoardArr[colIdx][rowIdx] -= 2;
    turn *= -1; // Switch to computer's turn
  }

  //Check for winner
  winner = getWinner();
  render();
  //Trigger the Computer to take it's turn after a 2 second delay
  setTimeout(computerTurnAI, 2000);
}

function computerTurnAI() {
  // guard to stop the AI from running if the game is over
  if (winner !== null) {
    return
  }
  if (turn === -1) {
    //generate a random column and row index
    const randomRow = Math.floor(Math.random() * playerBoardArr[0].length);
    const randomCol = Math.floor(Math.random() * playerBoardArr.length);
    //guard incase the cell is already occupied
    if (playerBoardArr[randomCol][randomRow] === -1 || playerBoardArr[randomCol][randomRow] === -2) {
      return computerTurnAI()
    }
    console.log(randomCol, randomRow)
    console.log(playerBoardArr[randomCol][randomRow])
    playerBoardArr[randomCol][randomRow] -= 2;
    turn *= -1;
  }
  winner = getWinner();
  render();
}

function generateBoard(board, isPlayerBoard, rows = ROWS, columns = COLS) {
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const elColumn = document.createElement('div');

      let prefix = isPlayerBoard ? 'P' : 'C';
      let columnId = `${prefix}c${String(column)}`;
      let rowId = `r${String(row)}`;
      elColumn.id = `${columnId}${rowId}`;

      board.appendChild(elColumn);
    }
  }
}

function render() {
  renderMessage();
  renderBoard(computerBoardArr, false, COMPCOLORS);
  renderBoard(playerBoardArr, true, PLAYERCOLORS);
}

function renderBoard(boardArr, isPlayerBoard, Colors) {
  // I'm using the prefixes P = player C = computer to amend the ids for each cell div. 
  const prefix = isPlayerBoard ? 'P' : 'C';
  boardArr.forEach(function (colArr, colIdx) {
    colArr.forEach(function (cellVal, rowIdx) {
      const cellId = `${prefix}c${colIdx}r${rowIdx}`;
      const cellEl = document.querySelector(`#${cellId}`);
      cellEl.style.backgroundColor = `${Colors[cellVal]}`;
    })
  });
}

function getWinner() {
  // flattens the whole array and then checks if every cell is zero or less 
  // i.e. the board owner has no ships and has lost 
  if (computerBoardArr.flat().every(cell => cell <= 0)) {
    console.log('humans win');
    return 1;
  } else if (playerBoardArr.flat().every(cell => cell <= 0)) {
    console.log('aliens win');
    return -1;
  }
  // If we haven't returned yet, there's no winner
  console.log('game is still in play');
  return null;
}

function renderMessage() {
  if (winner !== null) {
    messageEl.innerHTML = `${winner === 1 ? TURNS.player : TURNS.computer} Wins!`;
    //scoreBoard.innerHTML = `<strong>SCORES: ${player1}: ${player1Score} | ${player2}: ${player2Score}</strong>`;
    //else, the game is in play
  } else {
    messageEl.innerHTML = `${turn === 1 ? TURNS.player : TURNS.computer}'s Turn`;
    //scoreBoard.innerHTML = `<strong>SCORES: ${player1}: ${player1Score} | ${player2}: ${player2Score}</strong>`;
  }
};

// a function to make sure the ship can be place within the confines of the board dimensions and not overlap other ships
function canPlaceShip(board, ship, startRow, startCol, direction) {
  const length = ship.length;
  // checks if the ship is horizontal and if it's length from the starting column will exceed the board length
  if (direction === 'h') {
    if (startCol + length > board[0].length) {
      return false;
    }
    // if it fits, then we check if any of the squares it will occupy aren't 0 i.e. aren't empty
    for (let i = 0; i < length; i++) {
      if (board[startCol + i][startRow] !== 0) {
        return false;
      }
    }
    // if the direction is vertical then we make the same checks but in the vertical axis
  } else {
    if (startRow + length > board.length) {
      return false;
    }
    for (let i = 0; i < length; i++) {
      if (board[startCol][startRow + i] !== 0) {
        return false;
      }
    }
  }
  // returns true, to let placeShipsOnBoard that we're good to go and it's clear to place
  return true;
}

// our ship placing function that can amend the board arrays to add the fleet
function placeShip(board, ship, startRow, startCol, direction) {
  const length = ship.length;
  // placing a ship horizontally
  if (direction === 'h') {
    for (let i = 0; i < length; i++) {
      board[startCol + i][startRow] = ship[i];
    }
  } else {
    for (let i = 0; i < length; i++) {
      board[startCol][startRow + i] = ship[i];
    }
  }
}

// iterates through the fleet with a forEach, generates a random location and direction
// calls canPlaceShip to check it's safe, and if so calls placeShip 
function placeShipsOnBoard(fleet, board) {
  fleet.forEach(ship => {
    let placed = false;
    while (!placed) {
      // finding a random number within the length of the row
      const startRow = Math.floor(Math.random() * board[0].length);
      // finding a random number within the length of the column
      const startCol = Math.floor(Math.random() * board.length);
      // choosing horizontal or vertical via the size of random decimal
      const direction = Math.random() < 0.5 ? 'h' : 'v';

      if (canPlaceShip(board, ship, startRow, startCol, direction)) {
        placeShip(board, ship, startRow, startCol, direction);
        //ending the loop
        placed = true;
      }
    }
  });
}

init();