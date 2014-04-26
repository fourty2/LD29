'use strict';

var Segment = require('../prefabs/segment');
var Wire = function(game, parent, sourceX, sourceY, destX, destY) {
    Phaser.Group.call(this, game, parent);
    this.create(sourceX, sourceY, destX, destY);  
};

Wire.prototype = Object.create(Phaser.Group.prototype);
Wire.prototype.constructor = Wire;
Wire.prototype.create = function(sourceX, sourceY, destX, destY) {

	  this.pSource = new Phaser.Point(sourceX, sourceY);
	  this.pDest = new Phaser.Point(destX, destY);
	  this.iDistance = Phaser.Point.distance(this.pSource, this.pDest);
	  this.iAngle = this.game.physics.arcade.angleBetween(this.pSource, this.pDest);
	  this.segments = Array();
	  var pStart = this.pSource;
	  var i =0 ;
	  var lastSegment = null;
	  while (this.iDistance > 20 && i < 40) {
	  		i++;
	  		this.iAngle = this.game.physics.arcade.angleBetween(pStart, this.pDest);
	  		
	  		var segment = new Segment(this.game, pStart.x, pStart.y);

	  		if (lastSegment) {
		  		lastSegment.setNextSegment(segment);
	  		}
			lastSegment = segment;
	  		segment.angle = (this.iAngle * (180/Math.PI)) + this.game.rnd.integerInRange(-20,20);
	  		// nächsten punkt ausrechnen
	  		var rad = segment.angle * (Math.PI / 180);
	  		pStart.x = Math.round(pStart.x + Math.cos(rad) * 32);
	  		pStart.y = Math.round(pStart.y + Math.sin(rad) * 32);
			this.iDistance = Phaser.Point.distance(pStart, this.pDest);

			this.add(segment);
			this.segments.push(segment);
	  }

};

Wire.prototype.fire = function() {
	this.segments[0].fire();
}

Wire.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Wire;
