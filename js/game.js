'use strict';
/*global app*/
/*global PIXI*/
/*global MainShip*/
/*global Enemy*/
/*global Player*/
/*global Utils*/
/*global Cloud*/
/*global game*/

var utils = new Utils();

class Game {
	constructor() {

		this.mainScores = [];
		this.playingGame = false;
		this.isCelebrating = false;
		this.currentPlayer = undefined;

		// create the clouds
		this.cloud = new Cloud();

		// ti nickname
		this.tiNickName = utils.addInput((app.renderer.width / 2 - 100), 130, 200);

		// create the game logo
		//this.logo = this._createLogo(app.renderer.width / 2, 40, PIXI.Texture.fromImage('logo.png'));
		this.logo = this._createLogo(app.renderer.width / 2, 40, PIXI.loader.resources.logo.texture);
		app.stage.addChild(this.logo);

		// create welcome text
		this.welcomeText = this._createText(app.renderer.width / 2, 100, 'blue', '20');
		app.stage.addChild(this.welcomeText);

		// create player info text
		this.playerInfoText = this._createText(app.renderer.width / 2, 230, 'blue', '35');
		app.stage.addChild(this.playerInfoText);

		// create in game high score text
		this.inGameHighScoreText = this._createText(80, 20, '#5c5c5c', '15');
		app.stage.addChild(this.inGameHighScoreText);

		// create in game score text
		this.inGameScoreText = this._createText(80, 50, '#5c5c5c', '15');
		app.stage.addChild(this.inGameScoreText);

		// create in game level text
		this.inGameLevelText = this._createText(80, 80, '#5c5c5c', '15');
		app.stage.addChild(this.inGameLevelText);

		// create loss text
		this.endGameText = this._createText(app.renderer.width / 2, 200, '#5c5c5c', '40');
		app.stage.addChild(this.endGameText);

		// create the main ship
		//this.mainShip = new MainShip(PIXI.Texture.fromImage('mainShip.png'));
		this.mainShip = new MainShip(PIXI.loader.resources.mainShip.texture);

		// create the enemy Ship
		//this.enemyShip = new Enemy(PIXI.Texture.fromImage('enemyShip.png'), this);
		this.enemyShip = new Enemy(PIXI.loader.resources.enemyShip.texture, this);

		// create the load button
		//this.loadBtn = this._createButton(app.renderer.width / 2, 180, PIXI.Texture.fromImage('load.png'));
		this.loadBtn = this._createButton(app.renderer.width / 2, 180, PIXI.loader.resources.loadBtn.texture);

		this.loadBtn.on('pointerup', function() {game._findAndLoadPlayer(game.tiNickName.value, game.mainScores);});
		app.stage.addChild(this.loadBtn);

		// create the play button
		//this.playBtn = this._createButton(app.renderer.width / 2, 285, PIXI.Texture.fromImage('play.png'));
		this.playBtn = this._createButton(app.renderer.width / 2, 285, PIXI.loader.resources.playBtn.texture);

		this.playBtn.on('pointerup', function() {game._startPlaying();});
		app.stage.addChild(this.playBtn);

		// create the menu button
		//this.menuBtn = this._createButton(app.renderer.width / 2, 345, PIXI.Texture.fromImage('menu.png'));
		this.menuBtn = this._createButton(app.renderer.width / 2, 345, PIXI.loader.resources.menuBtn.texture);

		this.menuBtn.on('pointerup', function() {
			game._showWelcomeScreen(true);
			game._showPlayScreen(false);
			game.endGameText.visible = false;
			game.menuBtn.visible = false;
			game.enemyShip.reset();
			game.cloud.visible = false;
		});
		app.stage.addChild(this.menuBtn);

		// get scores
		let storedScores = localStorage.getItem('scores');
		this.initializeWelcomeScreen(storedScores !== null ? JSON.parse(storedScores) : []);

		this.bgColor = '000000';

		// create the celebration
		this.celebration = new Celebration(PIXI.loader.resources.bomb.texture);
	}

	// private methods
	_createLogo(x, y, texture) {
		let logo = new PIXI.Sprite(texture);
		logo.anchor.set(0.5);
		logo.x = x;
		logo.y = y;

		return logo;
	}

	_createButton(x, y, texture) {
		let bt = new PIXI.Sprite(texture);
		bt.anchor.set(0.5);
		bt.visible = false;
		bt.x = x;
		bt.y = y;
		bt.interactive = true;
		bt.buttonMode = true;

		return bt;
	}

	_createText(x, y, color, size) {
		let txt = new PIXI.Text('', {fontSize: size + 'px', fill: color});
		txt.visible = false;
		txt.anchor.set(0.5);
		txt.x = x;
		txt.y = y;

		return txt;
	}

	_showWelcomeScreen(show) {
		if (show) {
			this.tiNickName.style.visibility = 'visible';
		} else {
			this.tiNickName.style.visibility = 'hidden';
		}
		this.welcomeText.visible = show;
		this.logo.visible = show;
		this.playerInfoText.visible = show;
		this.loadBtn.visible = show;

		if (show) {
			this.bgColor = '000000';
			app.renderer.backgroundColor = '0x' + this.bgColor;
		}
	}

	_showPlayScreen(show) {
		this.mainShip.setVisible(show);
		this.enemyShip.setVisible(show);
		this.enemyShip.healthBar.setVisible(show);
		this.inGameScoreText.visible = show;
		this.inGameLevelText.visible = show;
		this.inGameHighScoreText.visible = show;
		this.cloud.visible = show;
		this.mainShip.healthBar.setVisible(show);
	}

