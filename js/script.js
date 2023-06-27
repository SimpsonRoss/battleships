/*----- constants -----*/
//Call AUDIO.play to trigger this -> const AUDIO = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3');
const ROWS = 6;
const COLS = 10;
const AI_DELAY = 2000; //the time delay for the AI to take its turn 

// An object to store the color values for the player board
const PLAYERCOLORS = {
  '-3': 'darkred',         //Sunken
  '-2': 'rgb(63, 77, 74)', //Safe
  '-1': 'red',             //Bombed Ship
  '0': 'honeydew',         //Empty Square
  '1': 'grey',             //Healthy Ship
}
// An object to store the color values for the computer board, which hides the computer ships
const COMPCOLORS = {
  '-3': 'darkred',         //Sunken
  '-2': 'rgb(63, 77, 74)', //Safe
  '-1': 'red',             //Bombed Ship
  '0': 'honeydew',         //Empty Square
  '1': 'honeydew',         //Healthy Ship
}

// An object to store the player names, incase I want to adjust these
const TURNS = {
  player: 'Player',
  computer: 'Computer',
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
let lastHit;
let lastDirection;
let sunkenLocations = [];


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
  // clearing both boards
  while (computerBoard.firstChild) {
    computerBoard.firstChild.remove();
  }
  while (playerBoard.firstChild) {
    playerBoard.firstChild.remove();
  }
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
  lastHit = [null];
  lastDirection = [null];

  render();
}

function startTurns() {
  // if the game is not in progress, start it
  if (turn === 0) {
    turn = 1;
    computerBoard.classList.add('hoverEffect');
    //console.log('start game!')
  } else if (winner !== null) { // if the game has ended, reset it
    init();
    //console.log('reset game!')
    messageEl.innerText = "Return at your peril";
  }
  render();
}

function boardClick(evt) {
  // Guards:
  // returns without processing, if someone has won already or it's a tie
  if (winner !== null || turn === 0) {
    return;
  }

  const idOfSquare = evt.target.id.slice(2).split('r');
  //console.log(idOfSquare);
  const colIdx = parseInt(idOfSquare[0]);
  const rowIdx = parseInt(idOfSquare[1]);

  // On player's turn, interact with computer's board
  if (turn === 1 && evt.target.id.startsWith('C')) {
    if (computerBoardArr[colIdx][rowIdx] < 0) {
      //console.log('not valid');
      return;

      //MISS
    } else if (computerBoardArr[colIdx][rowIdx] === 0) {
      // If the player doesn't get a hit, switch to computer's turn
      //console.log('player misses')
      turn *= -1
      computerBoardArr[colIdx][rowIdx] -= 2;

      //HIT
    } else if (computerBoardArr[colIdx][rowIdx] === 1) {
      //console.log('player gets a hit')
      computerBoardArr[colIdx][rowIdx] -= 2;
      //console.log(evt.target.classList)
      computerFleetHealth -= 6;
      checkIfSunk(computerFleet, computerBoardArr)
    }

  }

  //Check for winner
  winner = getWinner();
  render();
  //Trigger the Computer to take it's turn after a 2.5 second delay
  setTimeout(computerTurnAI, AI_DELAY);
}

/*----- AI OPPONENT -----*/

