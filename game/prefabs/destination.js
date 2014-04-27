'use strict';

var Destination = function(game, parent) {
	Phaser.Group.call(this, game, parent);

	this.synapse = this.game.add.sprite(0,0,'mastersynapse');
	this.synapse.anchor.setTo(0.5,0.5);
	this.add(this.synapse);

	this.identifier = this.game.add.sprite(-4,-4,'synapseidentifiers', 2);
	this.identifier.anchor.setTo(0.5,0.5);
	this.add(this.identifier);

// this.angle = 180;
 this.landed = false;
  // initialize your prefab here
  
};

Destination.prototype = Object.create(Phaser.Group.prototype);
Destination.prototype.constructor = Destination;
Destination.prototype.wireLanded = function() {

	this.landed = true;

	//this.game.state.start('play');
	//console.log("yeah yeah");
}

Destination.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Destination.prototype.setInputSegment = function(segment) {
	
}

module.exports = Destination;
