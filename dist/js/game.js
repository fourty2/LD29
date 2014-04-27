(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":9,"./states/gameover":10,"./states/menu":11,"./states/play":12,"./states/play2":13,"./states/preload":14}],2:[function(require,module,exports){
'use strict';

var Destination = function(game, parent) {
	Phaser.Group.call(this, game, parent);

	this.synapse = this.game.add.sprite(0,0,'mastersynapse');
	this.synapse.anchor.setTo(0.5,0.5);
	this.add(this.synapse);

	this.identifier = this.game.add.sprite(-4,-4,'synapseidentifiers', 2);
	this.identifier.anchor.setTo(0.5,0.5);
	this.add(this.identifier);

// this.angle = 180;
 this.landed = false;
  // initialize your prefab here
  
};

Destination.prototype = Object.create(Phaser.Group.prototype);
Destination.prototype.constructor = Destination;
Destination.prototype.wireLanded = function() {

	this.landed = true;

	//this.game.state.start('play');
	//console.log("yeah yeah");
}

Destination.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Destination.prototype.setInputSegment = function(segment) {
	
}

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

var Head = function(game, parent) {
	Phaser.Group.call(this, game, parent);


	this.synapse = this.game.add.sprite(0,0,'mastersynapse');
	this.synapse.anchor.setTo(0.5,0.5);
	this.add(this.synapse);

	this.identifier = this.game.add.sprite(-4,-4,'synapseidentifiers', 1);
	this.identifier.anchor.setTo(0.5,0.5);
	this.add(this.identifier);

/*  Phaser.Sprite.call(this, game, x, y, 'mastersynapse', frame);
  this.anchor.setTo(0.5,0.5);

  this.game.add.sprite(this.x,this.y,'synapseidentifiers',1);
*/
  // initialize your prefab here
   this.synapse.inputEnabled = true;
   this.synapse.events.onInputDown.add(this.clickListener, this);
   	this.synapse.events.onInputOver.add(this.tweenOver, this);
  
};

Head.prototype = Object.create(Phaser.Group.prototype);
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

Head.prototype.tweenOver = function() {
	var tw = this.game.add.tween(this.synapse.scale).to({x:1.5, y:1.5}, 150, Phaser.Easing.Circular.In, true,0,	1,true);

}

module.exports = Head;

},{"../prefabs/wire":8}],5:[function(require,module,exports){
'use strict';

var Segment = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'segment', frame);
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity  = false;
  this.body.immovable = true;


  this.animations.add('fire', [0]);
  var trailAnim = this.animations.add('firetrail', [1]);
  this.animations.add('full', [2]);
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
var Switch = function(game, parent) {
	Phaser.Group.call(this, game, parent);



	this.synapse = this.game.add.sprite(0,0,'switchsynapse');
	this.synapse.anchor.setTo(0.5,0.5);
	this.add(this.synapse);

	this.synapse.inputEnabled = true;
	this.state = 'A';
	this.stateWires = Array();
	this.synapse.events.onInputDown.add(this.toggleSwitch, this);
	this.synapse.events.onInputOver.add(this.tweenOver, this);

	this.identifier = this.game.add.sprite(2,2,'synapseidentifiers', 0);
	this.identifier.anchor.setTo(0.5,0.5);
	this.add(this.identifier);


	this.indicator = this.game.add.sprite(0,0, 'switchindicator');
	this.indicator.anchor.setTo(0.5,0.5);

};

Switch.prototype = Object.create(Phaser.Group.prototype);
Switch.prototype.constructor = Switch;

Switch.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};
Switch.prototype.wireTo = function(state, obj, enemies, waypoint) {
	this.stateWires[state] = new Wire(this.game, null, this.x, this.y,
                    obj, enemies, waypoint);
	if (state == 'A') {
		var segment = this.stateWires[state].segments[0];
		
		var rad = segment.angle * (Math.PI / 180);
	  	this.indicator.x = Math.round(this.x + Math.cos(rad) * 32);
	  	this.indicator.y = Math.round(this.y + Math.sin(rad) * 32);
		//this.indicator.x+=30;
	}
	this.game.add.existing(this.stateWires[state]);
};