	_findAndLoadPlayer(nickName, scores) {
		let scoreAux = 0;
		if (typeof nickName !== 'undefined' && typeof scores !== 'undefined') {
			for (let i = 0; i < scores.length; i++) {
				if (scores[i].nick === nickName) {
					nickName = this.playerInfoText.text = scores[i].nick;
					scoreAux = scores[i].highscore;
					break;
				}
			}
		}
		this.playerInfoText.text = nickName + ' - ' + scoreAux;
		this.currentPlayer = new Player(nickName, scoreAux);
		this.playBtn.visible = true;
	}

	_startPlaying() {
		this._resetPlayScreen();
		if (this.endGameText.visible) {
			this.endGameText.visible = false;
		}

		this.enemyShip.shootBomb();
	}

	_resetPlayScreen() {
		this._showWelcomeScreen(false);
		this.playBtn.visible = false;
		this.currentPlayer.score = 0;
		this.bgColor = '09cbed';
		app.renderer.backgroundColor = '0x' + this.bgColor;
		this.playingGame = true;
		this._showPlayScreen(true);
		this.menuBtn.visible = false;
		this.mainShip.healthBar.resetHealthBar();
		this.enemyShip.reset();
		this._setInGameScore();
		this.setInGameLevel();
	}

	_setInGameScore() {
		this.inGameHighScoreText.text = 'HIGH SCORE: ' + this.currentPlayer.highscore;
		this.inGameScoreText.text = 'SCORE: ' + this.currentPlayer.score;
	}

	_stopGame(text) {
		this.currentPlayer.score = 0;
		this.endGameText.text = text;
		this.endGameText.visible = true;
		this.playingGame = false;
		this._updateAndSaveScores();
		this.playBtn.visible = true;
		this.menuBtn.visible = true;
	}

	_updateAndSaveScores() {
		let existingPlayer = false;
		for (let i = 0; i < this.mainScores.length; i++) {
			if (this.mainScores[i].nick === this.currentPlayer.nickName) {
				this.mainScores[i].highscore = this.currentPlayer.highscore;
				existingPlayer = true;
				break;
			}
		}

		if (!existingPlayer) {
			this.mainScores.push({'nick': this.currentPlayer.nickName,'highscore': this.currentPlayer.highscore});
		}
		localStorage.setItem('scores', JSON.stringify(this.mainScores));
	}

	// public methods
	move() {
		if (!this.isCelebrating) {
			this.mainShip.move();
			this.enemyShip.move();
			this.cloud.move();
		} else {
			this.celebration.move();
		}
	}

	substractEnemyScore(value) {
		this.enemyShip.hit(value);

		this.addPlayerScore(1000);

		if (this.enemyShip.healthScore <= 0) {
			this._stopGame('YOU WON');
			this.mainShip.bomb.visible = false;
			this.celebration.startCelebration();
			this.isCelebrating = true;
		}
	}

	mainShipCounterAttack() {
		// for every 3 bombs avoided, the player get a counter attack
		if (this.enemyShip.destroyedBombCount === 10) {
			this.mainShip.shootBomb(false);
		} else if (this.enemyShip.destroyedBombCount === 20) {
			this.mainShip.shootBomb(true);
			// reset the destroyed bomb count
			this.enemyShip.destroyedBombCount = 0;
		}
	}

	setInGameLevel() {
		this.inGameLevelText.text = 'LEVEL: ' + this.enemyShip.bombLevel;
		this.cloud.speedPerMS += 0.1;

		if (this.enemyShip.bombLevel === 10) {
			this.bgColor = '009dff';
			app.renderer.backgroundColor = '0x' + this.bgColor;
		} else if (this.enemyShip.bombLevel === 15) {
			this.bgColor = '0043ff';
			app.renderer.backgroundColor = '0x' + this.bgColor;
		} else if (this.enemyShip.bombLevel === 20) {
			this.bgColor = '001fbc';
			app.renderer.backgroundColor = '0x' + this.bgColor;
		} else if (this.enemyShip.bombLevel === 25) {
			this.bgColor = '000489';
			app.renderer.backgroundColor = '0x' + this.bgColor;
		} else if (this.enemyShip.bombLevel === 30) {
			this.bgColor = '000000';
			app.renderer.backgroundColor = '0x' + this.bgColor;
		}
	}

	addPlayerScore(value) {
		this.mainShip.healthBar.addHealth(20);
		this.currentPlayer.addPlayerScore(value);
		this._setInGameScore();
	}

	subtractPlayerScore(value) {
		this.mainShip.healthBar.removeHealth(20);
		this.currentPlayer.health = this.mainShip.healthBar.healthScore;
		if (this.currentPlayer.health > 0) {
			this.currentPlayer.subtractPlayerScore(value);
			this._setInGameScore();
		}else {
			this._stopGame('YOU LOST');
			this.enemyShip.bomb.visible = false;
			this.celebration.startCelebration();
			this.isCelebrating = true;
		}
	}

	initializeWelcomeScreen(scores) {
		this.mainScores = scores;
		this._showWelcomeScreen(true);
		this.welcomeText.text = 'Type your name:';
	}

	resize() {
		this.tiNickName.style.left = (app.renderer.width / 2 - 100) + 'px';
		this.logo.x = app.renderer.width / 2;
		this.welcomeText.x = app.renderer.width / 2;
		this.playerInfoText.x = app.renderer.width / 2;
		this.endGameText.x = app.renderer.width / 2;
		this.loadBtn.x = app.renderer.width / 2;
		this.playBtn.x = app.renderer.width / 2;
		this.menuBtn.x = app.renderer.width / 2;
		this.mainShip.resize();
		this.enemyShip.resize();
	}
}
