'use strict';

var Enemy = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, 0, 0, 'flower', frame);
  this.anchor.setTo(0.5,0.5);
  this.bringToTop();
  // initialize your prefab here
  
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Enemy.prototype.hit = function() {
	this.destroy();
}

module.exports = Enemy;
