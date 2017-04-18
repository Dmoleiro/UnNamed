'use strict';
/*global PIXI*/
/*global Bomb*/

class BombPool {
	constructor(totalBombs) {
		this.bombList = [];

		for (let i = 0; i < totalBombs; i++) {
			//let b = new Bomb(PIXI.Texture.fromImage('bomb.png'));
			let b = new Bomb(PIXI.loader.resources.bomb.texture);
			this.bombList.push(b);
		}
		this.lastIdx = 0;
	}

	allocateBomb() {
		if (!this.bombList[this.lastIdx].visible) {
			var b = this.bombList[this.lastIdx];
			this.lastIdx++;

			if (this.lastIdx > (this.bombList.length - 1)) {
				this.lastIdx = 0;
			}
			b.visible = true;
			b.timeElapsed = 0;
			return b;
		}
		throw new Error('The bomb pool does not have enough bombs.');
	}
}
