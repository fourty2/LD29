'use strict';

var Segment = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'wire', frame);
  this.anchor.setTo(0, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity  = false;
  this.body.immovable = true;


  this.animations.add('fire', [1,2,3,4,5]);
  var trailAnim = this.animations.add('firetrail', [1,7,8,9,10]);
  this.animations.add('full', [6]);
  trailAnim.onComplete.add(this.fireNextSegment, this);
  this.animations.add('clean', [0]);

};

Segment.prototype = Object.create(Phaser.Sprite.prototype);
Segment.prototype.constructor = Segment;
Segment.prototype.setNextSegment = function(segment) {
	this.nextSegment = segment;
}
Segment.prototype.fire = function() {
	this.animations.play('firetrail', 30, false);
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
