'use strict';
  var Head = require('../prefabs/head');
  var Switch = require('../prefabs/switch');
 var WayPoint = require('../prefabs/waypoint');
 var Destination = require('../prefabs/destination');
 var Enemy = require('../prefabs/enemy');
 

  function Play2() {}
  Play2.prototype = {
    preload: function() {
      // Override this method to add some load operations. 
      // If you need to use the loader, you may need to use them here.
    },
    create: function() {
    this.targetFears = 3;
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
       var style = { font: '24px Arial', fill: '#ffffff', align: 'center'};
      this.titleText = this.game.add.text(0, 0, 'Fears to kill: ' + this.targetFears, style);
     // this.titleText.anchor.setTo(0.5, 0.5);


      this.enemies = [
          new Enemy(this.game),
          new Enemy(this.game),
          new Enemy(this.game)
        ];


      this.head = new Head(this.game, this.game.width / 2, 16);
      this.head.angle = 90;
      this.destination = new Destination(this.game, this.game.width /2, this.game.height - 16);
      this.destination.angle = -90;
      var switch1 = new Switch(this.game, this.game.width/4, this.game.height/4);
      var switch2 = new Switch(this.game, (this.game.width/4)*3, (this.game.height/4));

      var switch3 = new Switch(this.game, (this.game.width/4)*2, this.game.height/2);

      var switch4 = new Switch(this.game, (this.game.width/4), (this.game.height/4)*3);
      var switch5 = new Switch(this.game, (this.game.width/4) *3, (this.game.height/4)*3);

      var wp1 = new WayPoint(this.game, 
          (this.game.width/8 * 3), (this.game.height/2));
      wp1.wireTo(switch4);

   /*   var wp2 = new WayPoint(this.game,
          (this.game.width/4 * 3), (this.game.height/4) * 3);
      wp2.wireTo(this.destination);
*/

    /*  this.switch.wireTo('A', switch3, 0);
      this.switch.wireTo('B', wp2, [this.enemies[1]]);
    */
      switch1.wireTo('A', switch3, 0);
      switch1.wireTo('B', switch4, 0);
      switch3.wireTo('A', switch2, 0);
      switch3.wireTo('B', switch5,0 );
      switch2.wireTo('A', this.destination,0);
      switch2.wireTo('B', wp1,0);
      switch4.wireTo('A', this.destination, [this.enemies[1]]);
      switch4.wireTo('B', switch3,0);
      switch5.wireTo('A', this.destination,0 );
      switch5.wireTo('B', switch2, [this.enemies[2]])
      this.head.wireToSwitch(switch1, [this.enemies[0]]);

      this.game.add.existing(this.head);
      this.game.add.existing(switch1);
      this.game.add.existing(switch2);
      this.game.add.existing(switch3);
      this.game.add.existing(switch4);
      this.game.add.existing(switch5);
      this.game.add.existing(this.destination);
    },
    update: function() {
         var x = this.targetFears;
        this.enemies.forEach(function(enemy) {
            if (!enemy.exists) { x-=1;}
             this.titleText.setText("Fears to kill: " + x + " (hint: switch while pulsating)");
         }, this);

         if (this.destination.landed) {
           this.game.state.start('play2');
        }
    },
    paused: function() {
      // This method will be called when game paused.
    },
    render: function() {
      // Put render operations here.
    },
    shutdown: function() {
      // This method will be called when the state is shut down 
      // (i.e. you switch to another state from this one).
    }
  };
module.exports = Play2;
