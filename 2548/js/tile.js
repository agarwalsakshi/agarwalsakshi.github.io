this.t1=0;
this.t2=1;
var num;

function Sum(t1,t2) {
num =t1+t2;
t2= num;
t1= t1
}

function Tile(position, value, t1,t2) {
  this.x                = position.x;
  this.y                = position.y;
  this.value            = value || this.t1+this.t2;

  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
}

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};

Tile.prototype.serialize = function () {
  return {
    position: {
      x: this.x,
      y: this.y
    },
    value: this.value
  };
};
