'use strict';

var Missile = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'missile', frame);
  this.bringToTop();
  this.anchor.setTo(0.5,0.5);
 // this.scale.x = 2;
 // this.scale.y = 2;

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.SPEED = 350; // missile speed pixels/second
    this.TURN_RATE = 5; // turn rate in degrees/frame
    this.WOBBLE_LIMIT = 15; // degrees
    this.WOBBLE_SPEED = 250; // milliseconds
    this.SMOKE_LIFETIME = 500; // milliseconds
    this.AVOID_DISTANCE = 30; // pixels

	this.wobble = this.WOBBLE_LIMIT;
    this.game.add.tween(this)
        .to(
            { wobble: -this.WOBBLE_LIMIT },
            this.WOBBLE_SPEED, Phaser.Easing.Sinusoidal.InOut, true, 0,
            Number.POSITIVE_INFINITY, true
	        );

	 this.smokeEmitter = this.game.add.emitter(0, 0, 100);

	    // Set motion parameters for the emitted particles
	    this.smokeEmitter.gravity = 0;
	    this.smokeEmitter.setXSpeed(0, 0);
	    this.smokeEmitter.setYSpeed(-80, -50); // make smoke drift upwards

	    this.smokeEmitter.makeParticles('smoke');

	    // Start emitting smoke particles one at a time (explode=false) with a
	    // lifespan of this.SMOKE_LIFETIME at 50ms intervals
	    this.smokeEmitter.start(false, this.SMOKE_LIFETIME, 50);

	    // Create a point object to hold the position of the smoke emitter relative
	    // to the center of the missile. See update() below.
	    this.smokePosition = new Phaser.Point(this.width/2, 0);
};

Missile.prototype = Object.create(Phaser.Sprite.prototype);
Missile.prototype.constructor = Missile;
Missile.prototype.setDestination = function(enemy) {
	this.destination = enemy;
}


Missile.prototype.update = function() {
	//console.log("hui");
  if (!this.alive || !this.destination) {
        this.smokeEmitter.on = false;
        return;
    } else {
        this.smokeEmitter.on = true;
    }
 var p = this.smokePosition.rotate(0, 0, this.rotation);

    // Position the smoke emitter at the new coordinates relative to the center
    // of the missile
    this.smokeEmitter.x = this.x - p.x;
    this.smokeEmitter.y = this.y - p.y;

    // Calculate the angle from the missile to the mouse cursor game.input.x
    // and game.input.y are the mouse position; substitute with whatever
    // target coordinates you need.
   // console.log(this.game.input.activePointer.x);
    var targetAngle = this.game.math.angleBetween(
        this.x, this.y,
        this.destination.x, this.destination.y
    );

    // Add our "wobble" factor to the targetAngle to make the missile wobble
    // Remember that this.wobble is tweening (above)
    targetAngle += this.game.math.degToRad(this.wobble);

 // Gradually (this.TURN_RATE) aim the missile towards the target angle
    if (this.rotation !== targetAngle) {
        // Calculate difference between the current angle and targetAngle
        var delta = targetAngle - this.rotation;

        // Keep it in range from -180 to 180 to make the most efficient turns.
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        if (delta > 0) {
            // Turn clockwise
            this.angle += this.TURN_RATE;
        } else {
            // Turn counter-clockwise
            this.angle -= this.TURN_RATE;
        }

        // Just set angle to target angle if they are close
        if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
            this.rotation = targetAngle;
        }
    }

    // Calculate velocity vector based on this.rotation and this.SPEED
    this.body.velocity.x = Math.sin(this.rotation) * this.SPEED;
    this.body.velocity.y = Math.cos(this.rotation) * this.SPEED;

};

module.exports = Missile;
