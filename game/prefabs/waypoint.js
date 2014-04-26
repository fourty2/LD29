'use strict';
var Wire = require('../prefabs/wire');
var Waypoint = function(game, x, y) {
  this.game = game;
  Phaser.Point.call(this, x, y);

  // initialize your prefab here
  
};

Waypoint.prototype = Object.create(Phaser.Point.prototype);
Waypoint.prototype.constructor = Waypoint;

Waypoint.prototype.wireTo = function(obj) {
	this.wire = new Wire(this.game, null, this.x, this.y,
                    obj);
	this.game.add.existing(this.wire);
};

Waypoint.prototype.wireLanded = function() {

	if (this.wire) {
		this.wire.fire();
	}
  // write your prefab's specific update code here
  
};
Waypoint.prototype.setInputSegment = function(segment) {
	
}

module.exports = Waypoint;
