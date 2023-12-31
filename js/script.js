/*----- constants -----*/
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
  player: 'PLAYER',
  computer: 'ALIEN',
}

const PLAYERWEAPONS = {
  cannon: '∞',
  laser: 2,
  nuke: 0,
}

const COMPWEAPONS = {
  cannon: 100,
  laser: 2,
  nuke: 0,
}

const ANIMATIONS = {
  celebration: ['alienCelebration2', 'alienCelebration3', 'alienCelebration4', 'alienCelebration6'],
  idle: ['alienIdle1', 'alienIdle2', 'alienIdle3', 'alienIdle4'],
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
let selectedWeapon;
let nukesGranted;
let shuffleFlashing;
let flashingShuffle;
let startFlashing;
let flashingStart;

/*----- cached elements  -----*/
const computerBoard = document.getElementById('computerBoard');
const playerBoard = document.getElementById('playerBoard');
const computerHealthDisplay = document.getElementById('computerFleetHealth');
const playerHealthDisplay = document.getElementById('playerFleetHealth');
const messageEl = document.getElementById('message');
const startBtn = document.getElementById('start');
const shuffleBtn = document.getElementById('shuffle');
const cannonCounter = document.getElementById('playerCannonCounter');
const laserCounter = document.getElementById('playerLaserCounter');
const nukeCounter = document.getElementById('playerNukeCounter');
const cannonBtn = document.getElementById('playerCannon');
const laserBtn = document.getElementById('playerLaser');
const nukeBtn = document.getElementById('playerNuke');
const alien = document.getElementById('alien');

/*----- event listeners -----*/
computerBoard.addEventListener('click', boardClick);
startBtn.addEventListener('click', startTurns);
shuffleBtn.addEventListener('click', reshuffleBoards);
cannonBtn.addEventListener('click', function () { selectedWeapon = 'CANNON'; render() });
laserBtn.addEventListener('click', function () { selectedWeapon = 'LASER'; render() });
nukeBtn.addEventListener('click', function () { selectedWeapon = 'NUKE'; render(); console.log('clickedNuke') });

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
  selectedWeapon = 'CANNON';
  nukesGranted = 0;
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

  PLAYERWEAPONS.laser = 2;
  PLAYERWEAPONS.nuke = 0;
  COMPWEAPONS.laser = 2;
  COMPWEAPONS.nuke = 0;

  //generating new board
  generateBoard(computerBoard, false);
  generateBoard(playerBoard, true);

  // clearing classed from playerBoard 
  Array.from(playerBoard.children).forEach(cell => {
    cell.classList.remove('horizontalFront', 'horizontalRear', 'verticalFront', 'verticalRear');
  });
  // clear classes from computerBoard
  Array.from(computerBoard.children).forEach(cell => {
    cell.classList.remove('horizontalFront', 'horizontalRear', 'verticalFront', 'verticalRear', 'horizontalFrontTemp', 'horizontalRearTemp', 'verticalFrontTemp', 'verticalRearTemp');
  });


  placeShipsOnBoard(playerFleet, playerBoardArr);
  placeShipsOnBoard(computerFleet, computerBoardArr);
  computerFleetHealth = 100;
  playerFleetHealth = 100;
  lastHit = [null];
  lastDirection = [null];

  //triggering some helpful info for players to follow
  setTimeout(miniTutorial, 4000);

  render();
}

function miniTutorial() {
  messageEl.innerHTML = "SHUFFLE AND START -->";
  flashingShuffle = setInterval(flashShuffleButton, 500);
  render();
}

function flashShuffleButton() {
  shuffleBtn.style.backgroundColor === "rgb(110, 239, 240)" ?
    shuffleBtn.style.backgroundColor = "" :
    shuffleBtn.style.backgroundColor = "rgb(110, 239, 240)";
  if (shuffleFlashing === false) {
    clearInterval(flashingShuffle);
    shuffleBtn.style.backgroundColor = "";
    flashingStart = setInterval(flashStartButton, 500);
  }
  render();
}

function flashStartButton() {
  startBtn.style.backgroundColor === "rgb(110, 239, 240)" ?
    startBtn.style.backgroundColor = "" :
    startBtn.style.backgroundColor = "rgb(110, 239, 240)";
  if (startFlashing === false) {
    clearInterval(flashingStart);
    startBtn.style.backgroundColor = "";
  }
  render();
}

