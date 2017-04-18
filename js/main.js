'use strict';
/*global PIXI*/
/*global window*/
/*global Game*/

var app = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor: 0x000000});

var game;

window.onresize = function(event) {
	let w = window.innerWidth;
	let h = window.innerHeight;
	//this part resizes the canvas but keeps ratio the same
	app.renderer.view.style.width = w + 'px';
	app.renderer.view.style.height = h + 'px';
	//this part adjusts the ratio:
	app.renderer.resize(w, h);
	//this part adjusts the sprites location
	game.resize();
};

document.body.appendChild(app.view);
document.body.style.paddingTop = '0px';
document.body.style.paddingBottom = '0px';
document.body.style.paddingLeft = '0px';
document.body.style.paddingRight = '0px';
document.body.style.marginTop = '0px';
document.body.style.marginBottom = '0px';
document.body.style.marginLeft = '0px';
document.body.style.marginRight = '0px';
document.body.style.overflow = 'hidden';

PIXI.loader = new PIXI.loaders.Loader('', 20);
var loader = PIXI.loader;
loader.reset();

loader.add('logo', 'assets/source/logo.png');
loader.add('loadBtn', 'assets/source/load.png');
loader.add('playBtn', 'assets/source/play.png');
loader.add('menuBtn', 'assets/source/menu.png');
loader.add('enemyShip', 'assets/source/enemyShip.png');
loader.add('mainShip', 'assets/source/mainShip.png');
loader.add('lrocket', 'assets/source/lrocket.png');
loader.add('mine1', 'assets/source/mine1.png');
loader.add('mine2', 'assets/source/mine2.png');
loader.add('bomb', 'assets/source/bomb.png');
loader.add('healthFrame', 'assets/source/healthFrame.png');
loader.add('healthBar', 'assets/source/healthBar.png');
loader.add('mask', 'assets/source/mask.png');
loader.add('cloud', 'assets/source/cloud.png');

// cant use sprite sheet because cocoonJS does not display sprites created
// from sprite sheets
// loader.add('spaceship', 'assets/spritesheet.json');

function initializeWelcomeScreen(scores) {
	if (typeof game !== 'undefined') {
		game.initializeWelcomeScreen(scores);
	}
}

loader.load(function() {
	game = new Game();
});

app.ticker.add(function() {
	if (typeof game !== 'undefined' && (game.playingGame || game.isCelebrating)) {
		game.move();
	}
});
