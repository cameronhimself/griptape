module.exports = function karmaConfig(config) {
	config.set({
		basePath: '',
		frameworks: ['mocha', 'chai'],
		files: [
			'dist/griptape.js',
			'test/dist.spec.js',
		],
		exclude: [],
		preprocessors: {
			'test/dist.spec.js': ['babel'],
		},
		webpack: {
		},
		reporters: ['mocha'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['PhantomJS'],
		singleRun: false,
		concurrency: Infinity,
	});
};
