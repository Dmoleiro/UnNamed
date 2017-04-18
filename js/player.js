'use strict';

class Player {
	constructor(nickName, highscore) {
		this.nickName = nickName;
		this.highscore = highscore;
		this.score = 0; // score always starts at 0

		if (this.highscore < this.score) {
			this.highscore = this.score;
		}

		this.health = 100;
	}

	addPlayerScore(value) {
		this.score += value;
		if (this.highscore < this.score) {
			this.highscore = this.score;
		}
	}

	subtractPlayerScore(value) {
		if ((this.score - value) >= 0) {
			this.score -= value;
		}else {
			this.score = 0;
		}
	}
}
