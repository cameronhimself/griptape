/* eslint-env browser */

export default function createCanvas(width, height) {
	const canvasEl = document.createElement('canvas');
	canvasEl.width = width;
	canvasEl.height = height;
	return canvasEl;
}
