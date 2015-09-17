function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;

  this.startTiles     = 144;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}
function create(){

  document.getElementById("end_game").style.visibility = 'hidden';
  window.canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerWidth;
  window.level = 10;
  window.count = 0;

  //create the Array board
  window.board = new Array(level);
  for (var i = 0; i < board.length; i++) {
    board[i] = new Array(level);
  }
   
  for (var i = 0; i < board.length; i++){
    for(var j = 0; j < board[i].length; j++){
        var random = Math.floor(Math.random()*6+1);
        board[i][j] = random;
      }
  }
  
  colorBoard();
}

function colorBoard(){
  //Color the Array board
  for (var i = 0; i < board.length; i++){ 
    for(var j = 0; j < board[i].length; j++){
      paint(board[i][j],i,j);
      }
  }
}

function paint(x,i,j){
  
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  w = (.1 * canvas.width);
  i = i*w;
  j = j*w;

  if (x==1){
    ctx.fillStyle = "#d280f0"
      ctx.fillRect(i,j,w,w);
  }
  if (x==2){
    ctx.fillStyle = "#2daefd"
      ctx.fillRect(i,j,w,w);
  }
  if (x==3){
      ctx.fillStyle = "#4ee3d0"
      ctx.fillRect(i,j,w,w);
  }
  if (x==4){
      ctx.fillStyle = "#ffed5e"
      ctx.fillRect(i,j,w,w);
  }
  if (x==5){
      ctx.fillStyle = "#ffaf42"
      ctx.fillRect(i,j,w,w);
  }
  if (x==6){
      ctx.fillStyle = "#ff3155"
      ctx.fillRect(i,j,w,w);
  }
}

function play(current, last, x, y){

  last = board[x][y];
  board[x][y] = current;

  //Limita colunas pra frente
  if(y < level-1 && y >= 0){
    if(board[x][y+1] == last){
      y++;
      play(current, last, x, y);
      y--;
    }
  }

  //Limita colunas para trás
  if(y < level && y >= 1){
    if(board[x][y-1] == last){
      y--;
      play(current,last,x,y);
      y++;
    }
  }
      
  //Limita linhas pra baixo
  if(x < level-1 && x >=0){
    if(board[x+1][y] == last){
      x++;
      play(current, last, x, y);
      x--;
    }
  }

  //Limita linhas pra cima
  if(x < level && x >= 1){
    if(board[x-1][y] == last){
      x--;
      play(current, last, x, y);
      x++;
    }
  }
}

function counter (){

  if(count < 18){
    colorBoard();
  }
        
  count++;        
  var current = board[0][0];
  var win = 1;

  for (var i = 0; i < board.length; i++){
    for(var j = 0; j < board[i].length; j++){
        if(current != board[i][j]){
          document.getElementById("counter").innerHTML= "Game Over!";
          win = 0;
        } 
      }
  }

  if (win == 1){ 
      document.getElementById("counter").innerHTML= "You Win!";
    document.getElementById("buttons").style.visibility = 'hidden';
      document.getElementById("end_game").style.visibility = 'visible';
      return;
  }
      
  if (count == 18 && win == 0){
      document.getElementById("counter").innerHTML= "Game Over!";
      document.getElementById("buttons").style.visibility = 'hidden';
      document.getElementById("end_game").style.visibility = 'visible';
      return;
  }

  if(count == 17) document.getElementById("counter").innerHTML = (18 - count) + " play left";
  else document.getElementById("counter").innerHTML = (18 - count) + " plays left";
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('b1').addEventListener('click', function() { play(1,0,0,0); counter();});
  document.getElementById('b2').addEventListener('click', function() { play(2,0,0,0); counter();});
  document.getElementById('b3').addEventListener('click', function() { play(3,0,0,0); counter();});
  document.getElementById('b4').addEventListener('click', function() { play(4,0,0,0); counter();});
  document.getElementById('b5').addEventListener('click', function() { play(5,0,0,0); counter();});
  document.getElementById('b6').addEventListener('click', function() { play(6,0,0,0); counter();});
  create();
});


// Restart the game
GameManager.prototype.restart = function () {
  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
};

// Keep playing after winning (allows going over 2048)
//here i need to put move count...
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};

// Return true if the game is lost, or has won and the user hasn't kept playing
 GameManager.prototype.isGameTerminated = function () {
  return this.over || (this.won && !this.keepPlaying);
};

// Set up the game
GameManager.prototype.setup = function () {
  var previousState = this.storageManager.getGameState();

  // Reload the game from a previous game if present
  if (previousState) {
    this.grid        = new Grid(previousState.grid.size,
                                previousState.grid.cells); // Reload grid
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
  } else {
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

    // Add the initial tiles
    this.addStartTiles();
  }

  // Update the actuator
  this.actuate();
};


ameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomColor();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomColor = function () {
    tr = Math.floor(Math.random() * (256));
 g = Math.floor(Math.random() * (256));
 b = Math.floor(Math.random() * (256));
 jQuery('body').css('background-color','rgb('+r+','+g+','+b+')');

/*this.grid.insertTile(tile);*/
};
 
    
jQuery(document).ready(function(){
 randomColor();
});

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    terminated: this.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};




// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;

  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      /*if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        /*if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }*/
    });
  });

  if (moved) {
    this.addRandomColor();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
