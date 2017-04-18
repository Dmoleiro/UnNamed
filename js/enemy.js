'use strict';
/*global PIXI*/
/*global app*/
/*global BombPool*/
/*global HealthBar*/
/*global game*/

class Enemy extends PIXI.Sprite{
	constructor(texture, owner) {
		super(texture);

		this.anchor.set(0.5);
		this.visible = false;
		this.movementDuration = Math.round(Math.random() * 4000 + 400);
		this.movementDirection = Math.random() > 0.5 ? 1 : -1;
		this.elapsedTime = 0;
		this.xDistancePerMS = Math.random() * 0.4 + 0.1;

		this.bombPool = new BombPool(10, this);
		this.owner = owner;

		this.bombCount = 0;
		this.bombSpeed = 1;
		this.bombLevel = 1;
		this.destroyedBombCount = 0;

		let idealWidth = Math.round(app.renderer.width / 8);
		this.scale.set(idealWidth / this.width);

		this.x = app.renderer.width / 2;
		this.y = app.renderer.height - (this.height / 2 + 40);

		this.healthScore = 100;
		this.healthBar = new HealthBar(app.renderer.height - 35);

		app.stage.addChild(this);
	}

	setVisible(visible) {
		this.visible = visible;
		if (!visible) {
			for (let i = 0; i < this.bombPool.bombList.length; i++) {
				this.bombPool.bombList[i].visible = visible;
			}
		}
	}

	shootBomb() {
		if (this.bombCount > 5) {
			this.bombCount = 0;
			this.bombSpeed += 0.1;
			this.bombLevel += 1;
			this.owner.setInGameLevel();
		}
		this.bomb = this.bombPool.allocateBomb();

		//this.bomb.texture = PIXI.Texture.fromImage('lrocket.png');
		this.bomb.texture = PIXI.loader.resources.lrocket.texture;

		let minXTarget = game.mainShip.x - (game.mainShip.width * 1.5);
		let maxXTarget = game.mainShip.x + (game.mainShip.width * 1.5);
		let targetX = Math.round(Math.random() * (maxXTarget - minXTarget + 1) + minXTarget);
		this.bomb.resetBomb(this.x, this.y, targetX, game.mainShip.y, this.bombSpeed, false, false, this);
		this.bombCount++;
	}

	resetMovement() {
		this.movementDuration = Math.round(Math.random() * 4000 + 400);
		this.movementDirection *= -1;
		this.elapsedTime = 0;
	}

	reset() {
		this.resetMovement();
		if (typeof this.bomb !== 'undefined') {
			this.bomb.visible = false;
		}
		this.bombCount = 0;
		this.bombSpeed = 1;
		this.bombLevel = 1;
	}

	move() {
		for (let i = 0; i < this.bombPool.bombList.length; i++) {
			if (this.bombPool.bombList[i].visible) {
				this.bombPool.bombList[i].move();
			}
		}

		this.elapsedTime += app.ticker.elapsedMS;
		if (this.x < this.width || this.x > (app.renderer.width - this.width) || this.elapsedTime > this.movementDuration ||
			this.elapsedTime > this.movementDuration) {
			this.resetMovement();
		}

		this.x += (this.xDistancePerMS * app.ticker.elapsedMS * this.movementDirection);
	}

	hit(value) {
		this.healthScore -= value;
		this.healthBar.removeHealth(value);
	}

	resize() {
		this.x = app.renderer.width / 2;
		this.healthBar.resize();
	}
}
