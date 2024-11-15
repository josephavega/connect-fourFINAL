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
        this.moves = [] //[Rule,Col,Row,Type]
        //Rule 'Place', 'Anvil', 'Broken', 'Lightning', 'Flipped', 'Brick', 'StoppedL','StoppedA', 'Win','Full'
        //Lightning for the inititial shock location
        //Anvil/Brick for column
        //Flipped for chips hit with the lightning
        //StoppedL for if Lightning hits a brick
        //StoppedA for if Anvil hits a brick
        
    }   

    setPlayer(newPlayer, team){
        this.player[this.playerCount] = newPlayer;
        this.playerCount++;
    }

    getPlayers() {
        player_one = this.player[0];
        player_two = this.player[1];
        console.log(`Player One: ${player_one}, Player Two: ${player_two}`);
    }

    startAIVsAI(callback) {
        this.isAIvsAI = true;
        this.player[0]=this.ai[0]
        this.player[0].color = 'R'
        this.player[1]=this.ai[1]
        this.player[1].color = 'Y'
        this.runAIGame(callback);
        
    }

    startPlayerVsAI() {
        this.isPlayerVsAI = true;
        this.player[1] = this.ai[0]
        this.player[1].color = this.player[0].color == 'R'? 'Y':'R'
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
        const board = Array.from({ length: columns }, () => Array(rows).fill(0));
        return board;
    }

    printBoard() {
        const rows = 6;
        const columns = 7;
        for (let row = rows - 1; row >= 0; row--) {
            let rowStr = "";
            for (let col = 0; col < columns; col++) {
                rowStr += this.board[col][row] === 0 ? "[0]" : `[${this.board[col][row]}]`;
            }
            console.log(rowStr);
        }
        console.log("\n");
    }

    updateFrontEnd(){
        
    }



    placePiece(columnIndex) {
        // Bottom to top
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[columnIndex][i] === 0) {
                this.board[columnIndex][i] = this.getCurrentPlayer().color;
                this.moves.push(['Place',columnIndex,i,this.getCurrentPlayer().color])
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
        
        for (let col = 0; col < this.board.length; col++) {
            var winningMoves = []
            for (let row = 0; row < this.board[col].length; row++) {
                if (this.board[col][row] === this.getCurrentPlayer().color) {
                    winningMoves.push([col,row])
                    
                    if (winningMoves.length === 4){
                        for(let i = 0; i < winningMoves.length; i++){
                            this.moves.push(['Win',col,row,this.getCurrentPlayer.color])
                        }
                        return true;
                    } 
                }else{
                    winningMoves = []
                } 
            }
        }
        return false;
    }

    checkHorizontalWin() {
        for (let row = 0; row < this.board[0].length; row++) {
            var winningMoves = []
            for (let col = 0; col < this.board.length; col++) {
                if (this.board[col][row] === this.getCurrentPlayer().color) {
                    winningMoves.push([col,row])
                    
                    if (winningMoves.length === 4){
                        for(let i = 0; i < winningMoves.length; i++){
                            this.moves.push(['Win',col,row,this.getCurrentPlayer.color])
                        }
                        return true;
                    } 
                }else{
                    winningMoves = []
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
                    this.board[col][row] === this.getCurrentPlayer().color &&
                    this.board[col + 1][row + 1] === this.getCurrentPlayer().color &&
                    this.board[col + 2][row + 2] === this.getCurrentPlayer().color &&
                    this.board[col + 3][row + 3] === this.getCurrentPlayer().color
                ) {
                    this.moves.push(['Win',col,row,this.getCurrentPlayer.color])
                    this.moves.push(['Win',col+1,row+1,this.getCurrentPlayer.color])
                    this.moves.push(['Win',col+2,row+2,this.getCurrentPlayer.color])
                    this.moves.push(['Win',col+3,row+3,this.getCurrentPlayer.color])
                    return true;
                }
            }
        }

        // Right to left diagonal
        for (let col = 3; col < this.board.length; col++) {
            for (let row = 0; row < this.board[0].length - 3; row++) {
                if (
                    this.board[col][row] === this.getCurrentPlayer().color &&
                    this.board[col - 1][row + 1] === this.getCurrentPlayer().color &&
                    this.board[col - 2][row + 2] === this.getCurrentPlayer().color &&
                    this.board[col - 3][row + 3] === this.getCurrentPlayer().color
                ) {
                    this.moves.push(['Win',col,row,this.getCurrentPlayer.color])
                    this.moves.push(['Win',col-1,row+1,this.getCurrentPlayer.color])
                    this.moves.push(['Win',col-2,row+2,this.getCurrentPlayer.color])
                    this.moves.push(['Win',col-3,row+3,this.getCurrentPlayer.color])
                    return true;
                }
            }
        }
        return false;
    }

    isBoardFull() {
        for (let col = 0; col < this.board.length; col++) {
            var winningMoves
            for (let row = 0; row < this.board[col].length; row++) {
                if (this.board[col][row] === 0) {
                    return false;
                }
            }
        }
        this.moves.push(['Full',-1,-1,this.getCurrentPlayer])
        return true;
    }

}
export default GameLogic;
