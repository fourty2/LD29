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
},{"./states/boot":9,"./states/gameover":10,"./states/menu":11,"./states/play":12,"./states/preload":13}],2:[function(require,module,exports){
'use strict';

var Destination = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'start', frame);
 this.anchor.setTo(0.5,0.5);
 this.angle = 180;
  // initialize your prefab here
  
};

Destination.prototype = Object.create(Phaser.Sprite.prototype);
Destination.prototype.constructor = Destination;
Destination.prototype.wireLanded = function() {
this.game.state.start('play');
	console.log("yeah yeah");
}

Destination.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Destination;

},{}],3:[function(require,module,exports){
'use strict';

var Enemy = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, 0, 0, 'flower', frame);
  this.anchor.setTo(0.5,0.5);
  this.bringToTop();
  // initialize your prefab here
  
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Enemy.prototype.hit = function() {
	this.destroy();
}

module.exports = Enemy;

},{}],4:[function(require,module,exports){
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

Head.prototype.wireToSwitch = function(switchObject, enemies) {
	this.switch = switchObject;
	this.wire = new Wire(this.game, null, this.x, this.y, this.switch, enemies);

	this.game.add.existing(this.wire);
};

Head.prototype.clickListener = function() {
	if (this.wire) {
		this.wire.fire();
	}
};

module.exports = Head;

},{"../prefabs/wire":8}],5:[function(require,module,exports){
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
  if (this.hasEnemy) {
    this.hasEnemy.hit();
    this.hasEnemy = false;
  }
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

},{}],6:[function(require,module,exports){
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
Switch.prototype.wireTo = function(state, obj, enemies) {
	this.stateWires[state] = new Wire(this.game, null, this.x, this.y,
                    obj, enemies);
	this.game.add.existing(this.stateWires[state]);
};

Switch.prototype.wireLanded = function() {
	this.stateWires[this.state].fire();
}

Switch.prototype.toggleSwitch = function() {
	this.state = this.state == 'A'?'B':'A';
    this.animations.play(this.state, 1, true);
}

module.exports = Switch;

},{"../prefabs/wire":8}],7:[function(require,module,exports){
'use strict';
var Wire = require('../prefabs/wire');
var Waypoint = function(game, x, y) {
  this.game = game;
  Phaser.Point.call(this, x, y);

  // initialize your prefab here
  
};

Waypoint.prototype = Object.create(Phaser.Point.prototype);
Waypoint.prototype.constructor = Waypoint;

Waypoint.prototype.wireTo = function(obj) {
	this.wire = new Wire(this.game, null, this.x, this.y,
                    obj);
	this.game.add.existing(this.wire);
};

Waypoint.prototype.wireLanded = function() {

	if (this.wire) {
		this.wire.fire();
	}
  // write your prefab's specific update code here
  
};

module.exports = Waypoint;

},{"../prefabs/wire":8}],8:[function(require,module,exports){
'use strict';

var Segment = require('../prefabs/segment');
var Wire = function(game, parent, sourceX, sourceY, destObj, enemies) {
    Phaser.Group.call(this, game, parent);
    this.enemies = enemies;
    this.create(sourceX, sourceY, destObj);
    this.spawnEnemies(); 
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
	  while (this.iDistance > 16 && i < 40) {
	  		i++;
	  		this.iAngle = this.game.physics.arcade.angleBetween(pStart, this.pDest);
	  		
	  		var segment = new Segment(this.game, pStart.x, pStart.y);

	  		if (lastSegment) {
		  		lastSegment.setNextSegment(segment);
	  		}
			lastSegment = segment;
			var variance = 0;
			if (this.iDistance > 100) {
				variance = this.game.rnd.integerInRange(-20,20)
			}

	  		segment.angle = (this.iAngle * (180/Math.PI)) + variance ;
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
Wire.prototype.spawnEnemies = function() {
	if (this.enemies) {
		for (var countEnemies = 0; countEnemies< this.enemies.length; countEnemies++) {
	  	var sgmt = this.game.rnd.integerInRange(1, this.segments.length-1);

	  	this.enemies[countEnemies].x = this.segments[sgmt].x;
	  	this.enemies[countEnemies].y = this.segments[sgmt].y;
	  	this.segments[sgmt].hasEnemy = this.enemies[countEnemies];
	  	this.add(this.enemies[countEnemies]);

	  }
	}
}


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

},{"../prefabs/segment":5}],9:[function(require,module,exports){

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

},{}],10:[function(require,module,exports){

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

},{}],11:[function(require,module,exports){

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

},{}],12:[function(require,module,exports){

  'use strict';
  var Head = require('../prefabs/head');
  var Switch = require('../prefabs/switch');
 var WayPoint = require('../prefabs/waypoint');
 var Destination = require('../prefabs/destination');
 var Enemy = require('../prefabs/enemy');
 
  
  function Play() {}
  Play.prototype = {
    wires: Array(),
    create: function() {
      this.targetFears = 2;
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
       var style = { font: '24px Arial', fill: '#ffffff', align: 'center'};
      this.titleText = this.game.add.text(0, 0, 'Fears to kill: ' + this.targetFears, style);
     // this.titleText.anchor.setTo(0.5, 0.5);

      this.enemies = [
          new Enemy(this.game),
          new Enemy(this.game)
        ];


      this.head = new Head(this.game, 16, this.game.height/2);
      this.switch = new Switch(this.game, this.game.width/2, this.game.height/2);
      this.destination = new Destination(this.game, this.game.width - 16, this.game.height/2);


      var wp1 = new WayPoint(this.game, 
          (this.game.width/4 * 3), (this.game.height/4) * 1);
      wp1.wireTo(this.destination);

      var wp2 = new WayPoint(this.game,
          (this.game.width/4 * 3), (this.game.height/4) * 3);
      wp2.wireTo(this.destination);


      this.switch.wireTo('A', wp1, 0);

      this.switch.wireTo('B', wp2, [this.enemies[1]]);

      this.head.wireToSwitch(this.switch, [this.enemies[0]]);
      this.game.add.existing(this.head);
      this.game.add.existing(this.switch);
      this.game.add.existing(this.destination);


    },

    update: function() {
        var x = this.targetFears;
        this.enemies.forEach(function(enemy) {
            if (!enemy.exists) { x-=1;}
             this.titleText.setText("Fears to kill: " + x);
         }, this);
    }
  };
  
  module.exports = Play;
},{"../prefabs/destination":2,"../prefabs/enemy":3,"../prefabs/head":4,"../prefabs/switch":6,"../prefabs/waypoint":7}],13:[function(require,module,exports){

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
    this.load.spritesheet('flower', 'assets/flower.png', 32, 32);
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