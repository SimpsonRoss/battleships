/*----- constants -----*/
const ROWS = 6;
const COLS = 10;


/*----- state variables -----*/
let computerBoardArr;
let playerBoardArr;
let computerFleet;
let playerFleet;
let turn;
let winner;


/*----- cached elements  -----*/
const computerBoard = document.querySelector('#computerBoard');
const playerBoard = document.querySelector('#playerBoard');



/*----- event listeners -----*/




/*----- functions -----*/

const init = () => {
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

  generateBoard(computerBoard);
  generateBoard(playerBoard);
  turn = 1;
  winner = null;
  render();
}

// function boardClick(evt) {
//   // Guards:
//   // returns without procesing, if someone has won already or it's a tie
//   if (winner !== null) {
//     return;
//   }
//   // returns if the user clicks on something that isn't one of our 9 divs (a.k.a. the playable board)
//   if (!evt.target.id.startsWith('c')) {
//     return;
//   }

//   // Split the id string of the div to get the index
//   const idOfSquare = evt.target.id.split('c')[1].split('r');
//   const colIdx = parseInt(idOfSquare[0]);
//   const rowIdx = parseInt(idOfSquare[1]);

//   //assigning the turn value to that square of the board
//   board[colIdx][rowIdx] = turn;

//   // Switch player turn
//   turn *= -1;
//   // Check for winner
//   winner = getWinner(colIdx, rowIdx);
//   render();
// }

const generateBoard = (board, rows = ROWS, columns = COLS) => {
  for (let row = 0; row < rows; row++) {
    //const elRow = document.createElement('div');
    // elRow.className = 'row';
    //.appendChild(elRow);

    for (let column = 0; column < columns; column++) {
      const elColumn = document.createElement('div');
      //elColumn.className = 'column';

      let columnId = `c${String(column)}`;
      let rowId = `r${String(row)}`;
      elColumn.id = `${columnId}${rowId}`;

      board.appendChild(elColumn);
    }
  }
}

init();