'use strict';

var Segment = require('../prefabs/segment');
var Wire = function(game, parent, sourceX, sourceY, destObj, enemies, waypoint) {
    Phaser.Group.call(this, game, parent);
    this.enemies = enemies;
    this.waypoint = waypoint;
    this.create(sourceX, sourceY, destObj);
    this.spawnEnemies(); 
};

Wire.prototype = Object.create(Phaser.Group.prototype);
Wire.prototype.constructor = Wire;
Wire.prototype.create = function(sourceX, sourceY, destObj) {
		var destX = destObj.x;
		var destY = destObj.y;
		this.destObj = destObj;

	  this.pSource = new Phaser.Point(sourceX, sourceY);
	  this.pDest = new Phaser.Point(destX, destY);
	  this.iDistance = Phaser.Point.distance(this.pSource, this.pDest);
	  this.iAngle = this.game.physics.arcade.angleBetween(this.pSource, this.pDest);
	  this.segments = Array();
	  var pStart = this.pSource;
	  var i =0 ;
	  var lastSegment = null;

	  // very first segment is anchor
		//var segment = this.stateWires[state].segments[0];
		
		//var rad = segment.angle * (Math.PI / 180);
	  	pStart.x = Math.round(pStart.x + Math.cos(this.iAngle) * 16);
	  	pStart.y = Math.round(pStart.y + Math.sin(this.iAngle) * 16);

	  	var anchor = this.game.add.sprite(pStart.x,pStart.y,'wireanchor');
	  	anchor.anchor.setTo(0.5,0.5);

	  	this.add(anchor);

	  	if (this.waypoint) {
	  		this.pWaypoint = new Phaser.Point(this.waypoint.x, this.waypoint.y);
	  	}


	  while (this.iDistance > 5 && i < 100) {
	  		i++;

	  		if (this.pWaypoint && Phaser.Point.distance(pStart, this.pWaypoint) > 50) {
	  			this.iAngle = this.game.physics.arcade.angleBetween(pStart, this.pWaypoint);
	  		} else {
	  			this.pWaypoint = false;
		  		this.iAngle = this.game.physics.arcade.angleBetween(pStart, this.pDest);
	  		}

	  		
	  		var segment = new Segment(this.game, pStart.x, pStart.y);

	  		if (lastSegment) {
		  		lastSegment.setNextSegment(segment);
	  		}
			lastSegment = segment;
			var variance = 0;
			if (this.iDistance > 20) {
				variance = (Math.sin(pStart.x) + Math.cos(pStart.y)) * 21;//this.game.rnd.integerInRange(-20,20)
			}

	  		segment.angle = (this.iAngle * (180/Math.PI)) + variance ;
	  		// nächsten punkt ausrechnen
	  		var rad = segment.angle * (Math.PI / 180);
	  		pStart.x = Math.round(pStart.x + Math.cos(rad) * 7);
	  		pStart.y = Math.round(pStart.y + Math.sin(rad) * 7);
			this.iDistance = Phaser.Point.distance(pStart, this.pDest);

			this.add(segment);
			this.segments.push(segment);
	  }
	  destObj.setInputSegment(segment);
	  segment.setFullCallback(this.handleFullWire, this);

	  


};
Wire.prototype.spawnEnemies = function() {
	if (this.enemies) {
		for (var countEnemies = 0; countEnemies< this.enemies.length; countEnemies++) {
	  	var sgmt = this.game.rnd.integerInRange(5, this.segments.length-1);

	  	this.enemies[countEnemies].x = this.segments[sgmt].x;
	  	this.enemies[countEnemies].y = this.segments[sgmt].y;
	  	this.segments[sgmt].hasEnemy = this.enemies[countEnemies];
	  	this.add(this.enemies[countEnemies]);

	  }
	}
}


Wire.prototype.fire = function() {
	this.segments[0].fire();
}

Wire.prototype.handleFullWire = function(scope) {
	scope.destObj.wireLanded();
}

Wire.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Wire;
