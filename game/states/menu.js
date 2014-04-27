
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};

    this.background = this.game.add.sprite(0,0,'backgroundlight');
      this.background.scale.x = 2;
      this.background.scale.y = 2;

    this.title = this.game.add.sprite(0,0,'title');
    this.title.anchor.setTo(0.5,0.5);
    this.title.x = this.game.width/2;
    this.title.y = -100;
    this.title.scale.x = 2;
    this.title.scale.y = 2;

    this.brainButton = this.game.add.button(this.game.width/2, 310, 'selbrain', this.startGame, this);
    this.brainButton.anchor.setTo(0.5,0.5);
    this.brainButton.scale.x = 2;
    this.brainButton.scale.y = 2;

    this.instructionsButton = this.game.add.button(this.game.width/2, 400, 'selinstr', this.readInstructions, this);
    this.instructionsButton.anchor.setTo(0.5,0.5);
    this.instructionsButton.scale.x = 2;
    this.instructionsButton.scale.y = 2;

    this.game.add.text(220, this.game.height - 40, 'a game by @snooze82 - made for LudumDare 29',  { font: '16px Arial', fill: '#ffffff', align: 'center'});


    this.instructionGroup = this.game.add.group();
    this.instructionGroup.add(
        this.game.add.text(170,400,'* send an impulse by clicking on the head (left) (lvl2: top)', { font: '16px Arial', fill: '#333333', align: 'center'})
    );


    this.instructionGroup.add(
    this.game.add.text(170,420,'* toggle switches', { font: '16px Arial', fill: '#333333', align: 'center'})
    );
    this.instructionGroup.add(
    this.game.add.text(170,440,'* kill all spiders/ fears', { font: '16px Arial', fill: '#333333', align: 'center'})
    );
    this.instructionGroup.add(
    this.game.add.text(170,460,'* (lvl2) you can toggle the switch while the impulse is traveling', { font: '16px Arial', fill: '#333333', align: 'center'})
    );
    this.instructionGroup.add(
    this.game.add.text(60,350,'story: you are a doctor who can destroy somebodies fears by rewiring his/hers brain (inception like)',  { font: '16px Arial', fill: '#333333', align: 'center'})
    );

    this.instructionGroup.visible = false;
    this.game.add.tween(this.title).to({y:130}, 2000, Phaser.Easing.Bounce.Out, true);

    this.audioSwitch = this.game.add.button(this.game.width - 80, 10, 'audioswitch', this.switchAudio, this);

    this.music = this.game.add.audio('music');
    this.music.play('', 0, 0.2, true);
/*    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
    */
  },
  switchAudio: function() {
    if (this.music.isPlaying) {
      this.music.pause();
    } else {
      this.music.resume();
    }

  },
  startGame: function() {
    this.game.state.start('play');

  },
  readInstructions: function() {
    this.instructionsButton.visible = false;
    this.instructionGroup.visible = true;
  },
  update: function() {
  //  if(this.game.input.activePointer.justPressed()) {
    //  this.game.state.start('play');
   // }
  },
   shutdown: function() {
  //    this.music.pause();
    //  this.music.destroy();
    }
};

module.exports = Menu;
