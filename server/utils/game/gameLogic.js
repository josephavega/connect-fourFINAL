import AI from './AI.js'

class GameLogic {
    constructor() {
        this.board = this.createBoard();
        this.player = [new Player('R', 1), new Player('Y', 2)];
        this.currentPlayerIndex = 0;
        this.ai = [new AI(1), new AI(1)]; // AI difficulty Medium
        this.isAIvsAI = true;
        this.gameOver = false;
        this.isPlayerVsAI = false; 
        this.currentPlayerIndex = 0;
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
        if (move !== null) {
            this.placePiece(move);
            this.printBoard();
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



    //Powerups
    checked = Array(7).fill(0)//Has x been looked at
    done = [0,0]//Left/Right end
    Lightning(x,y){
        if(this.checked[x]==1) return
        this.board[x][y] = this.board[x][y] === 'R' ? 'Y' : 'R'
        this.checked[x] = 1
        let l = x-1
        let r = x+1
        //Check if left/right is empty then move to next slot and add to checked
        while(r < 7 && this.board[r][y] == 0){
            this.checked[r] = 1;
            r++;
        }
        while(l >= 0 && this.board[l][y] == 0){
            this.checked[l] = 1;
            l--;
        }
        //Lightning on next chip within bounds and not brick
        if(r<7 && this.board[r][y] != 'B'){ this.Lightning(r,y)}
        else{
            this.done[1]=1
            this.LightningDone()
        }
        if(l>=0 && this.board[l][y] != 'B'){ this.Lightning(l,y)}
        else{
        this.done[0]=1
        this.LightningDone()
        }
    }

    LightningDone() {
        const currentPlayer = this.player[this.currentPlayerIndex];
        
        if (this.done[0] == 1 && this.done[1] == 1) {
            currentPlayer.powerups[1] = false; 
            if (this.checkWin()) {
                alert(`Player ${currentPlayer.color} wins!`);
                return;
            }
            this.switchPlayer();
            
            if (this.checkWin()) {
                alert(`Player ${this.getCurrentPlayer().color} wins!`);
                return;
            }
        }
    }
    

    Anvil(columnIndex){
        this.getCurrentPlayer().powerups[0] = false
        for(let y = 6; y > 0; y--){//Destroy column till end or brick
            if(this.board[columnIndex][y] != 0){
                if(this.board[columnIndex][y] == 'B') return
                this.board[columnIndex][y] = 0
            }
        }
        this.switchPlayer();
    }

    Brick(columnIndex){
        this.getCurrentPlayer().powerups[2] = false
        for(let y = 0; y < 5; y++){//Like a normal chip
            if(this.board[columnIndex][y] == 0){
                this.board[columnIndex][y] = 'B'
                this.switchPlayer();
                return
            }
        }
    }

    randomizeBoard(){
        
        for(let x = 0; x < 7; x++){
            for(let y = 0; y < 6; y++){
                this.board[x][y] = Math.random() > .5 ? 'R' : 'Y'
            }
        }
        this.board[3][3] = 'B'
    }

}

class Player {
    constructor(color, gameType) {
        this.color = color;
        this.powerups = [false, false, false]; // Initialize the array
        if (gameType > 0) {
            this.powerups[0] = true; // Anvil
            this.powerups[1] = true; // Lightning
            this.powerups[2] = true; // Brick
        }
    }
}


export default GameLogic;
