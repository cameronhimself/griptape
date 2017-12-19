/* eslint import/no-extraneous-dependencies: ["error", {"optionalDependencies": true}] */
import Canvas from 'canvas';

export default function createCanvas(width, height) {
	return new Canvas(width, height);
}
