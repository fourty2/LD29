'use strict';
 var Head = require('../prefabs/head');
 var Switch = require('../prefabs/switch');
 var WayPoint = require('../prefabs/waypoint');
 var Destination = require('../prefabs/destination');
 var Enemy = require('../prefabs/enemy');

  function Play3() {}
  Play3.prototype = {
    preload: function() {
      // Override this method to add some load operations. 
      // If you need to use the loader, you may need to use them here.
    },
    create: function() {
      // bg
      this.background = this.game.add.sprite(0,0,'background');
      this.background.scale.x = 2;
      this.background.scale.y = 2;

      // text
      this.targetFears = 3;
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      var style = { font: '20px Arial', fill: '#ffffff', align: 'center'};
      this.titleText = this.game.add.text(0, 0, 'Level 3 - Fears to kill: ' + this.targetFears, style);

      // enemies
      this.enemies = [
        new Enemy(this.game),
        new Enemy(this.game),
        new Enemy(this.game)
      ];


      // head
      this.head = new Head(this.game);  
      this.head.x = 60
      this.head.y = 60;
    
      // destination
      this.destination = new Destination(this.game);
      this.destination.x = this.game.width - 60;
      this.destination.y = this.game.height - 60;
      // switches
      // left column
       var switch1 = new Switch(this.game);
      switch1.x= 60;
      switch1.y = 200;

       var switch2 = new Switch(this.game);
      switch2.x= 60;
      switch2.y = 350;

       var switch3 = new Switch(this.game);
      switch3.x= 60;
      switch3.y = 500;

      // diagonal
       var switch4 = new Switch(this.game);
      switch4.x= 300;
      switch4.y = 350;

       var switch5 = new Switch(this.game);
      switch5.x= 450;
      switch5.y = 200;

       var switch6 = new Switch(this.game);
      switch6.x= 600;
      switch6.y = 60;

      // waypoints
       var wp1 = new WayPoint(this.game, 
          600, 400);

      // wiring

      switch1.wireTo('A', switch6, [this.enemies[0]]);
      switch1.wireTo('B', switch4, [this.enemies[1]]);
      switch2.wireTo('A', switch5, 0);
      switch2.wireTo('B', switch3, 0);
      
      switch3.wireTo('A', switch4, [this.enemies[2]]);
      switch3.wireTo('B', this.destination, 0);

      switch6.wireTo('A', switch5, 0);
      switch6.wireTo('B', switch4, 0, wp1);

      switch4.wireTo('A', switch5, 0);
      switch4.wireTo('B', this.destination, 0);

      switch5.wireTo('A', switch1, 0);
      switch5.wireTo('B', switch2, 0);



      this.head.wireToSwitch(switch1, 0);


      this.backButton = this.game.add.button(this.game.width - 80, 25, 'selback', this.goBack, this);
      this.backButton.anchor.setTo(0.5,0.5);
    },
    update: function() {
      // state update code
      var x = this.targetFears;
      this.enemies.forEach(function(enemy) {
          if (!enemy.exists) { x-=1;}
           this.titleText.setText("Level 3 - Fears to kill: " + x + " ");
       }, this);

      if (this.destination.landed && x == 0) {
         this.goBack();
      } else if (this.destination.landed) {
         this.game.state.start('play3');
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
    },
     goBack: function() {
      this.game.state.states.menu.music.stop();
      this.game.state.start('menu');

    }
  };
module.exports = Play3;
