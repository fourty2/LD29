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
       this.background = this.game.add.sprite(0,0,'background');
             this.background.scale.x = 2;
      this.background.scale.y = 2;
    this.targetFears = 3;
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
       var style = { font: '20px Arial', fill: '#ffffff', align: 'center'};
      this.titleText = this.game.add.text(0, 0, 'Level 2 - Fears to kill: ' + this.targetFears, style);
     // this.titleText.anchor.setTo(0.5, 0.5);


      this.enemies = [
          new Enemy(this.game),
          new Enemy(this.game),
          new Enemy(this.game)
        ];


      this.head = new Head(this.game);
      
      this.head.x = this.game.width / 2;
      this.head.y = 16;
    
      this.destination = new Destination(this.game);
      
      this.destination.x = this.game.width /2;
      this.destination.y = this.game.height - 16;

      var switch1 = new Switch(this.game);
      switch1.x= this.game.width/6;
      switch1.y = this.game.height/4;

      var switch2 = new Switch(this.game);
      switch2.x = (this.game.width/6)*5;
      switch2.y = (this.game.height/4);

      var switch3 = new Switch(this.game);
      switch3.x = (this.game.width/4)*2;
      switch3.y = this.game.height/2;
  
      var switch4 = new Switch(this.game);
      switch4.x = (this.game.width/4);
      switch4.y = (this.game.height/4)*3;

      var switch5 = new Switch(this.game);
      switch5.x = (this.game.width/4) *3;
      switch5.y = (this.game.height/4)*3;

      var wp1 = new WayPoint(this.game, 
          (this.game.width/5)*2, (this.game.height/5));
    //  wp1.wireTo(switch4);

      var wp2 = new WayPoint(this.game,
          (this.game.width/4 )*3, (this.game.height/2));
    /*  wp2.wireTo(this.destination);
*/

    /*  this.switch.wireTo('A', switch3, 0);
      this.switch.wireTo('B', wp2, [this.enemies[1]]);
    */
      switch1.wireTo('A', switch3, 0);
      switch1.wireTo('B', switch4, 0);
      switch3.wireTo('A', switch2, 0);
      switch3.wireTo('B', switch5,0 );
      switch2.wireTo('A', this.destination,0, wp2);
      switch2.wireTo('B', switch4,0, wp1);
      switch4.wireTo('A', this.destination, [this.enemies[1]]);
      switch4.wireTo('B', switch3,0);
      switch5.wireTo('A', this.destination,0 );
      switch5.wireTo('B', switch2, [this.enemies[2]])
      this.head.wireToSwitch(switch1, [this.enemies[0]]);


    this.backButton = this.game.add.button(this.game.width - 80, 25, 'selback', this.goBack, this);
    this.backButton.anchor.setTo(0.5,0.5);

 /*     this.game.add.existing(this.head);
      this.game.add.existing(switch1);
      this.game.add.existing(switch2);
      this.game.add.existing(switch3);
      this.game.add.existing(switch4);
      this.game.add.existing(switch5);
      this.game.add.existing(this.destination);*/
    },
    update: function() {
         var x = this.targetFears;
        this.enemies.forEach(function(enemy) {
            if (!enemy.exists) { x-=1;}
             this.titleText.setText("Level 2 - Fears to kill: " + x + " ");
         }, this);

        if (this.destination.landed && x == 0) {
           this.game.state.start('play3');
        } else if (this.destination.landed) {
           this.game.state.start('play2');
        }
           
    },
    goBack: function() {
      this.game.state.states.menu.music.stop();
      this.game.state.start('menu');

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
