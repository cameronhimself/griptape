/* eslint-env mocha */

import { assert } from 'chai';
import Canvas from 'canvas'; // eslint-disable-line import/extensions
import patterns from '../src/patterns';


function assertIsValidCanvas(canvas) {
	assert.equal(canvas.constructor, Canvas, 'canvas is not a canvas');
	assert.isAbove(canvas.width, 0, 'canvas has no width');
	assert.isAbove(canvas.height, 0, 'canvas has no height');
}

let patternObjs;
describe('all patterns', () => {
	before(() => {
		patternObjs = Object.keys(patterns).map(key => patterns[key]({
			foreground: () => '#0f0',
			background: () => '#f00',
		}));
	});

	after(() => {
		patternObjs = undefined;
	});

	it('return a valid canvas with defaults', () => {
		patternObjs.forEach(canvas => {
			assertIsValidCanvas(canvas);
		});
	});
});

describe('object with canvas key as background/foreground', () => {
	it('returns a canvas', () => {
		assertIsValidCanvas(patterns.dots({
			foreground: { canvas: patterns.dots() },
			background: { canvas: patterns.stripes() },
		}));
	});
});

describe('canvas as background/foreground', () => {
	it('returns a canvas', () => {
		assertIsValidCanvas(patterns.dots({
			foreground: patterns.dots(),
			background: patterns.stripes(),
		}));
	});
});

describe('invalid value as background/foreground', () => {
	it('returns a canvas', () => {
		assertIsValidCanvas(patterns.dots({
			foreground: 'bad',
			background: NaN,
		}));
	});
});

describe('dots pattern', () => {
	it('returns a canvas for square shape', () => {
		assertIsValidCanvas(patterns.dots({ shape: 'square' }));
	});

	it('returns a canvas for circle shape', () => {
		assertIsValidCanvas(patterns.dots({ shape: 'circle' }));
	});

	it('returns a canvas for square pattern', () => {
		assertIsValidCanvas(patterns.dots({ pattern: 'square' }));
	});

	it('returns a canvas for diamond pattern', () => {
		assertIsValidCanvas(patterns.dots({ pattern: 'diamond' }));
	});
});

describe('grid pattern', () => {
	it('returns a canvas for diamond shape', () => {
		assertIsValidCanvas(patterns.grid({ shape: 'diamond' }));
	});
});

describe('noise pattern', () => {
	it('returns a canvas for low density', () => {
		assertIsValidCanvas(patterns.noise({ density: 0.1, size: 5 }));
	});

	it('returns a canvas for negative density', () => {
		assertIsValidCanvas(patterns.noise({ density: -5, size: 5 }));
	});

	it('returns a canvas for excessive density', () => {
		assertIsValidCanvas(patterns.noise({ density: 5, size: 5 }));
	});

	it('returns a canvas with custom randomizer', () => {
		assertIsValidCanvas(patterns.noise({ randomizer: Math.random, size: 5 }));
	});
});

describe('stripes pattern', () => {
	it('returns a canvas for horizontal orientation', () => {
		assertIsValidCanvas(patterns.stripes({ orientation: 'horizontal' }));
	});

	it('returns a canvas for vertical orientation', () => {
		assertIsValidCanvas(patterns.stripes({ orientation: 'vertical' }));
	});
});
