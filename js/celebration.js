'use strict';
/*global PIXI*/
/*global app*/
/*global game*/

class Celebration extends PIXI.Sprite{
	constructor(texture) {
		super(texture);

		this.anchor.set(0.5);
		this.visible = false;
		this.x = app.renderer.width / 2;
		this.y = app.renderer.height / 2;
		this.timeElapsed = 0;

		app.stage.addChild(this);
	}

	_resetCelebration() {
		this.scale.set(0.1);
		this.x = Math.round(Math.random() * app.renderer.width);
		this.y = Math.round(Math.random() * app.renderer.height);
	}

	setVisible(visible) {
		this.visible = visible;
	}

	startCelebration() {
		this.timeElapsed = 0;
		this.setVisible(true);
		this._resetCelebration();
	}

	stopCelebration() {
		this.timeElapsed = 0;
		this.setVisible(false);
		game.isCelebrating = false;
	}

	move() {
		if (this.visible) {
			this.timeElapsed += app.ticker.elapsedMS;

			if (this.timeElapsed < 7000) {
				if (this.scale.x < 1) {
					this.scale.set(this.scale.x + 0.1);
				} else {
					this._resetCelebration();
				}
			} else {
				this.stopCelebration();
			}
		}
	}

}
