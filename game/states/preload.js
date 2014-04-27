
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);

    this.load.image('background', 'assets/background.png');
        this.load.image('backgroundlight', 'assets/backgroundlight.png');
        this.load.image('selbrain', 'assets/selbrain.png');
        this.load.image('selinstr', 'assets/selinstr.png');
    this.load.image('title', 'assets/title.png');
    this.load.image('mastersynapse', 'assets/mastersynapse.png');
    this.load.image('switchsynapse', 'assets/switchsynapse.png');
    this.load.spritesheet('synapseidentifiers', 'assets/synapseidentifiers.png', 13,13);
    this.load.image('wireanchor', 'assets/wireanchor.png');
    this.load.image('missile', 'assets/missile.png');
    this.load.spritesheet('segment', 'assets/segment.png',32,32);
    this.load.spritesheet('spider', 'assets/spideranim.png',51,29);
    this.load.image('smoke', 'assets/smoke.png');

    this.load.spritesheet('explosion', 'assets/explosion.png',40,40);


    this.load.audio('explosionSound', 'assets/expl.mp3');
    this.load.audio('switchSound', 'assets/switch.mp3');
    this.load.audio('wireSound', 'assets/wire.mp3');
    this.load.audio('music', 'assets/music.mp3');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
