'use strict';

class Utils {
	constructor() {
		// nothing to do here
	}

	addInput(left, top, width) {
		var input = document.createElement('input');
		input.type = 'text';
		input.style.position = 'fixed';
		input.style.left = left + 'px';
		input.style.top = top + 'px';
		input.style.width = width + 'px';
		input.style.textAlign = 'center';
		input.style.visibility = 'hidden';
		document.body.appendChild(input);
		input.focus();

		return input;
	}

	getDistancePerMS(initial, final, durationMS) {
		return (final - initial) / durationMS;
	}
}
