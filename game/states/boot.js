
'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
  //            this.game.scale.setShowAll();
    //  this.game.scale.refresh();
     // this.game.stage.smoothed = false;

/*    canvas.getContext('2d').webkitImageSmoothingEnabled = false;
canvas.getContext('2d').oImageSmoothingEnabled = false;
canvas.getContext('2d').mozImageSmoothingEnabled = false;
canvas.getContext('2d').imageSmoothingEnabled = false;
*/
    this.game.state.start('preload');

  }
};

module.exports = Boot;
