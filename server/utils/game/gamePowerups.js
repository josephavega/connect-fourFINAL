class Powerups{
    constructor(player){
        this.player = player
        this.game = player.gl
        this.lightning = true
        this.anvil = true
        this.brick = true
    }
    
    checked = Array(7).fill(0)//Has x been looked at
    done = [0,0]//Left/Right end
    Lightning(x,y){
        if(this.checked[x]==1) return
        this.game.board[x][y] = this.game.board[x][y] === 'R' ? 'Y' : 'R'
        this.checked[x] = 1
        let l = x-1
        let r = x+1
        //Check if left/right is empty then move to next slot and add to checked
        while(r < 7 && this.game.board[r][y] == 0){
            this.checked[r] = 1;
            r++;
        }
        while(l >= 0 && this.game.board[l][y] == 0){
            this.checked[l] = 1;
            l--;
        }
        //Lightning on next chip within bounds and not brick
        if(r<7 && this.game.board[r][y] != 'B'){ this.Lightning(r,y)}
        else{
            this.done[1]=1
            this.LightningDone()
        }
        if(l>=0 && this.game.board[l][y] != 'B'){ this.Lightning(l,y)}
        else{
        this.done[0]=1
        this.LightningDone()
        }
    }

    LightningDone() {
        var currentPlayer = this.player[this.game.currentPlayerIndex];
        
        if (this.done[0] == 1 && this.done[1] == 1) {
            this.lightning = true
            if (this.checkWin()) {
                alert(`Player ${currentPlayer.color} wins!`);
                return;
            }
            this.game.switchPlayer();
            
            if (this.checkWin()) {
                alert(`Player ${this.getCurrentPlayer().color} wins!`);
                return;
            }
        }
    }
    

    
        
        Anvil(columnIndex){
            anvil = true
            for(let y = 6; y > 0; y--){//Destroy column till end or brick
                if(this.game.board[columnIndex][y] != 0){
                    if(this.game.board[columnIndex][y] == 'B') return
                    this.game.board[columnIndex][y] = 0
                }
            }
            this.game.switchPlayer();
        }

        
        Brick(columnIndex){
            brick = true
            for(let y = 0; y < 5; y++){//Like a normal chip
                if(this.game.board[columnIndex][y] == 0){
                    this.game.board[columnIndex][y] = 'B'
                    this.game.switchPlayer();
                    return
                }
            }
        }
    }
    export default Powerups;

