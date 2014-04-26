
  'use strict';
  function Play() {}
  Play.prototype = {
    wires: Array(),
    firedSegment: 0,
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);


      this.wire = this.game.add.sprite(0, this.game.height/2, 'wire');
      //this.game.physics.arcade.enable(this.wire);

      var lastX, lastY, lastAngle;
      lastX = 0;
      lastY = this.game.height/2;
      lastAngle = 0;
      for (var i=0; i<=20; i++) {
          var rad = lastAngle * (Math.PI / 180);
          var startY = Math.round(lastY + Math.sin(rad) * 32);
          var startX = Math.round(lastX + Math.cos(rad) * 32);

          console.log("lastX:" + lastX + " lastY: " + lastY + "lastAngle: " + lastAngle + " radiant: " + rad);
          var wire = this.game.add.sprite(startX, startY, 'wire');
          wire.animations.add('clean', [0]);
          wire.animations.add('fire', [1,2,3,4,5]);
          var trailAnim = wire.animations.add('firetrail', [1,7,8,9,10]);
          wire.animations.add('full', [6]);
          wire.anchor.setTo(0,0.5); //(x:0, y: center)
          wire.angle = this.game.rnd.integerInRange(-20,20);
          console.log("startX:" + startX + " startY: " + startY + "newAngle: " + wire.angle + " radiant: " + rad);

          lastAngle = wire.angle;
          lastX = Math.round(startX);
          lastY = Math.round(startY);

          trailAnim.onComplete.add(this.wireSegmentFull, this);
          wire.play('clean', 1, true);
          this.wires.push(wire);
      }

      this.wires[this.firedSegment].animations.play('firetrail', 60, false);


      /*this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      this.sprite.inputEnabled = true;
      
      this.game.physics.arcade.enable(this.sprite);
      this.sprite.body.collideWorldBounds = true;
      this.sprite.body.bounce.setTo(1,1);
      this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      this.sprite.events.onInputDown.add(this.clickListener, this);
      */
    },
    wireSegmentFull: function(sprite, animation) {
      sprite.animations.play('full', 1, true);
      if (this.firedSegment<20) {
        this.firedSegment++;
         this.wires[this.firedSegment].animations.play('firetrail', 60, false);
      }
    },

    update: function() {

    },
    render: function() {
     this.game.debug.spriteInfo(this.wires[1], 32, 32);
    //  this.game.debug.text('deltaZ: ' + this.wires[17].body.deltaZ(), 32, 296);


    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;