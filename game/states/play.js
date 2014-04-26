
  'use strict';
  var Head = require('../prefabs/head');
  var Switch = require('../prefabs/switch');
 var WayPoint = require('../prefabs/waypoint');
 var Destination = require('../prefabs/destination');
 var Enemy = require('../prefabs/enemy');
 
  
  function Play() {}
  Play.prototype = {
    wires: Array(),
    create: function() {
      this.targetFears = 2;
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
       var style = { font: '24px Arial', fill: '#ffffff', align: 'center'};
      this.titleText = this.game.add.text(0, 0, 'Fears to kill: ' + this.targetFears, style);
     // this.titleText.anchor.setTo(0.5, 0.5);

      this.enemies = [
          new Enemy(this.game),
          new Enemy(this.game)
        ];


      this.head = new Head(this.game, 16, this.game.height/2);
      this.switch = new Switch(this.game, this.game.width/2, this.game.height/2);
      this.destination = new Destination(this.game, this.game.width - 16, this.game.height/2);


      var wp1 = new WayPoint(this.game, 
          (this.game.width/4 * 3), (this.game.height/4) * 1);
      wp1.wireTo(this.destination);

      var wp2 = new WayPoint(this.game,
          (this.game.width/4 * 3), (this.game.height/4) * 3);
      wp2.wireTo(this.destination);


      this.switch.wireTo('A', wp1, 0);

      this.switch.wireTo('B', wp2, [this.enemies[1]]);

      this.head.wireToSwitch(this.switch, [this.enemies[0]]);
      this.game.add.existing(this.head);
      this.game.add.existing(this.switch);
      this.game.add.existing(this.destination);


    },

    update: function() {
        var x = this.targetFears;
        this.enemies.forEach(function(enemy) {
            if (!enemy.exists) { x-=1;}
             this.titleText.setText("Fears to kill: " + x);
         }, this);
    }
  };
  
  module.exports = Play;