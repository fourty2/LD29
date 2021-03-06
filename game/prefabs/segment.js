'use strict';

var Segment = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'segment', frame);
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity  = false;
  this.body.immovable = true;


  this.animations.add('fire', [0]);
  var trailAnim = this.animations.add('firetrail', [1]);
  this.animations.add('full', [2]);

  this.animations.add('inactive', [3]);
  trailAnim.onComplete.add(this.fireNextSegment, this);
  this.animations.add('clean', [0]);

};

Segment.prototype = Object.create(Phaser.Sprite.prototype);
Segment.prototype.constructor = Segment;
Segment.prototype.setNextSegment = function(segment) {
	this.nextSegment = segment;
}
Segment.prototype.fire = function() {
  if (this.hasEnemy) {
    this.hasEnemy.hit();
    this.hasEnemy = false;
  }
  this.parent.setCurrentSegment(this);
	this.animations.play('firetrail', 20, false);
}

Segment.prototype.fireNextSegment = function() {


	this.animations.play('full', 1, true);
	if (this.nextSegment) {
		this.nextSegment.fire();
	} else if (this.fullCallback) {
		this.fullCallback(this.callbackScope);
	}
}

Segment.prototype.setFullCallback = function(callback, scope) {
	this.fullCallback = callback;
	this.callbackScope = scope;
}



Segment.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Segment;
