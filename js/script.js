/*----- constants -----*/
//Call AUDIO.play to trigger this -> const AUDIO = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3');
const ROWS = 6;
const COLS = 10;

// An object to store the color values for the player board
const PLAYERCOLORS = {
  '-2': 'transparent', //Safe
  '-1': 'red',        //Bombed Ship
  '0': 'lightgrey',   //Empty Square
  '1': 'grey',        //Healthy Ship
}
// An object to store the color values for the computer board, which hides the computer ships
const COMPCOLORS = {
  '-2': 'transparent', //Safe
  '-1': 'red',        //Bombed Ship
  '0': 'lightgrey',   //Empty Square
  '1': 'lightgrey',   //Healthy Ship
}

// An object to store the player names, incase I want to adjust these
const TURNS = {
  player: 'PLAYER',
  computer: 'COMPUTER',
}

/*----- state variables -----*/
let computerBoardArr;
let computerFleet;
let computerFleetHealth;
let playerBoardArr;
let playerFleet;
let playerFleetHealth;
let turn; // 1 = Players Turn & -1 = Computers Turn & 0 = Game not in progress
let winner; // null = game in play, 1 = Player Wins, -1 = Computer Wins


/*----- cached elements  -----*/
const computerBoard = document.querySelector('#computerBoard');
const playerBoard = document.querySelector('#playerBoard');
const computerHealthDisplay = document.getElementById('computerFleetHealth');
const playerHealthDisplay = document.getElementById('playerFleetHealth');
const messageEl = document.querySelector('#message');
const startBtn = document.getElementById('start');
const shuffleBtn = document.getElementById('shuffle');

/*----- event listeners -----*/
computerBoard.addEventListener('click', boardClick);
startBtn.addEventListener('click', startTurns);
shuffleBtn.addEventListener('click', reshuffleBoards);

/*----- functions -----*/
function init() {
  turn = 0;
  winner = null;
  computerBoardArr = createEmptyBoard();
  playerBoardArr = createEmptyBoard();
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
  Array.from(playerBoard.children).forEach(cell => {
    cell.classList.remove('horizontalFront', 'horizontalRear', 'verticalFront', 'verticalRear');
  });
  Array.from(computerBoard.children).forEach(cell => {
    cell.classList.remove('horizontalFront', 'horizontalRear', 'verticalFront', 'verticalRear');
  });
  placeShipsOnBoard(playerFleet, playerBoardArr);
  placeShipsOnBoard(computerFleet, computerBoardArr);
  computerFleetHealth = 100;
  playerFleetHealth = 100;

  render();
}

function startTurns() {
  // if (winner === null) {
  if (turn !== 0) {
    return
  }
  turn = 1;
  computerBoard.classList.add('hoverEffect');

  console.log('start game!')
  // } else {
  //   init()
  // }
  render()
}

function boardClick(evt) {
  // Guards:
  // returns without processing, if someone has won already or it's a tie
  if (winner !== null || turn === 0) {
    return;
  }

  const idOfSquare = evt.target.id.slice(2).split('r');
  const colIdx = parseInt(idOfSquare[0]);
  const rowIdx = parseInt(idOfSquare[1]);

  // On player's turn, interact with computer's board
  if (turn === 1 && evt.target.id.startsWith('C')) {
    if (computerBoardArr[colIdx][rowIdx] < 0) {
      console.log('not valid');
      return;

      //MISS
    } else if (computerBoardArr[colIdx][rowIdx] === 0) {
      // If the player doesn't get a hit, switch to computer's turn
      console.log('player misses')
      turn *= -1
      computerBoardArr[colIdx][rowIdx] -= 2;

      //HIT
    } else if (computerBoardArr[colIdx][rowIdx] === 1) {
      console.log('player gets a hit')
      computerBoardArr[colIdx][rowIdx] -= 2;
      // const cellId = evt.target.id;
      // console.log(evt.target.id)
      // const cellEl = document.querySelector(`#${cellId}`);
      console.log(evt.target.classList)
      if (evt.target.classList.contains('horizontalFrontTemp')) {
        evt.target.classList.remove('horizontalFrontTemp');
        evt.target.classList.add('horizontalFront')
        console.log('horizontalFront')
      } else if (evt.target.classList.contains('verticalFrontTemp')) {
        evt.target.classList.remove('verticalFrontTemp');
        evt.target.classList.add('verticalFront')
        console.log('verticalFront')
      } else if (evt.target.classList.contains('horizontalRearTemp')) {
        evt.target.classList.remove('horizontalRearTemp');
        evt.target.classList.add('horizontalRear')
        console.log('horizontalRear')
      } else if (evt.target.classList.contains('verticalRearTemp')) {
        evt.target.classList.remove('verticalRearTemp');
        evt.target.classList.add('verticalRear')
        console.log('verticalRear')
      }
      computerFleetHealth -= 6;
    }

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

      //MISS
    } else if (playerBoardArr[randomCol][randomRow] === 0) {
      // If the computer doesn't get a hit, switch to player's turn
      turn *= -1
      console.log('computer misses')
      playerBoardArr[randomCol][randomRow] -= 2;
      winner = getWinner();
      render();

      //HIT
    } else if (playerBoardArr[randomCol][randomRow] === 1) {
      playerBoardArr[randomCol][randomRow] -= 2;
      console.log('computer gets a hit')
      winner = getWinner();
      playerFleetHealth -= 6;
      render();
      setTimeout(computerTurnAI, 1500);

    }
  }
}

