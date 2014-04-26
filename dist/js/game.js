(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'fearwire');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":6,"./states/gameover":7,"./states/menu":8,"./states/play":9,"./states/preload":10}],2:[function(require,module,exports){
'use strict';
var Wire = require('../prefabs/wire');

var Head = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'start', frame);
  this.anchor.setTo(0.5,0.5);
  // initialize your prefab here
   this.inputEnabled = true;
   this.events.onInputDown.add(this.clickListener, this);
  
};

Head.prototype = Object.create(Phaser.Sprite.prototype);
Head.prototype.constructor = Head;

Head.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Head.prototype.wireToSwitch = function(switchObject) {
	this.switch = switchObject;
	this.wire = new Wire(this.game, null, this.x, this.y, this.switch);

	this.game.add.existing(this.wire);
};

Head.prototype.clickListener = function() {
	if (this.wire) {
		this.wire.fire();
	}
};

module.exports = Head;

},{"../prefabs/wire":5}],3:[function(require,module,exports){
'use strict';

var Segment = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'wire', frame);
  this.anchor.setTo(0, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity  = false;
  this.body.immovable = true;


  this.animations.add('fire', [1,2,3,4,5]);
  var trailAnim = this.animations.add('firetrail', [1,7,8,9,10]);
  this.animations.add('full', [6]);
  trailAnim.onComplete.add(this.fireNextSegment, this);
  this.animations.add('clean', [0]);

};

Segment.prototype = Object.create(Phaser.Sprite.prototype);
Segment.prototype.constructor = Segment;
Segment.prototype.setNextSegment = function(segment) {
	this.nextSegment = segment;
}
Segment.prototype.fire = function() {
	this.animations.play('firetrail', 30, false);
}

Segment.prototype.fireNextSegment = function() {
	this.animations.play('full', 1, true);
	if (this.nextSegment) {
		this.nextSegment.fire();
	} else if (this.fullCallback) {
		this.fullCallback(this.callbackScope);
	}
}

Segment.prototype.setFullCallback = function(callback, scope) {
	this.fullCallback = callback;
	this.callbackScope = scope;
}



Segment.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Segment;

},{}],4:[function(require,module,exports){
'use strict';
var Wire = require('../prefabs/wire');
var Switch = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'switch', frame);
	this.anchor.setTo(0.5,0.5);
	this.inputEnabled = true;
	this.state = 'A';
	this.stateWires = Array();
	this.animations.add('B', [1]);
	this.animations.add('A', [0]);
	this.events.onInputDown.add(this.toggleSwitch, this);

};

Switch.prototype = Object.create(Phaser.Sprite.prototype);
Switch.prototype.constructor = Switch;

Switch.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};
Switch.prototype.wireTo = function(state, obj) {

	if (obj instanceof Phaser.Point) {
		this.stateWires[state] = new Wire(this.game, null, this.x, this.y,
                     obj);
		this.game.add.existing(this.stateWires[state]);
	}

};

Switch.prototype.wireLanded = function() {
	console.log("kam im switch an " + this.state);
	this.stateWires[this.state].fire();
}

Switch.prototype.toggleSwitch = function() {
	this.state = this.state == 'A'?'B':'A';
    this.animations.play(this.state, 1, true);
}

module.exports = Switch;

},{"../prefabs/wire":5}],5:[function(require,module,exports){
'use strict';

var Segment = require('../prefabs/segment');
var Wire = function(game, parent, sourceX, sourceY, destX, destY) {
    Phaser.Group.call(this, game, parent);
    this.create(sourceX, sourceY, destX, destY);  
};

Wire.prototype = Object.create(Phaser.Group.prototype);
Wire.prototype.constructor = Wire;
Wire.prototype.create = function(sourceX, sourceY, destObj) {
		var destX = destObj.x;
		var destY = destObj.y;
		this.destObj = destObj;

	  this.pSource = new Phaser.Point(sourceX, sourceY);
	  this.pDest = new Phaser.Point(destX, destY);
	  this.iDistance = Phaser.Point.distance(this.pSource, this.pDest);
	  this.iAngle = this.game.physics.arcade.angleBetween(this.pSource, this.pDest);
	  this.segments = Array();
	  var pStart = this.pSource;
	  var i =0 ;
	  var lastSegment = null;
	  while (this.iDistance > 20 && i < 40) {
	  		i++;
	  		this.iAngle = this.game.physics.arcade.angleBetween(pStart, this.pDest);
	  		
	  		var segment = new Segment(this.game, pStart.x, pStart.y);

	  		if (lastSegment) {
		  		lastSegment.setNextSegment(segment);
	  		}
			lastSegment = segment;
	  		segment.angle = (this.iAngle * (180/Math.PI)) + this.game.rnd.integerInRange(-20,20);
	  		// nächsten punkt ausrechnen
	  		var rad = segment.angle * (Math.PI / 180);
	  		pStart.x = Math.round(pStart.x + Math.cos(rad) * 32);
	  		pStart.y = Math.round(pStart.y + Math.sin(rad) * 32);
			this.iDistance = Phaser.Point.distance(pStart, this.pDest);

			this.add(segment);
			this.segments.push(segment);
	  }
	  segment.setFullCallback(this.handleFullWire, this);

};

Wire.prototype.fire = function() {
	this.segments[0].fire();
}

Wire.prototype.handleFullWire = function(scope) {
	scope.destObj.wireLanded();
}

Wire.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Wire;

},{"../prefabs/segment":3}],6:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],7:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],8:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],9:[function(require,module,exports){

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
},{"../prefabs/head":2,"../prefabs/switch":4}],10:[function(require,module,exports){

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

    this.load.spritesheet('wire', 'assets/wire.png', 32, 32);
    this.load.spritesheet('start', 'assets/start.png', 32, 32);
    this.load.spritesheet('switch', 'assets/switch.png', 32, 32);

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])