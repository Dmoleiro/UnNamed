'use strict';
/*global PIXI*/
/*global app*/

class HealthBar {
	constructor(y) {
		this.healthScore = 100;

		// this.healthBarFrame = new PIXI.Sprite(PIXI.Texture.fromImage('healthFrame.png'));
		this.healthBarFrame = new PIXI.Sprite(PIXI.loader.resources.healthFrame.texture);

		this.healthBarFrame.x = app.renderer.width - 112;
		this.healthBarFrame.y = y;
		this.healthBarFrame.visible = false;

		// this.healthBar = new PIXI.Sprite(PIXI.Texture.fromImage('healthBar.png'));
		this.healthBar = new PIXI.Sprite(PIXI.loader.resources.healthBar.texture);

		this.healthBar.x = app.renderer.width - 110;
		this.healthBar.y = y + 2;
		this.healthBar.visible = false;

		this.healthMask = new PIXI.Graphics();
		this._resetMask();
		this.healthBar.mask = this.healthMask;

		app.stage.addChild(this.healthBar);
		app.stage.addChild(this.healthMask);
		app.stage.addChild(this.healthBarFrame);
	}

	_resetMask() {
		this.healthMask.position.x = this.healthBar.x;
		this.healthMask.position.y = this.healthBar.y;
		this.healthMask.lineStyle(0);
		this.healthMask.clear();
		this.healthMask.beginFill(0xFF0000, 1);
		this.healthMask.moveTo(0, 0);

		this.healthMask.lineTo(this.healthBar.width, 0);
		this.healthMask.lineTo(this.healthBar.width, this.healthBar.height);
		this.healthMask.lineTo(0, this.healthBar.height);
		this.healthMask.lineTo(0, 0);
	}

	removeHealth(value) {
		if (this.healthScore >= value) {
			this.healthMask.position.x -= value;
			this.healthScore -= value;
		} else if (this.healthScore > 0) {
			this.healthMask.position.x -= this.healthScore;
			this.healthScore = 0;
		}
	}

	addHealth(value) {
		if (this.healthScore < 100) {
			if (this.healthScore + value > 100) {
				this.healthMask.position.x += (value - (100 - this.healthScore));
				this.healthScore = 100;
			} else {
				this.healthMask.position.x += value;
				this.healthScore += value;
			}
		}
	}

	resetHealthBar() {
		this.healthScore = 100;
		this._resetMask();
	}

	setVisible(visible) {
		this.healthBarFrame.visible = visible;
		this.healthBar.visible = visible;
	}

	resize() {
		this.healthBarFrame.x = app.renderer.width - 112;
		this.healthBar.x = app.renderer.width - 110;

		this.healthMask.position.x = this.healthBar.x;
		if (this.healthScore < 100) {
			this.healthMask.position.x -= (100 - this.healthScore);
		}
	}
}
