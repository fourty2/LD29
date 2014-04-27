'use strict';

var Segment = require('../prefabs/segment');
var Missile = require('../prefabs/missile');

var Wire = function(game, parent, sourceX, sourceY, destObj, enemies, waypoint) {
    Phaser.Group.call(this, game, parent);
    this.enemies = enemies;
    this.waypoint = waypoint;
    this.MAX_MISSILES = 1;
    this.create(sourceX, sourceY, destObj);
    this.shoot = false;
    this.fullWire = false;
    this.isRunning = false;
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


	  while (this.iDistance > 5 && i < 120) {
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

	  // missiles

	      // Create a group to hold the missile
    this.missileGroup = this.game.add.group();

    // Create a group for explosions
    this.explosionGroup = this.game.add.group();
	this.audio = this.game.add.audio('wireSound');
	this.explosionSound = this.game.add.audio('explosionSound');


};
Wire.prototype.spawnEnemies = function() {
	if (this.enemies) {
		for (var countEnemies = 0; countEnemies< this.enemies.length; countEnemies++) {
	  	var sgmt = this.game.rnd.integerInRange(10, this.segments.length-10);

	  	this.enemies[countEnemies].x = this.segments[sgmt].x;
	  	this.enemies[countEnemies].y = this.segments[sgmt].y;
	  	this.segments[sgmt].hasEnemy = this.enemies[countEnemies];
	  	this.add(this.enemies[countEnemies]);

	  }
	}
}


Wire.prototype.fire = function() {
	this.shoot = true;
	this.isRunning = true;
	this.audio.play('',0,1,true);
	this.segments[0].fire();
}

Wire.prototype.setCurrentSegment = function(segment) {
	this.currentSegment = segment;
	if (this.enemies && this.enemies[0].alive && this.shoot == true) {
	    if (this.missileGroup.countLiving() < this.MAX_MISSILES) {
        // Set the launch point to a random location below the bottom edge
        // of the stage
        var x = this.currentSegment.x;
        var y = this.currentSegment.y;

        this.launchMissile(this.game.rnd.integerInRange(x-20, x+20),
          this.game.rnd.integerInRange(y-20, y+20), this.enemies[0]);
  	  }
  	 }
}

Wire.prototype.setActive = function() {
	if (!this.shoot) {
		for (var i=0; i<this.segments.length; i++) {
		this.segments[i].animations.play('clean', 1, true);
	}
	}
}

Wire.prototype.setInactive = function() {
	for (var i=0; i<this.segments.length; i++) {
		this.segments[i].animations.play('inactive', 1, true);
	}
}

Wire.prototype.handleFullWire = function(scope) {
	scope.fullWire = true;
	scope.shoot = false;
	scope.isRunning = false;
	scope.audio.pause();
	scope.destObj.wireLanded();
}

Wire.prototype.launchMissile = function(x, y, destination) {
	console.log("launchMissile");
    // // Get the first dead missile from the missileGroup
    var missile = this.missileGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (missile === null) {
        missile = new Missile(this.game);
         
        this.missileGroup.add(missile);
    }
	missile.setDestination(destination);
    // Revive the missile (set it's alive property to true)
    // You can also define a onRevived event handler in your explosion objects
    // to do stuff when they are revived.
    missile.revive();

    // Move the missile to the given coordinates
    missile.x = x;
    missile.y = y;

    return missile;
};

Wire.prototype.getExplosion = function(x, y) {
    // Get the first dead explosion from the explosionGroup
    var explosion = this.explosionGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (explosion === null) {
        explosion = this.game.add.sprite(0, 0, 'explosion');
         explosion.bringToTop();
        explosion.scale.x = 4;
        explosion.scale.y = 4;
        explosion.anchor.setTo(0.5, 0.5);

        // Add an animation for the explosion that kills the sprite when the
        // animation is complete
        var animation = explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10], 30, false);
        animation.killOnComplete = true;

        // Add the explosion sprite to the group
        this.explosionGroup.add(explosion);
    }

    // Revive the explosion (set it's alive property to true)
    // You can also define a onRevived event handler in your explosion objects
    // to do stuff when they are revived.
    explosion.revive();

    // Move the explosion to the given coordinates
    explosion.x = x;
    explosion.y = y;

    // Set rotation of the explosion at random for a little variety
    explosion.angle = this.game.rnd.integerInRange(0, 360);

    // Play the animation
    this.explosionSound.play();
    explosion.animations.play('boom');

    // Return the explosion itself in case we want to do anything else with it
    return explosion;
};

Wire.prototype.update = function() {
  
	if (this.enemies && this.enemies[0].alive && this.shoot == true) {

  	   this.missileGroup.forEachAlive(function(m) {
	        var distance = this.game.math.distance(m.x, m.y,
	            this.enemies[0].x, this.enemies[0].y);	//should iterate through all enemies
	        if (distance < 10) {
	            m.kill();
	            this.getExplosion(m.x, m.y);
	        }
  		  }, this);

	} else {
		 this.missileGroup.forEachAlive(function(m) {
	            m.kill();
	            this.getExplosion(m.x, m.y);
	       
  		  }, this);
	}

  // write your prefab's specific update code here
  
};

module.exports = Wire;
