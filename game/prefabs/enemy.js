'use strict';

var Enemy = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, 0, 0, 'spider', frame);
  this.scale.x = 2;
  this.scale.y = 2;
  this.anchor.setTo(0.5,0.5);
  this.bringToTop();
  this.alive = true;

	this.animations.add('stand', [0]);
	this.animations.add('walk', [1,2,3,4,5,6]);

	this.animations.play('walk', 10, true);

  // initialize your prefab here
  
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Enemy.prototype.hit = function() {

	this.destroy();
	this.alive = false;
}

module.exports = Enemy;
