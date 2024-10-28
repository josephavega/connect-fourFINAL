const socket = io('http://localhost:3000'); // Socket connection
const gameBoardDiv = document.getElementById('gameboard');
const turnIndicator = document.getElementById('turn-indicator');
const timerDisplay = document.getElementById('timer');
let currentPlayer = 1; // 1 = Red, 2 = Yellow
let timerInterval;


document.addEventListener('DOMContentLoaded', () => {
    constructGameboard();
    fetchInitialBoard();
    startTimer(120);

})

// Construct the initial gameboard
function constructGameBoard() {
    for (let row = 5; row >= 0; row--) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.column = col;
            gameBoardDiv.appendChild(cell);
        }
    }
}



// Handle move when player clicks a column button
async function makeMove(column) {
    try {
        const response = await fetch('http://localhost:3000/move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ column })
        });

        if (response.ok) {
            const data = await response.json();
            updateBoard(data.board);
            if (data.message && data.message.includes("wins")) {
                clearInterval(timerInterval);
                alert(data.message);
                resetTimer();
            } else {
                resetTimer();
                startTimer();
            }
        } else {
            console.log("Error making move:", response.statusText);
        }
    } catch (error) {
        console.error("Error making move:", error);
    }
}

// Update the gameboard based on the current state

function updateBoard(board) {
    board.forEach((column, colIndex) => {
        column.forEach((cellValue, rowIndex) => {
            const cell = document.querySelector(`div[data-row="${rowIndex}"][data-column="${colIndex}"]`);
            if (cell) {
                cell.classList.remove('red-chip', 'yellow-chip');
                if (cellValue === 1) {
                    cell.classList.add('red-chip');
                    console.log("Added red chip to board");
                } else if (cellValue === 2) {
                    cell.classList.add('yellow-chip');
                    console.log("Added yellow chip to board");
                }
            }
        });
    });
}

// Update turn indicator
function updateTurnIndicator(player) {
    currentPlayer = player;
    turnIndicator.textContent = currentPlayer === 1 ? "Player 1's Turn (Red)" : "Player 2's Turn (Yellow)";
}



// Timer functionality for moves
function startTimer(duration) {
    let timeLeft = duration;
    timerDisplay.textContent = `Time left for this move: ${timeLeft}s`;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left for this move: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert(`Time is up! Player ${currentPlayer === 1 ? 2 : 1} wins by default.`);
            resetGame();
        }
    }, 1000);
}


function resetTimer() {
    clearInterval(timerInterval);
}

// Function to reset the gameboard and timer (optional feature)
function resetGame() {
    // Logic to reset the gameboard can go here.
    window.location.reload(); // For simplicity, just reload the page.
}

// Fetch and display the initial gameboard state
async function fetchInitialBoard() {
    try {
        const response = await fetch('http://localhost:3000/gameboard');
        const data = await response.json();
        updateBoard(data.board);
        startTimer(); // Start the timer when the board is loaded.
    } catch (error) {
        console.error("Error fetching initial game board:", error);
    }
}

// Listen for real-time updates from the server via WebSockets
socket.on('gameBoardUpdated', (board) => {
    console.log('Received updated board:', board);
    updateBoard(board);
    resetTimer();
    startTimer(120); // Reset timer for the next turn
});

socket.on('playerTurn', (player) => {
    console.log('Received player turn: ', player);
    updateTurnIndicator(player);
});

socket.on('timerUpdate', (data) => {
    console.log('Received timer update: ', data.time);
    timerDisplay.textContent = `Time left for this move: ${data.time}s`;
});

socket.on('gameOver', (data) => {
    HTMLFormControlsCollection.log('Received game over event', data);
    clearInterval(timerInterval);
    alert(`Game Over! Player ${data.winner} wins!`);
});