/*
 * Webpack test build configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */
'use strict';
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {

    output: {
        path: 'test/build/',
        publicPath: '/assets/',
        filename: '[name].js'
    },
    debug: true,
    devtool: 'source-map',
    //entry: ['./app/components/main.js'],
    target: 'node',
    externals: [nodeExternals()],

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
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react', 'stage-0'],
                plugins: [
                    'lodash',
                    ['transform-runtime', {'polyfill': false}]
                ]
            }
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.(scss|css|png|woff|woff2|eot|ttf|svg|gif)([\?]?.*)$/,
            loader: 'null-loader'
        }]
    },

    plugins: [
        new webpack.DefinePlugin({ GA: false })
    ]

};
