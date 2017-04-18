'use strict';
/*global PIXI*/
/*global app*/
/*global game*/
/*global Utils*/

var utils = new Utils();

class Bomb extends PIXI.Sprite{
	constructor(texture) {
		super(texture);
		this.scale.set(1);
		this.anchor.set(0.5);
		this.durationMS = Math.round((Math.random() * 500) + 1500); // between 100 and 400
		this.timeElapsed = 0;
		this.originX = 0;
		this.originY = 0;
		this.targetX = 0;
		this.targetY = 0;
		this.xDistancePerMS = 0;
		this.yDistancePerMS = 0;
		this.visible = false;
		this.explode = false;
		this.destroyed = false;
		this.interactive = true;
		this.reverse = false;
		this.special = false;

		this.speedMultiplier = 1;

		this.on('pointerdown', function() {
			// only the enemy bombs can be destroyed
			if (!this.reverse) {
				//this.texture = PIXI.Texture.fromImage('bomb.png');
				this.texture = PIXI.loader.resources.bomb.texture;

				this.scale.set(0.1);
				this.explode = true;
				this.destroyed = true;
				this.interactive = false;
				this.owner.destroyedBombCount ++;
				game.addPlayerScore(100);
				game.mainShipCounterAttack();
			}
		});

		this.owner = undefined;
		this.timeElapsed = 0;

		app.stage.addChild(this);
	}

	move() {
		if (this.visible) {
			if (this.explode) {
				if (this.scale.x < 1) {
					this.scale.set(this.scale.x + 0.05);
				}else {
					this.visible = false;
					this.explode = false;
					this.scale.set(1);
					this.interactive = true;

					// this bomb is gone, make the parent shoot another one
					this.owner.shootBomb();
				}
				if (this.destroyed) {
					this.destroyed = false;
				}
			}else {
				this.x += (this.xDistancePerMS * app.ticker.elapsedMS);
				this.y += (this.yDistancePerMS * app.ticker.elapsedMS);

				if (this.y < this.targetY) {

					//this.texture = PIXI.Texture.fromImage('bomb.png');
					this.texture = PIXI.loader.resources.bomb.texture;

					this.scale.set(0.1);
					this.explode = true;
					this.owner.destroyedBombCount = 0;

					if (this.x > (app.renderer.width / 2) - (game.mainShip.width / 2) && this.x < (app.renderer.width / 2) + (game.mainShip.width / 2)) {
						game.subtractPlayerScore(100);
					}
				}
			}
		}
	}

	moveReverse() {
		if (this.visible) {
			this.timeElapsed += app.ticker.elapsedMS;
			if (this.explode) {
				if (this.scale.x < 1) {
					this.scale.set(this.scale.x + 0.05);
				}else {
					this.visible = false;
					this.explode = false;
					this.scale.set(1);
					this.interactive = true;
				}
				if (this.destroyed) {
					this.destroyed = false;
				}
			}else {
				this.xDistancePerMS = utils.getDistancePerMS(this.x, game.enemyShip.x, this.durationMS);
				this.yDistancePerMS = utils.getDistancePerMS(this.y, game.enemyShip.y, this.durationMS);

				this.x += (this.xDistancePerMS * app.ticker.elapsedMS);
				this.y += (this.yDistancePerMS * app.ticker.elapsedMS);

				this.rotation += 0.5; // rotate the bomb

				if (this.y > (game.enemyShip.y - game.enemyShip.height / 2) &&  this.x > (game.enemyShip.x - 5) &&  this.x < (game.enemyShip.x + 5)) {

					//this.texture = PIXI.Texture.fromImage('bomb.png');
					this.texture = PIXI.loader.resources.bomb.texture;

					this.scale.set(0.1);
					this.explode = true;
					if (this.special) {
						// special rockets do more damage
						game.substractEnemyScore(20);
					} else {
						game.substractEnemyScore(5);
					}
				}
			}
		}
	}

	resetBomb(originX, originY, targetX, targetY, speedMultiplier, reverse, special, owner) {
		this.timeElapsed = 0;
		this.x = originX;
		this.y = originY;
		this.originX = originX;
		this.originY = originY;
		this.targetX = targetX;
		this.targetY = targetY;
		this.explode = false;
		this.destroyed = false;
		this.visible = true;
		this.scale.set(1);
		this.interactive = true;
		this.speedMultiplier = speedMultiplier;
		this.reverse = reverse;
		this.special = special;
		this.timeElapsed = 0;

		if (reverse) {
			this.rotate = Math.PI / 2;
			this.xDistancePerMS = 0.1;
			this.yDistancePerMS = 0.1;

			if (special) {
				//this.texture = PIXI.Texture.fromImage('mine2.png');
				this.texture = PIXI.loader.resources.mine2.texture;

			} else {
				//this.texture = PIXI.Texture.fromImage('mine1.png');
				this.texture = PIXI.loader.resources.mine1.texture;
			}
		}else {
			this.rotate = 0;
			this.xDistancePerMS = utils.getDistancePerMS(originX, targetX, this.durationMS) * speedMultiplier;
			this.yDistancePerMS = utils.getDistancePerMS(originY, targetY, this.durationMS) * speedMultiplier;

			//this.texture = PIXI.Texture.fromImage('lrocket.png');
			this.texture = PIXI.loader.resources.lrocket.texture;
		}
		this.owner = owner;
	}
}
