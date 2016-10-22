/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const bundleRename = function () {
    this.plugin('done', function (stats) {
        var fs = require('fs'),
            path = require('path');
        if (stats.compilation.errors && stats.compilation.errors.length) {
            console.log(stats.compilation.errors);
            process.exit(1);
        } else {
            var targetFile = path.join(__dirname, 'dist', 'index.html'),
                content = fs.readFileSync(targetFile, 'utf8'),
                scriptName = stats.compilation.namedChunks.main.files[0],
                htmlOutput = content.replace(/main.js/g, scriptName);
            fs.writeFileSync(targetFile, htmlOutput);
        }
    });
};

module.exports = {

    output: {
        path: 'dist/assets/',
        publicPath: '/assets/',
        filename: '[chunkhash].main.js'
    },

    cache: false,
    debug: true,

    entry: [
        './app/components/main.js'
    ],

    node: {
        net: 'empty',
        dns: 'empty'
    },

    stats: false,
    progress: false,

    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
            'styles': __dirname + '/app/styles',
            'mixins': __dirname + '/app/mixins',
            'components': __dirname + '/app/components/',
            'stores': __dirname + '/app/stores/',
            'actions': __dirname + '/app/actions/'
        }
    },
    module: {
        preLoaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ['eslint-loader']
        }],
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react', 'stage-0'],
                plugins: ['lodash', ['transform-runtime', {'polyfill': false}]]
            }
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.(png|woff|woff2|eot|ttf|svg|gif)([\?]?.*)$/,
            loader: 'file-loader'
        }, {
            test: /\.scss/,
            loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
        }, {
            test: /\.css/,
            exclude: /styles\/design_system/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.(png|jpg|woff|woff2)$/,
            loader: 'url-loader?limit=8192'
        }]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),
        new CopyWebpackPlugin([
            {
                from: 'app/*',
                to: '../',
                flatten: true
            }, {
                from: 'app/images',
                to: '../images',
                flatten: true
            }, {
                from: 'app/styles/design_system',
                to: '../styles/design_system',
                flatten: true
            }
        ]),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({GA: true}),
        bundleRename
    ]
};
