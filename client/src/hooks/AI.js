class AI {
    constructor(difficulty, io) {
        this.io = io;
        this.difficulty = difficulty;
    }

    makeMove(board) {
        const errorProbability = 1 - (this.difficulty / 3);
        let move = this.findWinningMove(board);
        if (!move || Math.random() < errorProbability) {
            move = this.getRandomMove(board);
        }
        return move;
    }

    findWinningMove(board) {
        let availableMoves = [];  // Declare availableMoves within this method's scope

        // Add logic for determining a winning move (for now, just gathering valid moves)
        for (let col = 0; col < board.length; col++) {
            if (board[col].includes(0)) {
                availableMoves.push(col);
            }
        }

        // This method should return a column that could lead to a win
        // Currently, just returning `null` (replace with actual logic)
        return availableMoves.length > 0 ? availableMoves[0] : null; // Placeholder: return the first available move
    }

    getRandomMove(board) {
        let validMoves = [];
        for (let col = 0; col < board.length; col++) {
            if (board[col][0] === 0) {
                validMoves.push(col);
            }
        }
        return validMoves.length > 0 ? validMoves[Math.floor(Math.random() * validMoves.length)] : null;
    }
}

module.exports = AI;