function computerTurnAI() {
  // Guard to stop the AI from running if the game is over
  if (winner !== null) {
    return;
  }


  let randomRow = Math.floor(Math.random() * playerBoardArr[0].length);
  let randomCol = Math.floor(Math.random() * playerBoardArr.length);

  // Check if it's the computer's turn
  if (turn === -1) {
    console.log(`Computers turn`)
    console.log(`last hit array: ${lastHit.at(-1)}`);

    if (lastHit.at(-1)) {
      console.log(`Lasthit is truthy`)

      const directions = [
        [1, 0],  // RightMath.floor
        [0, 1],  // Down
        [-1, 0], // Left
        [0, -1], // Up
      ];


      const [lastHitCol, lastHitRow] = lastHit.at(-1);
      console.log(`last hit array: ${[lastHitCol, lastHitRow]}`);

      if (lastHit.at(-2) !== null && lastHit.at(-1) !== null && lastHit.length > 1) {
        console.log(`Generating last Direction`)

        // for (let i = 0; i < 2; i++) {
        //   console.log(`Calculating ${lastHit.at(-2)} - ${lastHit.at(-1)}`)
        //   const difference = lastHit.at(-2) - lastHit.at(-1);
        //   console.log(`Result: ${difference} (direction)`)
        //   lastDirection.push(difference);
        // }
        lastDirection = [];
        for (let i = 0; i < 2; i++) {
          console.log(`Calculating ${lastHit[lastHit.length - 1][i]} - ${lastHit[lastHit.length - 2][i]}`);
          const difference = lastHit[lastHit.length - 1][i] - lastHit[lastHit.length - 2][i];
          console.log(`Result: ${difference}`);
          lastDirection.push(difference);
        }
        console.log(`Result: ${[lastDirection]} (direction)`);

      }

      const result = directions.some(direction =>
        direction.length === lastDirection.length && direction.every((value, index) => value === lastDirection[index])
      );

      console.log(`lastdirection is not null?: ${lastDirection.at(-1) !== null}`)
      console.log(`lastdirection is a valid direction: ${result}`)


      if (lastDirection.at(-1) !== null && result) {
        console.log('has a last direction')
        console.log(lastDirection);
        const [colInc, rowInc] = lastDirection;
        let newCol = lastHitCol + colInc;
        let newRow = lastHitRow + rowInc;

        if (isValidCell(newCol, newRow)) {
          console.log('next in direction is valid');
          randomCol = newCol;
          randomRow = newRow;
        }

      } else {
        console.log('has NO last direction')
        //randomising directions:
        directions.sort(() => Math.random() - 0.5);
        console.log(directions)


        for (let i = 0; i < 4; i++) {

          const [colInc, rowInc] = directions[i];

          const newCol = lastHitCol + colInc;
          const newRow = lastHitRow + rowInc;
          console.log(`trying direction ${i}`);
          console.log(`lastHitCol ${lastHitCol} + colInc ${colInc}`);
          console.log(`lastHitCol ${lastHitRow} + colInc ${rowInc}`);
          console.log(`location ${[newCol, newRow]}`);

          if (isValidCell(newCol, newRow)) {
            console.log(`found valid cell`)
            console.log(`newCol: ${newCol} newRow: ${newRow}`);
            randomRow = newRow;
            randomCol = newCol;

            break;
          }
        }
      }
    }

    while (isValidCell(randomCol, randomRow) === false) {
      console.log('randomising');

      //let advantage = Math.random() < 0.5 ? true : false;
      let advantage = true;
      if (playerFleetHealth < 80 && advantage === true) {
        console.log('ADVANTAGE GIVEN!!!!!');
        // FIND THE REMAINING UNBOMBED PLAYER SHIP LOCATIONS
        const idOfSquare = findRandomNonSunk()
        const [unSunkCol, unSunkRow] = idOfSquare;

        randomCol = unSunkCol;
        randomRow = unSunkRow;

      } else {
        randomCol = Math.floor(Math.random() * playerBoardArr.length);
        randomRow = Math.floor(Math.random() * playerBoardArr[0].length);

      }

    }

    if (playerBoardArr[randomCol][randomRow] === 0) {
      console.log('miss');
      turn *= -1;
      playerBoardArr[randomCol][randomRow] -= 2;
      lastDirection = [null];  // Clear last direction on miss
    } else if (playerBoardArr[randomCol][randomRow] === 1) {
      console.log('hit');
      playerBoardArr[randomCol][randomRow] -= 2;
      playerFleetHealth -= 6;

      if (checkIfSunk(playerFleet, playerBoardArr)) {
        console.log('sunk');
        lastHit.push[null];  // Clear last direction and last hit when a ship is sunk
      } else {
        console.log('not sunk');
        //lastDirection.push(difference)
        lastHit.push([randomCol, randomRow]); // Save this hit
      }

      setTimeout(computerTurnAI, AI_DELAY);
    }

    winner = getWinner();
    render();
  }
}
function isValidCell(col, row) {
  console.log(`checking if ${[col, row]} is valid`)
  return (
    col >= 0 &&
    col < playerBoardArr.length &&
    row >= 0 &&
    row < playerBoardArr[0].length &&
    playerBoardArr[col][row] !== -1 &&
    playerBoardArr[col][row] !== -2 &&
    playerBoardArr[col][row] !== -3
  );
}

