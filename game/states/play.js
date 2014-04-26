
  'use strict';
  var Wire = require('../prefabs/wire');

  function Play() {}
  Play.prototype = {
    wires: Array(),
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      var mywire = new Wire(this.game, null, 0, this.game.height, this.game.width, 0);
      var mywire2 = new Wire(this.game,0, this.game.height/2, this.game.width, this.game.height/2);
      this.game.add.existing(mywire);
      this.game.add.existing(mywire2);

      mywire.fire();
      mywire2.fire();
    },

    update: function() {

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;