// function to select a random Idle animation
function selectRandomIdle() {
  if (winner !== null) { return };
  let randomIdle = ANIMATIONS.idle[Math.floor(Math.random() * ANIMATIONS.idle.length)];
  alien.src = `images/alien/${randomIdle}.gif`;
}

// function to select a random Celebration animation
function selectRandomCelebration() {
  if (winner !== null) { return };
  let randomCelebration = ANIMATIONS.celebration[Math.floor(Math.random() * ANIMATIONS.celebration.length)];
  alien.src = `images/alien/${randomCelebration}.gif`;
}

function startTurns() {
  //stop the buttons from flashing
  shuffleFlashing = false;
  startFlashing = false;

  if (turn === 0 && winner === null) {
    turn = 1;
    computerBoard.classList.add('hoverEffect');
    render();
    selectRandomIdle();
    //console.log('start game!')
  } else if (winner !== null) { // if the game has ended, reset it
    console.log("REEEESSSEEEETTTTINNGGG")
    init();
    //console.log('reset game!')
    render();
    messageEl.innerText = "Return at your peril";
    selectRandomIdle();
  }
}

// function that deals with the player clicking on the computer's board
function boardClick(evt) {

  // guard whichreturns without processing, if someone has won already or it's a tie
  if (winner !== null || turn === 0) {
    return;
  }
  
  // gets the coordinates of the square by parsing the id
  const idOfSquare = evt.target.id.slice(2).split('r');
  const colIdx = parseInt(idOfSquare[0]);
  const rowIdx = parseInt(idOfSquare[1]);
    
    /*----- CANNON -----*/
    if (selectedWeapon === 'CANNON') {
      
      if (turn === 1 && evt.target.id.startsWith('C')) {
        if (computerBoardArr[colIdx][rowIdx] < 0) {
          //console.log('not valid');
          return;

          //MISS
        } else if (computerBoardArr[colIdx][rowIdx] === 0) {
          messageEl.innerHTML = "MISSED!";
          // If the player doesn't get a hit, switch to computer's turn
          //console.log('player misses')
          turn *= -1
          computerBoardArr[colIdx][rowIdx] -= 2;

          //HIT
        } else if (computerBoardArr[colIdx][rowIdx] === 1) {
          messageEl.innerHTML = "CANNON HITS!";
          //console.log('player gets a hit')
          computerBoardArr[colIdx][rowIdx] -= 2;
          //console.log(evt.target.classList)
          computerFleetHealth -= 6;
          checkIfSunk(computerFleet, computerBoardArr)
        }
      }
    }
     /*----- LASER -----*/
    else if (selectedWeapon === 'LASER') {

      // On player's turn, interact with computer's board
      if (turn === 1 && evt.target.id.startsWith('C')) {

        // Find if there are any valid cells in the column to hit
        const validCells = computerBoardArr[colIdx].some(cell => cell >= 0);

        if (!validCells) {
          console.log('no empty cells in the column to hit');
          return;
        }
        let hitCount = 0; // to count the number of hits

        // Modify cells in the column
        computerBoardArr[colIdx] = computerBoardArr[colIdx].map(cell => {
          if (cell === 1) {
            messageEl.innerHTML = "LASER STRIKE!";
            hitCount++;
            return cell - 2; // decrease by 2 for hits
          }
          if (cell === 0) {
            return cell - 2; // decrease by 2 for misses
          }
          return cell; // return cell value unchanged for cells < 0
        });
        PLAYERWEAPONS.laser -= 1;
        turn *= -1;
        computerFleetHealth -= (6 * hitCount);
        checkIfSunk(computerFleet, computerBoardArr);
      }
    }
    /*----- NUKE -----*/
    else if (selectedWeapon === 'NUKE') {
      
      if (turn === 1 && evt.target.id.startsWith('C')) {
        let hitCount = 0; // to count the number of hits
        // calculate the indices of cells around the clicked cell in the pattern
        const indices = [
          [colIdx, rowIdx - 2], [colIdx - 1, rowIdx - 1], [colIdx, rowIdx - 1], [colIdx + 1, rowIdx - 1],
          [colIdx - 2, rowIdx], [colIdx - 1, rowIdx], [colIdx, rowIdx], [colIdx + 1, rowIdx], [colIdx + 2, rowIdx],
          [colIdx - 1, rowIdx + 1], [colIdx, rowIdx + 1], [colIdx + 1, rowIdx + 1], [colIdx, rowIdx + 2]
        ];

        // uterate over each index pair
        for (let i = 0; i < indices.length; i++) {
          const [col, row] = indices[i];
          console.log(col, row)
          // check if index pair is valid
          if (col >= 0 && col < computerBoardArr.length && row >= 0 && row < computerBoardArr[0].length) {
            // decrease by 2 for hits
            if (computerBoardArr[col][row] === 1) {
              computerBoardArr[col][row] -= 2;
              messageEl.innerHTML = "NUCLEAR DECIMATION!!";
              hitCount++;
            }
            // decrease by 2 for misses
            else if (computerBoardArr[col][row] === 0) {
              computerBoardArr[col][row] -= 2;
            }
          }
        }
        PLAYERWEAPONS.nuke -= 1;
        turn *= -1;
        computerFleetHealth -= (6 * hitCount);
        checkIfSunk(computerFleet, computerBoardArr);
      }
    }
  grantNukes();
  winner = getWinner();
  render();
  //Trigger the Computer to take it's turn after a delay
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
          console.log(`type of lastHitCol ${typeof lastHitCol} + type of colInc ${typeof colInc}`);
          console.log(`lastHitCol ${lastHitCol} + colInc ${colInc}`);
          console.log(`lastHitRow ${lastHitRow} + rowInc ${rowInc}`);
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
      // option to give the AI an augmented advantage which makes it more competitive
      let advantage = true;
      if (playerFleetHealth < 100 && advantage) {
        console.log('ADVANTAGE GIVEN!!!!!');

        // find the locations of unsunk player ships
        const idOfSquare = findRandomNonSunk()
        const [unSunkCol, unSunkRow] = idOfSquare;
        console.log(`type of unSunkCol ${typeof unSunkCol} + type of unSunkRow ${typeof unSunkRow}`);
        randomCol = parseInt(unSunkCol, 10);
        randomRow = parseInt(unSunkRow, 10);

      } else {
        randomCol = Math.floor(Math.random() * playerBoardArr.length);
        randomRow = Math.floor(Math.random() * playerBoardArr[0].length);
      }
    }

    if (playerBoardArr[randomCol][randomRow] === 0) {
      console.log('miss');
      turn *= -1;
      playerBoardArr[randomCol][randomRow] -= 2;
      // clear last direction if there's a miss
      lastDirection = [null]; 
    } else if (playerBoardArr[randomCol][randomRow] === 1) {
      console.log('hit');
      playerBoardArr[randomCol][randomRow] -= 2;
      playerFleetHealth -= 6;

      if (checkIfSunk(playerFleet, playerBoardArr)) {
        console.log('sunk');
        // clear last direction if the ship is sunk
        lastHit.push[null]; 
      } else {
        console.log('not sunk');
        // record the last hit
        lastHit.push([randomCol, randomRow]);
      }
      setTimeout(computerTurnAI, AI_DELAY);
    }
    winner = getWinner();
    grantNukes();
    render();
  }
}

