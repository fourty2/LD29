'use strict';
var Wire = require('../prefabs/wire');
var Switch = function(game, parent) {
	Phaser.Group.call(this, game, parent);



	this.synapse = this.game.add.sprite(0,0,'switchsynapse');
	this.synapse.anchor.setTo(0.5,0.5);
	this.add(this.synapse);

	this.synapse.inputEnabled = true;
	this.state = 'A';
	this.stateWires = Array();
	this.synapse.events.onInputDown.add(this.toggleSwitch, this);
	this.synapse.events.onInputOver.add(this.tweenOver, this);

	this.identifier = this.game.add.sprite(2,2,'synapseidentifiers', 0);
	this.identifier.anchor.setTo(0.5,0.5);
	this.add(this.identifier);
/*

	this.indicator = this.game.add.sprite(0,0, 'switchindicator');
	this.indicator.anchor.setTo(0.5,0.5);
*/
};

Switch.prototype = Object.create(Phaser.Group.prototype);
Switch.prototype.constructor = Switch;

Switch.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};
Switch.prototype.wireTo = function(state, obj, enemies, waypoint) {
	this.stateWires[state] = new Wire(this.game, null, this.x, this.y,
                    obj, enemies, waypoint);
	if (state == 'A') {
	/*	var segment = this.stateWires[state].segments[0];
		
		var rad = segment.angle * (Math.PI / 180);
	  	this.indicator.x = Math.round(this.x + Math.cos(rad) * 32);
	  	this.indicator.y = Math.round(this.y + Math.sin(rad) * 32);*/
	  	this.stateWires[state].setActive();
		//this.indicator.x+=30;
	} else {
		this.stateWires[state].setInactive();
	}
	this.game.add.existing(this.stateWires[state]);
};

Switch.prototype.wireLanded = function() {
	this.stateWires[this.state].fire();
}

Switch.prototype.toggleSwitch = function() {

	this.stateWires[this.state].setInactive();
	this.state = this.state == 'A'?'B':'A';
	var segment = this.stateWires[this.state].segments[0];
	this.stateWires[this.state].setActive();


/*	var rad = segment.angle * (Math.PI / 180);
	
	 var nextX  = Math.round(this.x + Math.cos(rad) * 32);
	 var nextY = Math.round(this.y + Math.sin(rad) * 32);
	this.game.add.tween(this.indicator).to({x: nextX, y:nextY}, 500, Phaser.Easing.Circular.Out, true);
*/

//    this.animations.play(this.state, 1, true);
}
Switch.prototype.tweenOver = function() {
	var tw = this.game.add.tween(this.synapse.scale).to({x:1.5, y:1.5}, 150, Phaser.Easing.Circular.In, true,0,	1,true);

}

Switch.prototype.setInputSegment = function(segment) {
	
/*	this.inputindicator = this.game.add.sprite(0,0,'switchinput');
	this.inputindicator.anchor.setTo(0.5,0.5);
	var rad = segment.angle * (Math.PI / 180);
	  	this.inputindicator.x = Math.round(this.x - Math.cos(rad) * 32);
	  	this.inputindicator.y = Math.round(this.y - Math.sin(rad) * 32);
	  	console.log(this.inputindicator.z);
	  	this.inputindicator.z = -1;
	  	console.log(this.z);
	  this.inputindicator.bringToTop();*/
}

module.exports = Switch;