function findRandomNonSunk() {
  const nonSunk = playerFleet.flat().filter(location => !sunkenLocations.includes(location));
  console.log(nonSunk);
  const randomNonSunk = nonSunk[Math.floor(Math.random() * nonSunk.length)];
  console.log(randomNonSunk);
  const idOfSquare = randomNonSunk.slice(2).split('r');
  console.log(idOfSquare);
  return idOfSquare
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
  renderTurnIndicator()
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
    //console.log('humans win');
    return 1;
  } else if (playerBoardArr.flat().every(cell => cell <= 0)) {
    //console.log('aliens win');
    return -1;
  }
  // If we haven't returned yet, there's no winner
  //console.log('game is still in play');
  return null;
}

function renderTurnIndicator() {
  if (turn === 1) {
    computerBoard.classList.add('computer-active');
    playerBoard.classList.remove('player-active');
  } else if (turn === -1) {
    playerBoard.classList.add('player-active');
    computerBoard.classList.remove('computer-active');
  } else {
    playerBoard.classList.remove('player-active');
    computerBoard.classList.remove('computer-active');
  }
}

function renderFleetHealth() {
  computerHealthDisplay.innerText = computerFleetHealth > 0 ? `${computerFleetHealth}%` : `0%`;
  playerHealthDisplay.innerText = playerFleetHealth > 0 ? `${playerFleetHealth}%` : `0%`;
}

function renderMessage() {
  if (winner !== null) {
    messageEl.innerHTML = `${winner === 1 ? TURNS.player : TURNS.computer} wins!!!`;
    //scoreBoard.innerHTML = `<strong>SCORES: ${player1}: ${player1Score} | ${player2}: ${player2Score}</strong>`;
    //else, the game is in play
  } else if (turn === 0) {
    return
  } else {
    messageEl.innerHTML = `${turn === 1 ? TURNS.player : TURNS.computer}'s turn`;
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
      ship[i] = cellId;
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
      ship[i] = cellId;
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

function checkIfSunk(fleet, boardArr) {
  //console.log('checking for a sunken ship')

  fleet.forEach(ship => {
    //console.log(`ship: ${ship}`);
    const shipSunk = ship.every(shipSection => {
      // creates an array with the column value at 0, and row value at 1
      const idOfSquare = shipSection.slice(2).split('r');
      //console.log(`id of square: ${idOfSquare}`);
      //console.log(`boardArr square value: ${boardArr[idOfSquare[0]][idOfSquare[1]]}`);
      return boardArr[idOfSquare[0]][idOfSquare[1]] === -1;
    })
    //console.log(`shipSunk: ${shipSunk}`);

    if (shipSunk === true) {
      ship.forEach(shipSection => {
        const shipDiv = document.getElementById(`${shipSection}`);
        sunkenLocations.push(shipSection);

        if (shipDiv.classList.contains('horizontalFrontTemp')) {
          shipDiv.classList.replace('horizontalFrontTemp', 'horizontalFront');
        } else if (shipDiv.classList.contains('verticalFrontTemp')) {
          shipDiv.classList.replace('verticalFrontTemp', 'verticalFront');
        } else if (shipDiv.classList.contains('horizontalRearTemp')) {
          shipDiv.classList.replace('horizontalRearTemp', 'horizontalRear');
        } else if (shipDiv.classList.contains('verticalRearTemp')) {
          shipDiv.classList.replace('verticalRearTemp', 'verticalRear');
        }
        const idOfSquare = shipSection.slice(2).split('r');
        boardArr[idOfSquare[0]][idOfSquare[1]] = -3;
      })
      render();
      return true;
    }
    return false;
  })
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