// function that checks if the cell is a valid choice for the AI to attack
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

// function that finds a random coordinate of an unsunk ship
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

// generates the boards of divs based on the player arrays
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
  renderBoard(computerBoardArr, false, COMPCOLORS);
  renderBoard(playerBoardArr, true, PLAYERCOLORS);
  renderControls();
  renderFleetHealth();
  renderTurnIndicator();
  renderWeaponCounters();
  renderWeaponButtons();
  renderMessage();
}

function renderControls() {
  startBtn.innerText = winner ? 'PLAY AGAIN' : 'START GAME';
}

function renderWeaponButtons() {
  if (selectedWeapon === 'LASER' && PLAYERWEAPONS.laser <= 0) {
    selectedWeapon = 'CANNON';
  }
  if (selectedWeapon === 'NUKE' && PLAYERWEAPONS.nuke <= 0) {
    selectedWeapon = 'CANNON';
  }
  if (selectedWeapon === 'CANNON') {
    cannonBtn.style.backgroundColor = 'blueviolet';
    cannonBtn.style.border = '.5vmin inset rgb(110, 239, 240)'
    laserBtn.style.backgroundColor = '';
    laserBtn.style.border = '';
    nukeBtn.style.backgroundColor = '';
    nukeBtn.style.border = '';
  } else if (selectedWeapon === 'LASER') {
    laserBtn.style.backgroundColor = 'blueviolet';
    laserBtn.style.border = '.5vmin inset rgb(110, 239, 240)'
    cannonBtn.style.backgroundColor = '';
    cannonBtn.style.border = '';
    nukeBtn.style.backgroundColor = '';
    nukeBtn.style.border = '';
  } else if (selectedWeapon === 'NUKE') {
    nukeBtn.style.backgroundColor = 'blueviolet';
    nukeBtn.style.border = '.5vmin inset rgb(110, 239, 240)'
    cannonBtn.style.backgroundColor = '';
    cannonBtn.style.border = '';
    laserBtn.style.backgroundColor = '';
    laserBtn.style.border = '';
  }
}

