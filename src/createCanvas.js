/* eslint-env browser */

import isNode from 'is-node';
import Canvas from 'canvas'; // eslint-disable-line import/extensions

export default function createCanvas(width, height) {
	if (isNode) {
		return new Canvas(width, height);
	}
	const canvasEl = document.createElement('canvas');
	canvasEl.width = width;
	canvasEl.height = height;
	return canvasEl;
}
