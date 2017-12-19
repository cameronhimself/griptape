const path = require('path');
const nodeExternals = require('webpack-node-externals');

const isCoverage = process.env.NODE_ENV === 'coverage';

const rules = isCoverage ? [{
	test: /\.(js)/,
	include: path.resolve('src'),
	use: {
		loader: 'istanbul-instrumenter-loader',
		query: { esModules: true },
	},
}] : [];

module.exports = {
	target: 'node',
	output: {
		devtoolModuleFilenameTemplate: '[absolute-resource-path]',
		devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
	},
	module: {
		rules,
	},
	externals: [nodeExternals()],
	devtool: 'inline-cheap-module-source-map',
	resolve: {
		extensions: ['.node', '.js'],
		alias: { createCanvas: path.resolve(__dirname, 'src', 'createCanvasServer.js') },
	},
};
