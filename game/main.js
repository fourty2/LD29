'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'drbrainwire',null, null, false);

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('play2', require('./states/play2'));
  game.state.add('play3', require('./states/play3'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};