Switch.prototype.wireLanded = function() {
	this.stateWires[this.state].fire();
}

Switch.prototype.toggleSwitch = function() {
	this.state = this.state == 'A'?'B':'A';
	var segment = this.stateWires[this.state].segments[0];
	
	var rad = segment.angle * (Math.PI / 180);
	
	 var nextX  = Math.round(this.x + Math.cos(rad) * 32);
	 var nextY = Math.round(this.y + Math.sin(rad) * 32);
	this.game.add.tween(this.indicator).to({x: nextX, y:nextY}, 500, Phaser.Easing.Circular.Out, true);


//    this.animations.play(this.state, 1, true);
}
Switch.prototype.tweenOver = function() {
	var tw = this.game.add.tween(this.synapse.scale).to({x:1.5, y:1.5}, 150, Phaser.Easing.Circular.In, true,0,	1,true);

}

Switch.prototype.setInputSegment = function(segment) {
	
/*	this.inputindicator = this.game.add.sprite(0,0,'switchinput');
	this.inputindicator.anchor.setTo(0.5,0.5);
	var rad = segment.angle * (Math.PI / 180);
	  	this.inputindicator.x = Math.round(this.x - Math.cos(rad) * 32);
	  	this.inputindicator.y = Math.round(this.y - Math.sin(rad) * 32);
	  	console.log(this.inputindicator.z);
	  	this.inputindicator.z = -1;
	  	console.log(this.z);
	  this.inputindicator.bringToTop();*/
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
Waypoint.prototype.setInputSegment = function(segment) {
	
}

module.exports = Waypoint;

},{"../prefabs/wire":8}],8:[function(require,module,exports){
'use strict';

var Segment = require('../prefabs/segment');
var Wire = function(game, parent, sourceX, sourceY, destObj, enemies, waypoint) {
    Phaser.Group.call(this, game, parent);
    this.enemies = enemies;
    this.waypoint = waypoint;
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

	  // very first segment is anchor
		//var segment = this.stateWires[state].segments[0];
		
		//var rad = segment.angle * (Math.PI / 180);
	  	pStart.x = Math.round(pStart.x + Math.cos(this.iAngle) * 16);
	  	pStart.y = Math.round(pStart.y + Math.sin(this.iAngle) * 16);

	  	var anchor = this.game.add.sprite(pStart.x,pStart.y,'wireanchor');
	  	anchor.anchor.setTo(0.5,0.5);

	  	this.add(anchor);

	  	if (this.waypoint) {
	  		this.pWaypoint = new Phaser.Point(this.waypoint.x, this.waypoint.y);
	  	}


	  while (this.iDistance > 5 && i < 100) {
	  		i++;

	  		if (this.pWaypoint && Phaser.Point.distance(pStart, this.pWaypoint) > 50) {
	  			this.iAngle = this.game.physics.arcade.angleBetween(pStart, this.pWaypoint);
	  		} else {
	  			this.pWaypoint = false;
		  		this.iAngle = this.game.physics.arcade.angleBetween(pStart, this.pDest);
	  		}

	  		
	  		var segment = new Segment(this.game, pStart.x, pStart.y);

	  		if (lastSegment) {
		  		lastSegment.setNextSegment(segment);
	  		}
			lastSegment = segment;
			var variance = 0;
			if (this.iDistance > 20) {
				variance = (Math.sin(pStart.x) + Math.cos(pStart.y)) * 21;//this.game.rnd.integerInRange(-20,20)
			}

	  		segment.angle = (this.iAngle * (180/Math.PI)) + variance ;
	  		// nächsten punkt ausrechnen
	  		var rad = segment.angle * (Math.PI / 180);
	  		pStart.x = Math.round(pStart.x + Math.cos(rad) * 7);
	  		pStart.y = Math.round(pStart.y + Math.sin(rad) * 7);
			this.iDistance = Phaser.Point.distance(pStart, this.pDest);

			this.add(segment);
			this.segments.push(segment);
	  }
	  destObj.setInputSegment(segment);
	  segment.setFullCallback(this.handleFullWire, this);

	  


};
Wire.prototype.spawnEnemies = function() {
	if (this.enemies) {
		for (var countEnemies = 0; countEnemies< this.enemies.length; countEnemies++) {
	  	var sgmt = this.game.rnd.integerInRange(5, this.segments.length-1);

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

},{}],12:[function(require,module,exports){

  'use strict';
  var Head = require('../prefabs/head');
  var Switch = require('../prefabs/switch');
 var WayPoint = require('../prefabs/waypoint');
 var Destination = require('../prefabs/destination');
 var Enemy = require('../prefabs/enemy');
 
  
  function Play() {}
  Play.prototype = {

    create: function() {
      this.targetFears = 2;

      this.background = this.game.add.sprite(0,0,'background');
      this.background.scale.x = 2;
      this.background.scale.y = 2;
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
       var style = { font: '12px Arial', fill: '#333333', align: 'center'};
      this.titleText = this.game.add.text(0, 0, 'Fears to kill: ' + this.targetFears, style);
     // this.titleText.anchor.setTo(0.5, 0.5);


      this.enemies = [
          new Enemy(this.game),
          new Enemy(this.game)
        ];


      this.head = new Head(this.game);
      this.head.x = 16;
      this.head.y = this.game.height/2;

      this.switch = new Switch(this.game);
      this.switch.x = this.game.width/2;
      this.switch.y = this.game.height/2;
      this.destination = new Destination(this.game);
      this.destination.x = this.game.width - 16;
      this.destination.y = this.game.height/2;


      var wp1 = new WayPoint(this.game, 
          (this.game.width/4 * 3), (this.game.height/4) * 1);
     // wp1.wireTo(this.destination);

      var wp2 = new WayPoint(this.game,
          (this.game.width/4 * 3), (this.game.height/4) * 3);
      //wp2.wireTo(this.destination);


      this.switch.wireTo('A', this.destination, 0, wp1);

      this.switch.wireTo('B', this.destination, [this.enemies[1]], wp2);

      this.head.wireToSwitch(this.switch, [this.enemies[0]]);
  //    this.game.add.existing(this.head);
    //  this.game.add.existing(this.switch);
     // this.game.add.existing(this.destination);


    },
    update: function() {
 

        var x = this.targetFears;
        this.enemies.forEach(function(enemy) {
            if (!enemy.exists) { x-=1;}
             this.titleText.setText("Fears to kill: " + x);
         }, this);

        if (this.destination.landed && x == 0) {
           this.game.state.start('play2');
        } else if (this.destination.landed) {
           this.game.state.start('play');
        }
    }
  };
  
  module.exports = Play;
},{"../prefabs/destination":2,"../prefabs/enemy":3,"../prefabs/head":4,"../prefabs/switch":6,"../prefabs/waypoint":7}],13:[function(require,module,exports){
'use strict';
  var Head = require('../prefabs/head');
  var Switch = require('../prefabs/switch');
 var WayPoint = require('../prefabs/waypoint');
 var Destination = require('../prefabs/destination');
 var Enemy = require('../prefabs/enemy');
 

  function Play2() {}
  Play2.prototype = {
    preload: function() {
      // Override this method to add some load operations. 
      // If you need to use the loader, you may need to use them here.
    },
    create: function() {
       this.background = this.game.add.sprite(0,0,'background');
             this.background.scale.x = 2;
      this.background.scale.y = 2;
    this.targetFears = 3;
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
       var style = { font: '14px Arial', fill: '#ffffff', align: 'center'};
      this.titleText = this.game.add.text(0, 0, 'Fears to kill: ' + this.targetFears, style);
     // this.titleText.anchor.setTo(0.5, 0.5);


      this.enemies = [
          new Enemy(this.game),
          new Enemy(this.game),
          new Enemy(this.game)
        ];


      this.head = new Head(this.game);
      
      this.head.x = this.game.width / 2;
      this.head.y = 16;
    
      this.destination = new Destination(this.game);
      
      this.destination.x = this.game.width /2;
      this.destination.y = this.game.height - 16;

      var switch1 = new Switch(this.game);
      switch1.x= this.game.width/6;
      switch1.y = this.game.height/4;

      var switch2 = new Switch(this.game);
      switch2.x = (this.game.width/6)*5;
      switch2.y = (this.game.height/4);

      var switch3 = new Switch(this.game);
      switch3.x = (this.game.width/4)*2;
      switch3.y = this.game.height/2;
  
      var switch4 = new Switch(this.game);
      switch4.x = (this.game.width/4);
      switch4.y = (this.game.height/4)*3;

      var switch5 = new Switch(this.game);
      switch5.x = (this.game.width/4) *3;
      switch5.y = (this.game.height/4)*3;

      var wp1 = new WayPoint(this.game, 
          (this.game.width/5)*2, (this.game.height/5));
    //  wp1.wireTo(switch4);

      var wp2 = new WayPoint(this.game,
          (this.game.width/4 )*3, (this.game.height/2));
    /*  wp2.wireTo(this.destination);
*/

    /*  this.switch.wireTo('A', switch3, 0);
      this.switch.wireTo('B', wp2, [this.enemies[1]]);
    */
      switch1.wireTo('A', switch3, 0);
      switch1.wireTo('B', switch4, 0);
      switch3.wireTo('A', switch2, 0);
      switch3.wireTo('B', switch5,0 );
      switch2.wireTo('A', this.destination,0, wp2);
      switch2.wireTo('B', switch4,0, wp1);
      switch4.wireTo('A', this.destination, [this.enemies[1]]);
      switch4.wireTo('B', switch3,0);
      switch5.wireTo('A', this.destination,0 );
      switch5.wireTo('B', switch2, [this.enemies[2]])
      this.head.wireToSwitch(switch1, [this.enemies[0]]);

 /*     this.game.add.existing(this.head);
      this.game.add.existing(switch1);
      this.game.add.existing(switch2);
      this.game.add.existing(switch3);
      this.game.add.existing(switch4);
      this.game.add.existing(switch5);
      this.game.add.existing(this.destination);*/
    },
    update: function() {
         var x = this.targetFears;
        this.enemies.forEach(function(enemy) {
            if (!enemy.exists) { x-=1;}
             this.titleText.setText("Fears to kill: " + x + " (hint: switch while pulsating)");
         }, this);

         if (this.destination.landed) {
           this.game.state.start('play2');
        }
    },
    paused: function() {
      // This method will be called when game paused.
    },
    render: function() {
      // Put render operations here.
    },
    shutdown: function() {
      // This method will be called when the state is shut down 
      // (i.e. you switch to another state from this one).
    }
  };
module.exports = Play2;

},{"../prefabs/destination":2,"../prefabs/enemy":3,"../prefabs/head":4,"../prefabs/switch":6,"../prefabs/waypoint":7}],14:[function(require,module,exports){

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
    this.load.image('title', 'assets/title.png');
    this.load.image('mastersynapse', 'assets/mastersynapse.png');
    this.load.image('switchsynapse', 'assets/switchsynapse.png');
    this.load.spritesheet('synapseidentifiers', 'assets/synapseidentifiers.png', 13,13);
    this.load.image('wireanchor', 'assets/wireanchor.png');
    this.load.spritesheet('segment', 'assets/segment.png',32,32);


  //  this.load.image('mastersynapse', 'assets/mastersynapse.png');


    // old sprites
    this.load.spritesheet('wire', 'assets/wire.png', 32, 32);
    this.load.spritesheet('start', 'assets/start.png', 32, 32);
    this.load.spritesheet('rand', 'assets/rand.png', 153, 153);

    this.load.spritesheet('switch', 'assets/switch.png', 85, 86);
    this.load.spritesheet('switchindicator', 'assets/switchindicator.png', 34, 35);
    this.load.spritesheet('switchinput', 'assets/switchinput.png', 10, 31);

    this.load.spritesheet('flower', 'assets/flower.png', 32, 32);
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

},{}]},{},[1])