function renderBoard(boardArr, isPlayerBoard, Colors) {
  // using the prefixes P = player C = computer to amend the ids for each cell div. 
  const prefix = isPlayerBoard ? 'P' : 'C';
  boardArr.forEach((colArr, colIdx) => {
    colArr.forEach((cellVal, rowIdx) => {
      const cellId = `${prefix}c${colIdx}r${rowIdx}`;
      const cellEl = document.querySelector(`#${cellId}`);
      cellEl.style.backgroundColor = `${Colors[cellVal]}`;
    })
  });
}

function grantNukes() {
  if (nukesGranted > 0) {
    return
  }
  if (playerFleetHealth > (computerFleetHealth + 40)) {
    messageEl.innerHTML = "NUKE GRANTED!";
    PLAYERWEAPONS.nuke += 1;
    nukesGranted += 1;
  } else if (computerFleetHealth > (playerFleetHealth + 40)) {
    COMPWEAPONS.nuke += 1;
    nukesGranted += 1;
  }
}

function getWinner() {
  // flattens the whole array and then checks if every cell is zero or less 
  // i.e. the board owner has no ships, and so has lost 
  if (computerBoardArr.flat().every(cell => cell <= 0)) {
    alien.src = `images/alien/alienGrave.png`;
    startFlashing = true;
    flashingStart = setInterval(flashStartButton, 500);
    render();
    return 1;
  } else if (playerBoardArr.flat().every(cell => cell <= 0)) {
    alien.src = `images/alien/alienCelebration5.gif`;
    startFlashing = true;
    flashingStart = setInterval(flashStartButton, 500);
    render();
    return -1;
  }
  // If we haven't returned yet, there's no winner
  return null;
}

// renders a border around the board of whoever's turn it is
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

// renders the fleet health out of 100% for each player
function renderFleetHealth() {
  computerHealthDisplay.innerText = computerFleetHealth > 0 ? `${computerFleetHealth}%` : `0%`;
  playerHealthDisplay.innerText = playerFleetHealth > 0 ? `${playerFleetHealth}%` : `0%`;
}

// renders how many of each weapon the player has remaining
function renderWeaponCounters() {
  cannonCounter.innerText = PLAYERWEAPONS.cannon;
  laserCounter.innerText = PLAYERWEAPONS.laser;
  nukeCounter.innerText = PLAYERWEAPONS.nuke;
}

function renderMessage() {
  if (turn === 0) { return }
  if (winner !== null) {
    messageEl.innerHTML = `${winner === 1 ? TURNS.player : TURNS.computer} WINS!!!`;
    //else, the game is in play
  } else {
    setTimeout(() => {
      messageEl.innerHTML = `${turn === 1 ? TURNS.player : TURNS.computer}'S TURN`;
    }, 700);
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
  fleet.forEach(ship => {
    const shipSunk = ship.every(shipSection => {
      // creates an array with the column value at 0, and row value at 1
      const idOfSquare = shipSection.slice(2).split('r');
      return boardArr[idOfSquare[0]][idOfSquare[1]] === -1;
    })

    if (shipSunk) {
      if (!winner) {
        selectRandomCelebration();
        setTimeout(selectRandomIdle, 3000)
      }

      messageEl.innerHTML = "SHIP SUNK!";
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
  shuffleFlashing = false;
  render();
}
init();