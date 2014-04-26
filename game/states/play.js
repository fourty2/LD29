
  'use strict';
  var Head = require('../prefabs/head');
  var Switch = require('../prefabs/switch');
  
  function Play() {}
  Play.prototype = {
    wires: Array(),
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
//      var mywire = new Wire(this.game, null, 0, this.game.height, this.game.width, 0);
//      var mywire2 = new Wire(this.game,null, 0, this.game.height/2, this.game.width, this.game.height/2);
//      this.game.add.existing(mywire);
//      this.game.add.existing(mywire2);



      this.head = new Head(this.game, 16, this.game.height/2);
      this.switch = new Switch(this.game, this.game.width/2, this.game.height/2);

      this.switch.wireTo('A', new Phaser.Point(
          (this.game.width/4 * 3), (this.game.height/4) * 1));

      this.switch.wireTo('B', new Phaser.Point(
          (this.game.width/4 * 3), (this.game.height/4) * 3));



      this.head.wireToSwitch(this.switch);
      this.game.add.existing(this.head);
      this.game.add.existing(this.switch);


//      this.headWire = new Wire(this.game,null, 0, this.game.height/2,
  //                    this.game.width/2, this.game.height/2 );
    //  this.game.add.existing(this.headWire);




      



      this.destination = this.game.add.sprite(this.game.width-16, this.game.height/2, 'start');
      this.destination.anchor.setTo(0.5,0.5);
      this.destination.angle = 180;

    },

    update: function() {

    }
  };
  
  module.exports = Play;