function createEmptyBoard() {
  return Array(COLS).fill(null).map(() => Array(ROWS).fill(0));
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
  renderControls();
  renderFleetHealth();
}

function renderControls() {
  startBtn.innerText = winner ? 'PLAY AGAIN' : 'START GAME';
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
  //console.log('game is still in play');
  return null;
}

// function calculateFleetHealth() {

//   // Idea for being more dynamic -> take the array, flatten it and get it's length. Divide 100 / that length. parse to Int and then subtract from 
//   computerFleet 

//   render();
// }

function renderFleetHealth() {

  computerHealthDisplay.innerText = computerFleetHealth > 0 ? `${computerFleetHealth}%` : `0%`;
  playerHealthDisplay.innerText = playerFleetHealth > 0 ? `${playerFleetHealth}%` : `0%`;
}

function renderMessage() {
  if (winner !== null) {
    messageEl.innerHTML = `${winner === 1 ? TURNS.player : TURNS.computer} WINS!`;
    //scoreBoard.innerHTML = `<strong>SCORES: ${player1}: ${player1Score} | ${player2}: ${player2Score}</strong>`;
    //else, the game is in play
  } else if (turn === 0) {
    return
  } else {
    messageEl.innerHTML = `${turn === 1 ? TURNS.player : TURNS.computer}'S TURN`;
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

  if (direction === 'h') {
    for (let i = 0; i < length; i++) {
      board[startCol + i][startRow] = ship[i];
      const cellId = board === playerBoardArr ? `Pc${startCol + i}r${startRow}` : `Cc${startCol + i}r${startRow}`;
      const cellEl = document.querySelector(`#${cellId}`);
      if (i === 0) {
        board === playerBoardArr ? cellEl.classList.add('horizontalFront') : cellEl.classList.add('horizontalFrontTemp');
      } else if (i === length - 1) {
        board === playerBoardArr ? cellEl.classList.add('horizontalRear') : cellEl.classList.add('horizontalRearTemp');
      }
    }
  } else {
    for (let i = 0; i < length; i++) {
      board[startCol][startRow + i] = ship[i];
      const cellId = board === playerBoardArr ? `Pc${startCol}r${startRow + i}` : `Cc${startCol}r${startRow + i}`;
      const cellEl = document.querySelector(`#${cellId}`);
      if (i === 0) {
        board === playerBoardArr ? cellEl.classList.add('verticalFront') : cellEl.classList.add('verticalFrontTemp');
      } else if (i === length - 1) {
        board === playerBoardArr ? cellEl.classList.add('verticalRear') : cellEl.classList.add('verticalRearTemp');
      }
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

function reshuffleBoards() {
  // guard to stop players from reshuffling mid game
  if (turn !== 0) {
    return
  }
  // really we only need the player board to be shuffled, but for now I'll do both incase I change the functionality of the game
  // reset both game boards back to empty by nesting a row map inside a column map
  playerBoardArr = playerBoardArr.map(column => column.map(() => 0));
  computerBoardArr = computerBoardArr.map(column => column.map(() => 0));

  // clear classes from playerBoard
  Array.from(playerBoard.children).forEach(cell => {
    cell.classList.remove('horizontalFront', 'horizontalRear', 'verticalFront', 'verticalRear');
  });

  // clear classes from computerBoard
  Array.from(computerBoard.children).forEach(cell => {
    cell.classList.remove('horizontalFront', 'horizontalRear', 'verticalFront', 'verticalRear', 'horizontalFrontTemp', 'horizontalRearTemp', 'verticalFrontTemp', 'verticalRearTemp');
  });

  // randomly place the ships on the board again
  placeShipsOnBoard(playerFleet, playerBoardArr);
  placeShipsOnBoard(computerFleet, computerBoardArr);

  render();
}



init();