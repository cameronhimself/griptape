import extend from 'extend';
import patterns from './patterns';
import patternWrapper from './patternWrapper';

function injectPatterns(patternsArg, baseOpts) {
	return Object.keys(patternsArg).reduce((acc, patternKey) => {
		acc[patternKey] = opts => patternsArg[patternKey](extend({}, baseOpts, opts));
		return acc;
	}, {});
}

function makeGriptape(patternsArg) {
	const griptape = baseOpts => makeGriptape(injectPatterns(patternsArg, baseOpts));
	Object.keys(patternsArg).forEach(patternKey => {
		griptape[patternKey] = opts => patternWrapper({
			canvas: patternsArg[patternKey](opts),
			patterns: patternsArg,
		});
	});
	return griptape;
}

export default makeGriptape(patterns);
