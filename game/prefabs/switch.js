'use strict';
var Wire = require('../prefabs/wire');
var Switch = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'switch', frame);
	this.anchor.setTo(0.5,0.5);
	this.inputEnabled = true;
	this.state = 'A';
	this.stateWires = Array();
	this.animations.add('B', [1]);
	this.animations.add('A', [0]);
	this.events.onInputDown.add(this.toggleSwitch, this);

};

Switch.prototype = Object.create(Phaser.Sprite.prototype);
Switch.prototype.constructor = Switch;

Switch.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};
Switch.prototype.wireTo = function(state, obj) {
	this.stateWires[state] = new Wire(this.game, null, this.x, this.y,
                    obj);
	this.game.add.existing(this.stateWires[state]);
};

Switch.prototype.wireLanded = function() {
	this.stateWires[this.state].fire();
}

Switch.prototype.toggleSwitch = function() {
	this.state = this.state == 'A'?'B':'A';
    this.animations.play(this.state, 1, true);
}

module.exports = Switch;
