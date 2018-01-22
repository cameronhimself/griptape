const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const srcPath = path.resolve(__dirname, 'src');

module.exports = {
	entry: [path.resolve(srcPath, 'polyfills.js'), path.resolve(srcPath, 'griptape.js')],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'griptape.js',
		publicPath: '',
		library: 'griptape',
		libraryExport: 'default',
		libraryTarget: 'umd',
	},
	target: 'node',
	externals: ['canvas'],
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
	devtool: '#eval-source-map',
};

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map';
	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"',
			},
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false,
			},
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
		}),
	]);
}
