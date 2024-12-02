import AI from './AI.js'
import Player from './Player.js';

class GameLogic {

    constructor() {
        this.board = this.createBoard();
        this.player = [new Player(-1,'Red','R',this), new Player(-1,'Yellow','Y',this)]
        this.currentPlayerIndex = 0;
        this.playerCount = 0;
        this.ai = [new AI(1,'R'), new AI(1,'Y')]; // AI difficulty Medium
        this.isAIvsAI = true;
        this.gameOver = true;
        this.isPlayerVsAI = false;
        this.moves = []
        this.winner = ''; 
        
        //[Rule,Col,Row,Type]
        //Rule 'Place', 'Anvil', 'Broken', 'Lightning', 'Flipped', 'Brick', 'StoppedL','StoppedA', 'Win','Full'
        //Lightning for the inititial shock location
        //Anvil/Brick for column
        //Flipped for chips hit with the lightning
        //StoppedL for if Lightning hits a brick
        //StoppedA for if Anvil hits a brick
    }   

    setPlayer(sessionID,username){
        this.player[this.currentPlayerIndex].sessionID = sessionID;
        this.player[this.currentPlayerIndex].username = username;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
    }


    getPlayers() {
        player_one = this.player[0];
        player_two = this.player[1];
        console.log(`Player One: ${player_one}, Player Two: ${player_two}`);
    }

    startAIVsAI(callback) {
        this.isAIvsAI = true;
        this.gameOVer = false;
        this.player[0]=this.ai[0]
        this.player[1]=this.ai[1]
        this.runAIGame(callback);
        
    }

    startPlayerVsAI() {
        this.isPlayerVsAI = true;
        this.gameOver = false;
        this.player[0] = new Player(-1, 'Player', 'R', this); // Human Player
        this.player[1] = this.ai[1]; // AI Opponent
    }
    

    runAIGame(callback) {
        console.log('Setting up game...')
        const interval = setInterval(() => {
            if (this.gameOver) {
                clearInterval(interval);
                return; // Stop loop if game over
            }

            this.aiMove(callback);
            if (this.checkWin()) {
                this.gameOver = true;
                console.log(`Player ${this.getCurrentPlayer().color} wins!`);
              
                    callback({ board: this.board, winner: this.getCurrentPlayer().color });
                
            } else if (this.isBoardFull()) {
                clearInterval(interval);
                console.log("The game is a draw!");
                    callback({ board: this.board, message: "The game is a draw!" });

            }
        }, 2000);
    }

    aiMove(callback) {
        const ai = this.ai[this.currentPlayerIndex];
        const move = ai.makeMove(this.board);
        console.log(`AI (${this.getCurrentPlayer().color}) is making move: ${move}`);
        if (move !== null) {
            this.placePiece(move);
            this.printBoard(); // Log the board after placing the piece
            callback({ board: this.board, winner: this.getCurrentPlayer().color });
        } else {
            console.log("No valid moves available.");
        }
    }
    

    createBoard() {
        const rows = 6;
        const columns = 7;
        const board = Array.from({ length: rows }, () => Array(columns).fill(0));
        return board;
    }

    printBoard() {
        const rows = 6;
        const columns = 7;

        for (let row = rows - 1; row >= 0; row--) {

            let rowStr = "";
            for (let col = 0; col < columns; col++) {
                rowStr += this.board[row][col] === 0 ? "[0]" : `[${this.board[row][col]}]`;
            }
            console.log(rowStr);
        }
        console.log("\n");
    }

    getFlippedBoard() {
        // Reverse the rows to "flip" the board upside down
        return this.board.slice().reverse();
    }


    placePiece(columnIndex) {
        // Bottom to top
        for (let row = 0; row < this.board.length; row++) {
            if (this.board[row][columnIndex] === 0) {
                this.board[row][columnIndex] = this.getCurrentPlayer().color;
                this.moves.push(['Place',row,columnIndex,this.getCurrentPlayer().color])
                if (this.checkWin()) {
                    this.gameOver = true;
                    this.winner = this.getCurrentPlayer();
                    console.log(`${this.winner.color} has won the game!`);
                
                    this.board = this.createBoard();
                    return;
                }
            
                this.switchPlayer();
                return;
            }
        }
        console.log("No valid moves available in this column.");
    
    }

