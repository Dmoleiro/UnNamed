'use strict';
/*global PIXI*/
/*global app*/

class Cloud extends PIXI.Sprite{
	constructor() {

		//super(PIXI.Texture.fromImage('cloud.png'));
		super(PIXI.loader.resources.cloud.texture);

		this.anchor.set(0.5);
		this.x = Math.round(Math.random() * app.renderer.width);
		this.y = this.height * -1;
		this.speedPerMS = 0.1;
		this.scale.set(0.2);

		app.stage.addChild(this);
	}

	move() {
		if (this.visible) {
			this.y += (this.speedPerMS * app.ticker.elapsedMS);

			if (this.y > app.renderer.height + this.height) {
				this.y = this.height * -1;
				this.x = Math.round(Math.random() * app.renderer.width);
				this.scale.set((Math.random() * 0.4) + 0.1);
			}
		}
	}
}
