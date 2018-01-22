/* eslint-env mocha */
/* eslint-env browser */

const isBrowser = typeof window !== 'undefined'; // Good Enough™ for these tests
const griptape = isBrowser ? window.griptape : require('../dist/griptape.js');
const assert = isBrowser ? window.chai.assert : require('chai').assert;

function assertIsCanvas(canvas, message) {
	if (isBrowser) {
		assert.instanceOf(canvas, HTMLElement, message);
	} else {
		assert.equal(canvas.constructor.name, 'Canvas', message);
	}
}

let configuredGriptape;
let patternObjs;
describe('built griptape', () => {
	before(() => {
		configuredGriptape = griptape({ foreground: '#f00' });
		patternObjs = Object.keys(configuredGriptape).map(key => configuredGriptape[key]());
	});

	after(() => {
		patternObjs = undefined;
	});

	it('is a function', () => {
		assert.isFunction(griptape);
	});

	it('returns a new instance of itself', () => {
		assert.sameMembers(
			Object.keys(configuredGriptape),
			Object.keys(griptape),
		);
	});

	it('has multiple patterns', () => {
		assert.isAbove(patternObjs.length, 3);
	});

	it('patterns have canvas', () => {
		patternObjs.forEach(pattern => {
			assertIsCanvas(pattern.canvas, 'canvas is not a canvas');
		});
	});

	it('patterns have data URL function', () => {
		patternObjs.forEach(pattern => {
			assert.isFunction(pattern.toDataURL, 'data URL function is not a function');
			assert.isString(pattern.toDataURL(), 'data URL is not a string');
			assert(
				pattern.toDataURL().match(/data:image\/png;base64/, pattern.toDataURL()),
				'data URL is invalid',
			);
		});
	});

	it('patterns have CSS URL function', () => {
		patternObjs.forEach(pattern => {
			assert.isFunction(pattern.toCSSURL, 'CSS URL function is not a function');
			assert.isString(pattern.toCSSURL(), 'CSS URL is not a string');
			assert.match(pattern.toCSSURL(), /url\('data:image\/png;base64/, 'CSS URL is invalid');
		});
	});
});
