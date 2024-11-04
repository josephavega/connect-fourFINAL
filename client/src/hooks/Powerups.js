class Powerups{
    constructor(player){
        this.player = player
        this.lightning = new Powerup_Lightning(this)
        this.anvil = new Powerup_Anvil(this)
        this.brick = new Powerup_Brick(this)
    }

    Lightning(column, row){
        this.lightning.Lightning(column, row)
    }

    Anvil(column){
        this.anvil.Anvil(column)
    }

    Brick(column){
        this.brick.Brick(column)
    }

    Powerup_Lightning = class {
        constructor(powerup){
            this.powerup = powerup
            used = false
        }
    
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
        var currentPlayer = this.player[this.currentPlayerIndex];
        
        if (this.done[0] == 1 && this.done[1] == 1) {
            used = true
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
    }

    Powerup_Anvil = class{
        constructor(powerup){
            this.powerup = powerup
            used = false
        }
        
        Anvil(columnIndex){
            used = true
            for(let y = 6; y > 0; y--){//Destroy column till end or brick
                if(this.board[columnIndex][y] != 0){
                    if(this.board[columnIndex][y] == 'B') return
                    this.board[columnIndex][y] = 0
                }
            }
            this.switchPlayer();
        }
    }

    Powerup_Brick = class{
        constructor(powerup){
            this.powerup = powerup
            used = false
        }
        
        Brick(columnIndex){
            used = true
            for(let y = 0; y < 5; y++){//Like a normal chip
                if(this.board[columnIndex][y] == 0){
                    this.board[columnIndex][y] = 'B'
                    this.switchPlayer();
                    return
                }
            }
        }
    }

}