
  'use strict';
  var Head = require('../prefabs/head');
  var Switch = require('../prefabs/switch');
 var WayPoint = require('../prefabs/waypoint');
 var Destination = require('../prefabs/destination');
  
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
      this.destination = new Destination(this.game, this.game.width - 16, this.game.height/2);


      var wp1 = new WayPoint(this.game, 
          (this.game.width/4 * 3), (this.game.height/4) * 1);
      wp1.wireTo(this.destination);

      var wp2 = new WayPoint(this.game,
          (this.game.width/4 * 3), (this.game.height/4) * 3);
      wp2.wireTo(this.destination);


      this.switch.wireTo('A', wp1);

      this.switch.wireTo('B', wp2);


      this.head.wireToSwitch(this.switch);
      this.game.add.existing(this.head);
      this.game.add.existing(this.switch);
      this.game.add.existing(this.destination);


    },

    update: function() {

    }
  };
  
  module.exports = Play;