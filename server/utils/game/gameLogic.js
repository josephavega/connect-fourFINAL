import AI from './AI.js'

class GameLogic {
    constructor() {
        this.board = this.createBoard();
        this.player = [null, null]
        this.currentPlayerIndex = 0;
        this.playerCount = 0;
        this.ai = [new AI(1), new AI(1)]; // AI difficulty Medium
        this.isAIvsAI = true;
        this.gameOver = false;
        this.isPlayerVsAI = false; 
    }

    setPlayer(newPlayer){
        player[this.playerCount] = newPlayer
        this.playerCount++
    }

    startAIVsAI(callback) {
        this.isAIvsAI = true;
        this.runAIGame(callback);
        
    }

    startPlayerVsAI() {
        this.isPlayerVsAI = true;
        this.ai[1] = new AI(2); 
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
                console.log(`Player ${this.getCurrentPlayer()} wins!`);
              
                    callback({ board: this.board, winner: this.getCurrentPlayer() });
                
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
        console.log(`AI (${this.getCurrentPlayer()}) is making move: ${move}`);
        if (move !== null) {
            this.placePiece(move);
            this.printBoard(); // Log the board after placing the piece
            callback({ board: this.board, winner: this.getCurrentPlayer() });
        } else {
            console.log("No valid moves available.");
        }
    }
    

    createBoard() {
        const rows = 6;
        const columns = 7;
        const board = Array.from({ length: columns }, () => Array(rows).fill(0));
        return board;
    }

    printBoard() {
        const rows = 6;
        const columns = 7;
        for (let row = 0; row < rows; row++) {
            let rowStr = "";
            for (let col = 0; col < columns; col++) {
                rowStr += this.board[col][row] === 0 ? "[0]" : `[${this.board[col][row]}]`;
            }
            console.log(rowStr);
        }
        console.log("\n");
    }

    placePiece(columnIndex) {
        // Bottom to top
        for (let i = this.board[columnIndex].length - 1; i >= 0; i--) {
            if (this.board[columnIndex][i] === 0) {
                this.board[columnIndex][i] = this.getCurrentPlayer();
            

                if (this.checkWin()) {
                    this.gameOver = true;
            
                    return;
                }

                this.switchPlayer();
                return;
            }
        }
        console.log("No valid moves available in this column.");
    }

    getCurrentPlayer() {
        return this.player[this.currentPlayerIndex].color;
    }

    switchPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
        console.log(`Current Player: ${this.getCurrentPlayer()}`);
       
    }

    checkWin() {
        return this.checkVerticalWin() || this.checkHorizontalWin() || this.checkDiagonalWin();
    }

    checkVerticalWin() {
        for (let col = 0; col < this.board.length; col++) {
            let count = 0;
            for (let row = 0; row < this.board[col].length; row++) {
                if (this.board[col][row] === this.getCurrentPlayer()) {
                    count++;
                    if (count === 4) return true;
                } else {
                    count = 0;
                }
            }
        }
        return false;
    }

    checkHorizontalWin() {
        for (let row = 0; row < this.board[0].length; row++) {
            let count = 0;
            for (let col = 0; col < this.board.length; col++) {
                if (this.board[col][row] === this.getCurrentPlayer()) {
                    count++;
                    if (count === 4) return true;
                } else {
                    count = 0;
                }
            }
        }
        return false;
    }

    checkDiagonalWin() {
        // Left to right diagonal
        for (let col = 0; col < this.board.length - 3; col++) {
            for (let row = 0; row < this.board[0].length - 3; row++) {
                if (
                    this.board[col][row] === this.getCurrentPlayer() &&
                    this.board[col + 1][row + 1] === this.getCurrentPlayer() &&
                    this.board[col + 2][row + 2] === this.getCurrentPlayer() &&
                    this.board[col + 3][row + 3] === this.getCurrentPlayer()
                ) {
                    return true;
                }
            }
        }

        // Right to left diagonal
        for (let col = 3; col < this.board.length; col++) {
            for (let row = 0; row < this.board[0].length - 3; row++) {
                if (
                    this.board[col][row] === this.getCurrentPlayer() &&
                    this.board[col - 1][row + 1] === this.getCurrentPlayer() &&
                    this.board[col - 2][row + 2] === this.getCurrentPlayer() &&
                    this.board[col - 3][row + 3] === this.getCurrentPlayer()
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    isBoardFull() {
        for (let col = 0; col < this.board.length; col++) {
            if (this.board[col][0] === 0) {
                return false;
            }
        }
        return true;
    }

}
export default GameLogic;
