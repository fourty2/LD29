
  'use strict';
  var Head = require('../prefabs/head');
  var Switch = require('../prefabs/switch');
 var WayPoint = require('../prefabs/waypoint');
 var Destination = require('../prefabs/destination');
 var Enemy = require('../prefabs/enemy');
 var Missile = require('../prefabs/missile');
 
  
  function Play() {}
  Play.prototype = {

    create: function() {
      this.targetFears = 2;

      this.background = this.game.add.sprite(0,0,'background');
      this.background.scale.x = 2;
      this.background.scale.y = 2;
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
       var style = { font: '12px Arial', fill: '#333333', align: 'center'};
      this.titleText = this.game.add.text(0, 0, 'Fears to kill: ' + this.targetFears, style);
     // this.titleText.anchor.setTo(0.5, 0.5);


      this.enemies = [
          new Enemy(this.game),
          new Enemy(this.game)
        ];


      this.head = new Head(this.game);
      this.head.x = 16;
      this.head.y = this.game.height/2;

      this.switch = new Switch(this.game);
      this.switch.x = this.game.width/2;
      this.switch.y = this.game.height/2;
      this.destination = new Destination(this.game);
      this.destination.x = this.game.width - 16;
      this.destination.y = this.game.height/2;


      var wp1 = new WayPoint(this.game, 
          (this.game.width/4 * 3), (this.game.height/4) * 1);
     // wp1.wireTo(this.destination);

      var wp2 = new WayPoint(this.game,
          (this.game.width/4 * 3), (this.game.height/4) * 3);
      //wp2.wireTo(this.destination);


      this.switch.wireTo('A', this.destination, 0, wp1);

      this.switch.wireTo('B', this.destination, [this.enemies[1]], wp2);

      this.head.wireToSwitch(this.switch, [this.enemies[0]]);
  //    this.game.add.existing(this.head);
    //  this.game.add.existing(this.switch);
     // this.game.add.existing(this.destination);

       
     
    },
    update: function() {
 

        var x = this.targetFears;
        this.enemies.forEach(function(enemy) {
            if (!enemy.exists) { x-=1;}
             this.titleText.setText("Fears to kill: " + x);
         }, this);

        if (this.destination.landed && x == 0) {
           this.game.state.start('play2');
        } else if (this.destination.landed) {
           this.game.state.start('play');
        }
    }
  };
  
  module.exports = Play;