/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */
'use strict';
const webpack = require('webpack');
const OpenBrowser = require('open-browser-webpack-plugin');

module.exports = {

    output: {
        path: '/',
        filename: 'main.js',
        publicPath: '/assets/'
    },

    cache: true,
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://0.0.0.0:8001', // WebpackDevServer host and port
        'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
        './app/components/main.js'
    ],
    target: 'web',
    node: {
        net: 'empty',
        dns: 'empty'
    },

    devServer: {
        contentBase: './app/',
        publicPath: '/assets/',
        hot: true,
        proxy: {
            '/api*': {
                target: 'http://0.0.0.0:3000',
                secure: false
            }
        },
        lazy: false,
        watchOptions: {
            aggregateTimeout: 300,
            poll: true
        },
        stats: {
            colors: true
        }
    },

    stats: {
        colors: true,
        reasons: true
    },

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
                plugins: [
                    'react-hot-loader/babel',
                    'lodash',
                    ['transform-runtime', {'polyfill': false}]
                ]
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
            loader: 'style-loader!css-loader'
        }, {
            test: /\.(png|jpg|woff|woff2)$/,
            loader: 'url-loader?limit=8192'
        }]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({ GA: false }), //react constants
        new OpenBrowser({ url: 'http://0.0.0.0:8000/webpack-dev-server/' })
    ]

};
