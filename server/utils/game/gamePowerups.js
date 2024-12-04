class Powerup_Lightning {
  constructor(powerup, gl) {
    this.powerup = powerup;
    this.gl = gl;
    this.used = false;
    this.checked = Array(7).fill(0); // Has x been looked at
    this.done = [0, 0]; // Left/Right end
  }

  Lightning(y, x, start) {
    if (this.checked[x] === 1) return;
    if (start) {
      this.gl.moves.push(["Lightning", y, x, this.player.powerup.color]);
      for (let row = y - 1; row > 0; row--) {
        if (this.gl.board[row][col] == "B") {
          this.gl.moves.push(["StoppedL", row, x, this.powerup.player.color]);
          return;
        }
      }
      this.gl.board[y][x] = this.gl.board[y][x] === "R" ? "Y" : "R";
      this.gl.moves.push(["Flipped", row, x, this.player.color]);
    } else {
      this.gl.board[y][x] = this.gl.board[y][x] === "R" ? "Y" : "R";
      this.gl.moves.push(["Flipped", row, x, this.player.color]);
    }

    this.checked[x] = 1;
    let l = x - 1;
    let r = x + 1;

    // Check if left/right is empty then move to next slot and add to checked
    while (r < 7 && this.gl.board[y][r] === 0) {
      this.checked[r] = 1;
      r++;
    }
    while (l >= 0 && this.gl.board[y][l] === 0) {
      this.checked[l] = 1;
      l--;
    }

    // Lightning on next chip within bounds and not brick
    if (r < 7 && this.gl.board[y][r] !== "B") {
      this.Lightning(r, y, 0);
    } else {
      this.done[1] = 1;
      if (this.gl.board[y][r] == "B")
        this.gl.moves.push(["StoppedL", row, r, this.powerup.player.color]);
      this.LightningDone();
    }
    if (l >= 0 && this.gl.board[y][l] !== "B") {
      this.Lightning(l, y, 0);
    } else {
      this.done[0] = 1;
      if (this.gl.board[y][l] == "B")
        this.gl.moves.push(["StoppedL", row, l, this.powerup.player.color]);
      this.LightningDone();
    }
  }

  LightningDone() {
    var currentPlayer = this.player.color;
    if (this.done[0] === 1 && this.done[1] === 1) {
      this.used = true;
      if (this.gl.checkWin()) {
        alert(`Player ${currentPlayer.name} wins!`);
        return;
      }
      this.gl.switchPlayer();
      if (this.gl.checkWin()) {
        alert(`Player ${this.getCurrentPlayer().name} wins!`);
        return;
      }
    }
  }
}

class Powerup_Anvil {
  constructor(powerup, gl) {
    this.powerup = powerup;
    this.gl = gl;
    this.used = false;
  }

  Anvil(columnIndex) {
    this.used = true;
    this.gl.moves.push(["Anvil", -1, columnIndex, this.player.color]);
    for (let row = 6; row > 0; row--) {
      // Destroy column till end or brick
      if (this.gl.board[row][columnIndex] !== 0) {
        if (this.gl.board[row][columnIndex] === "B") {
          this.gl.moves.push([
            "StoppedA",
            columnIndex,
            row,
            this.powerup.player.color,
          ]);
          this.switchPlayer();
          return;
        }

        this.gl.board[row][columnIndex] = 0;
        this.gl.moves.push(["Broken", row, columnIndex, 0]);
      }
    }
    this.switchPlayer();
  }
}

class Powerup_Brick {
  constructor(powerup, gl) {
    this.powerup = powerup;
    this.board = this.createBoard();
    this.gl = gl;
    this.used = false;
  }

  Brick(columnIndex) {
    if (this.used) {return;}
    this.used = true;
    for (let row = 0; row < 6; row++) {
      // Like a normal chip
      if (this.gl.board[row][columnIndex] === 0) {
        //this.gl.moves.push(["Brick", row, columnIndex, "B"]);
        this.gl.board[row][columnIndex] = "B";
        break;
      }
    }
    this.gl.switchPlayer();
  }
}

// Main Powerups class that uses the other classes
class Powerups {
  constructor(player, gl) {
    this.player = player;
    this.gl = gl;
    // this.lightning = new Powerup_Lightning(this);
    // this.anvil = new Powerup_Anvil(this);
    this.brick = new Powerup_Brick(this);
  }

  Lightning(column, row) {
    this.lightning.Lightning(column, row);
  }

  Anvil(column) {
    this.anvil.Anvil(column);
  }

  Brick(column) {
    this.brick.Brick(column);
  }
}

// Export all classes as named exports
export default Powerups;
