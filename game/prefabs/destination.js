'use strict';

var Destination = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'start', frame);
 this.anchor.setTo(0.5,0.5);
 this.angle = 180;
  // initialize your prefab here
  
};

Destination.prototype = Object.create(Phaser.Sprite.prototype);
Destination.prototype.constructor = Destination;
Destination.prototype.wireLanded = function() {
this.game.state.start('play');
	console.log("yeah yeah");
}

Destination.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Destination;