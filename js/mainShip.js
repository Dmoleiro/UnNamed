'use strict';
/*global PIXI*/
/*global app*/
/*global HealthBar*/
/*global BombPool*/
/*global game*/

class MainShip extends PIXI.Sprite{
	constructor(texture) {
		super(texture);

		this.anchor.set(0.5);
		this.visible = false;
		this.x = app.renderer.width / 2;
		this.y = (this.height / 2 + 40);
		let idealWidth = Math.round(app.renderer.width / 4);
		this.scale.set(idealWidth / this.width);
		this.healthBar = new HealthBar(20);
		this.bombPool = new BombPool(10, this);
		this.shootingMode = false;
		this.elapsedTime = 0;

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

	shootBomb(special) {
		this.tint = 0xFF0000; // turn the main ship red while shooting
		this.shootingMode = true;
		this.bomb = this.bombPool.allocateBomb();
		this.bomb.resetBomb(this.x, this.y, game.enemyShip.x, game.enemyShip.y, 1.5, true, special, this);
	}

	move() {
		if (this.shootingMode) {
			this.elapsedTime += app.ticker.elapsedMS;

			if (this.elapsedTime > 1000) {
				this.tint = 0xFFFFFF; // remove tint effect
				this.elapsedTime = 0;
				this.shootingMode = false;
			}
		}
		for (let i = 0; i < this.bombPool.bombList.length; i++) {
			if (this.bombPool.bombList[i].visible) {
				this.bombPool.bombList[i].moveReverse();
			}
		}
	}

	resize() {
		this.x = app.renderer.width / 2;
		this.healthBar.resize();
	}
}
