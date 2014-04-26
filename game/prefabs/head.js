'use strict';
var Wire = require('../prefabs/wire');

var Head = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'start', frame);
  this.anchor.setTo(0.5,0.5);
  // initialize your prefab here
   this.inputEnabled = true;
   this.events.onInputDown.add(this.clickListener, this);
  
};

Head.prototype = Object.create(Phaser.Sprite.prototype);
Head.prototype.constructor = Head;

Head.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Head.prototype.wireToSwitch = function(switchObject, enemies) {
	this.switch = switchObject;
	this.wire = new Wire(this.game, null, this.x, this.y, this.switch, enemies);

	this.game.add.existing(this.wire);
};

Head.prototype.clickListener = function() {
	if (this.wire) {
		this.wire.fire();
	}
};

module.exports = Head;
