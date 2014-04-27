
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};

    this.background = this.game.add.sprite(0,0,'background');
      this.background.scale.x = 2;
      this.background.scale.y = 2;

    this.title = this.game.add.sprite(0,0,'title');
    this.title.anchor.setTo(0.5,0.5);
    this.title.x = this.game.width/2;
    this.title.y = -100;
    this.title.scale.x = 2;
    this.title.scale.y = 2;
    this.game.add.text(170,300,'* send an impulse by clicking on the head (left) (lvl2: top)', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.game.add.text(170,320,'* toggle switches (should show the direction later)', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.game.add.text(170,340,'* kill all flowers', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.game.add.text(170,360,'* (lvl2) you can toggle the switch while the impulse is traveling', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.game.add.text(60,250,'story: you are a doctor who can destroy somebodies fears by rewiring his/hers brain (inception like)',  { font: '16px Arial', fill: '#ffffff', align: 'center'})
    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.game.add.tween(this.title).to({y:130}, 2000, Phaser.Easing.Bounce.Out, true);

/*    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
    */
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;
