class boardManager {
    constructor() {
        this.board = this.createBoard();
    }

    createBoard() {
        const rows = 6;
        const columns = 7;
        const board = Array.from({ length: columns }, () => Array(rows).fill(0));
        return board;
    }

    placePiece(rowIndex, columnIndex) {
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