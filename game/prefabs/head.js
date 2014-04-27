'use strict';
var Wire = require('../prefabs/wire');

var Head = function(game, parent) {
	Phaser.Group.call(this, game, parent);


	this.synapse = this.game.add.sprite(0,0,'mastersynapse');
	this.synapse.anchor.setTo(0.5,0.5);
	this.add(this.synapse);

	this.identifier = this.game.add.sprite(-4,-4,'synapseidentifiers', 1);
	this.identifier.anchor.setTo(0.5,0.5);
	this.add(this.identifier);

/*  Phaser.Sprite.call(this, game, x, y, 'mastersynapse', frame);
  this.anchor.setTo(0.5,0.5);

  this.game.add.sprite(this.x,this.y,'synapseidentifiers',1);
*/
  // initialize your prefab here
   this.synapse.inputEnabled = true;
   this.synapse.events.onInputDown.add(this.clickListener, this);
   	this.synapse.events.onInputOver.add(this.tweenOver, this);
  
};

Head.prototype = Object.create(Phaser.Group.prototype);
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

Head.prototype.tweenOver = function() {
	var tw = this.game.add.tween(this.synapse.scale).to({x:1.5, y:1.5}, 150, Phaser.Easing.Circular.In, true,0,	1,true);

}

module.exports = Head;
