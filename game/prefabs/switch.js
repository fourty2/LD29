'use strict';
var Wire = require('../prefabs/wire');
var Switch = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'switch', frame);
	this.anchor.setTo(0.5,0.5);
	this.inputEnabled = true;
	this.state = 'A';
	this.stateWires = Array();
	this.animations.add('B', [0]);
	this.animations.add('A', [0]);
	this.events.onInputDown.add(this.toggleSwitch, this);

	this.backgroundsprite = this.game.add.sprite(x,y,'rand');
	this.backgroundsprite.anchor.setTo(0.5,0.5);
	this.backgroundsprite.angle = this.game.rnd.integerInRange(0,180);

	this.indicator = this.game.add.sprite(x,y, 'switchindicator');
	this.indicator.anchor.setTo(0.5,0.5);

};

Switch.prototype = Object.create(Phaser.Sprite.prototype);
Switch.prototype.constructor = Switch;

Switch.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};
Switch.prototype.wireTo = function(state, obj, enemies) {
	this.stateWires[state] = new Wire(this.game, null, this.x, this.y,
                    obj, enemies);
	if (state == 'A') {
		var segment = this.stateWires[state].segments[0];
		
		var rad = segment.angle * (Math.PI / 180);
	  	this.indicator.x = Math.round(this.x + Math.cos(rad) * 32);
	  	this.indicator.y = Math.round(this.y + Math.sin(rad) * 32);
		//this.indicator.x+=30;
	}
	this.game.add.existing(this.stateWires[state]);
};

Switch.prototype.wireLanded = function() {
	this.stateWires[this.state].fire();
}

Switch.prototype.toggleSwitch = function() {
	this.state = this.state == 'A'?'B':'A';
	var segment = this.stateWires[this.state].segments[0];
	
	var rad = segment.angle * (Math.PI / 180);
	
	 var nextX  = Math.round(this.x + Math.cos(rad) * 32);
	 var nextY = Math.round(this.y + Math.sin(rad) * 32);
	this.game.add.tween(this.indicator).to({x: nextX, y:nextY}, 500, Phaser.Easing.Circular.Out, true);


    this.animations.play(this.state, 1, true);
}
Switch.prototype.setInputSegment = function(segment) {
	
	this.inputindicator = this.game.add.sprite(0,0,'switchinput');
	this.inputindicator.anchor.setTo(0.5,0.5);
	var rad = segment.angle * (Math.PI / 180);
	  	this.inputindicator.x = Math.round(this.x - Math.cos(rad) * 32);
	  	this.inputindicator.y = Math.round(this.y - Math.sin(rad) * 32);
	  	console.log(this.inputindicator.z);
	  	this.inputindicator.z = -1;
	  	console.log(this.z);
	  this.inputindicator.bringToTop();
}

module.exports = Switch;
