/* eslint-env browser */

import { assert } from 'chai';

const isBrowser = typeof window !== 'undefined'; // Good Enough™ for these tests

function assertIsCanvas(canvas, message) {
	if (isBrowser) {
		assert.instanceOf(canvas, HTMLElement, message);
	} else {
		assert.equal(canvas.constructor.name, 'Canvas', message);
	}
}

function assertIsWrappedPattern(obj) {
	assertIsCanvas(obj.canvas, 'canvas is not a canvas');

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

export { isBrowser, assertIsWrappedPattern };
