const path = require('path');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const srcPath = path.resolve(__dirname, 'src');

const baseConfig = {
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '',
		library: 'griptape',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env'],
					},
				},
			},
		],
	},
};

const serverConfig = merge(baseConfig, {
	entry: path.resolve(srcPath, 'griptape.js'),
	target: 'node',
	externals: [nodeExternals()],
	output: {
		filename: 'griptape.node.js',
		libraryTarget: 'umd',
	},
	module: {
		rules: [
			{
				test: /\.node$/,
				use: 'node-loader',
			},
		],
	},
	resolve: {
		extensions: ['.node', '.js'],
		alias: { createCanvas: path.resolve(srcPath, 'createCanvasServer.js') },
	},
});

const browserConfig = merge(baseConfig, {
	entry: [path.resolve(srcPath, 'polyfills.js'), path.resolve(srcPath, 'griptape.js')],
	output: {
		filename: 'griptape.js',
		libraryExport: 'default',
		libraryTarget: 'window',
	},
	resolve: {
		alias: { createCanvas: path.resolve(srcPath, 'createCanvasBrowser.js') },
	},
});

const minConfig = merge(browserConfig, {
	output: { filename: 'griptape.min.js' },
	plugins: [new UglifyJsPlugin()],
});

module.exports = [serverConfig, browserConfig, minConfig];
