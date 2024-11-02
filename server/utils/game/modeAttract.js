
const gameBoardDiv = document.getElementById('gameboard');

// Set up event listener to construct the gameboard after the DOM loads
document.addEventListener('DOMContentLoaded', () => {
    constructGameBoard();
    fetchInitialBoard();
});

// Function to construct the initial gameboard
function constructGameBoard() {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = r;
        cell.dataset.column = c;
        gameBoardDiv.appendChild(cell);
      }
    }
  }

// Fetch the initial gameboard state when the page loads
async function fetchInitialBoard() {
    try {
        const response = await fetch('http://localhost:3000/gameboard');
        if (response.ok) {
            const data = await response.json();
            updateBoard(data.board); // Update the gameboard with the initial state
        } else {
            console.error('Error fetching initial game board:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching initial game board:', error);
    }
}

  // Update the gameboard based on the current state
  function updateBoard(board) {
    board.forEach((row, rIndex) => {
      row.forEach((cellValue, cIndex) => {
        const cell = document.querySelector(`div[data-row="${rIndex}"][data-column="${cIndex}"]`);
        if (cellValue === 1) {
          cell.innerHTML = '<div class="red-chip"></div>';
        } else if (cellValue === 2) {
          cell.innerHTML = '<div class="yellow-chip"></div>';
        } else {
          cell.innerHTML = ''; // Empty cell
        }
      });
    });
  }

function printBoard(board) {
    for (let row = 0; row < 6; row++) {
        let rowString = '';
        for (let col = 0; col < 7; col++) {
            rowString += board[col][row] + ' ';
        }
        console.log(`Row ${row}: [${rowString.trim()}]`);
    }
}




// Listen for real-time updates from the server to update the gameboard
socket.on('gameBoardUpdated', (board) => {
    updateBoard(board);
    console.log('Gameboard updated');
    console.log(printBoard(board));
});
