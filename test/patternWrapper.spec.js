/* eslint-env mocha */

import { assert } from 'chai';
import Canvas from 'canvas';
import createCanvas from 'createCanvas';
import patternWrapper from '../src/patternWrapper';

let patterns = null;
let wrapped = null;

function assertIsWrappedPattern(obj) {
	assert.equal(obj.canvas.constructor, Canvas, 'canvas is not a canvas');

	assert.isFunction(obj.toDataURL, 'data URL function is not a function');
	assert.isString(obj.toDataURL(), 'data URL is not a string');
	assert(
		obj.toDataURL().match(/data:image\/png;base64/, obj.toDataURL()),
		'data URL is invalid',
	);

	assert.isFunction(obj.toCSSURL, 'CSS URL function is not a function');
	assert.isString(obj.toCSSURL(), 'CSS URL is not a string');
	assert.match(obj.toCSSURL(), /url\("data:image\/png;base64/, 'CSS URL is invalid');
}

describe('patternWrapper', () => {
	before(() => {
		patterns = { one: () => createCanvas(10, 10), two: () => createCanvas(10, 10) };
		wrapped = patternWrapper({ canvas: patterns.one(), patterns });
	});

	after(() => {
		patterns = null;
		wrapped = null;
	});

	it('returns a wrapped pattern', () => {
		assertIsWrappedPattern(wrapped);
	});

	it('has fluent layering', () => {
		assert.isFunction(wrapped.one, 'does not contain itself for layering');
		assert.isFunction(wrapped.two, 'does not contain other functions for layering');
		assertIsWrappedPattern(wrapped.one());
		assertIsWrappedPattern(wrapped.one().two());
	});
});