    getCurrentPlayer() {
        return this.player[this.currentPlayerIndex];
    }

    switchPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
        console.log(`Current Player: ${this.getCurrentPlayer().color}`);
       
    }

    checkWin() {
        return this.checkVerticalWin() || this.checkHorizontalWin() || this.checkDiagonalWin();
    }

    checkVerticalWin() {
        const rows = this.board.length;
        const columns = this.board[0].length;
    
        for (let col = 0; col < columns; col++) {
            let winningMoves = [];
            for (let row = 0; row < rows; row++) {
                if (this.board[row][col] === this.getCurrentPlayer().color) {
                    winningMoves.push([row, col]);
                    if (winningMoves.length === 4) {
                        for (let move of winningMoves) {
                            this.moves.push(['Win', move[0], move[1], this.getCurrentPlayer().color]);
                        }
                        return true;
                    }
                } else {
                    winningMoves = [];
                }
            }
        }
        return false;
    }
    
    checkHorizontalWin() {
        const rows = this.board.length;
        const columns = this.board[0].length;
    
        for (let row = 0; row < rows; row++) {
            let winningMoves = [];
            for (let col = 0; col < columns; col++) {
                if (this.board[row][col] === this.getCurrentPlayer().color) {
                    winningMoves.push([row, col]);
                    if (winningMoves.length === 4) {
                        for (let move of winningMoves) {
                            this.moves.push(['Win', move[0], move[1], this.getCurrentPlayer().color]);
                        }
                        return true;
                    }
                } else {
                    winningMoves = [];
                }
            }
        }
        return false;
    }
    
    checkDiagonalWin() {
        const rows = this.board.length;
        const columns = this.board[0].length;
    
        // Left to right diagonal
        for (let row = 0; row < rows - 3; row++) {
            for (let col = 0; col < columns - 3; col++) {
                if (
                    this.board[row][col] === this.getCurrentPlayer().color &&
                    this.board[row + 1][col + 1] === this.getCurrentPlayer().color &&
                    this.board[row + 2][col + 2] === this.getCurrentPlayer().color &&
                    this.board[row + 3][col + 3] === this.getCurrentPlayer().color
                ) {
                    this.moves.push(['Win', row, col, this.getCurrentPlayer().color]);
                    this.moves.push(['Win', row + 1, col + 1, this.getCurrentPlayer().color]);
                    this.moves.push(['Win', row + 2, col + 2, this.getCurrentPlayer().color]);
                    this.moves.push(['Win', row + 3, col + 3, this.getCurrentPlayer().color]);
                    return true;
                }
            }
        }
    
        // Right to left diagonal
        for (let row = 0; row < rows - 3; row++) {
            for (let col = 3; col < columns; col++) {
                if (
                    this.board[row][col] === this.getCurrentPlayer().color &&
                    this.board[row + 1][col - 1] === this.getCurrentPlayer().color &&
                    this.board[row + 2][col - 2] === this.getCurrentPlayer().color &&
                    this.board[row + 3][col - 3] === this.getCurrentPlayer().color
                ) {
                    this.moves.push(['Win', row, col, this.getCurrentPlayer().color]);
                    this.moves.push(['Win', row + 1, col - 1, this.getCurrentPlayer().color]);
                    this.moves.push(['Win', row + 2, col - 2, this.getCurrentPlayer().color]);
                    this.moves.push(['Win', row + 3, col - 3, this.getCurrentPlayer().color]);
                    return true;
                }
            }
        }
        return false;
    }

    isBoardFull() {
        for (let row = 0; row < this.board.length; row++) {
            var winningMoves = []
            for (let col = 0; col < this.board[0].length; col++) {
                if (this.board[row][col] === 0) {
                    return false;
                }
            }
        }
        this.moves.push(['Full',-1,-1,this.getCurrentPlayer])
        return true;
    }

}
export default GameLogic;
