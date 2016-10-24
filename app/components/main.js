'use strict';
// Polyfills
import 'babel-polyfill';
import 'isomorphic-fetch';
import promise from 'es6-promise';
promise.polyfill();
// Modules
import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
//Components
import App from './App';

const rootEl = document.getElementById('content');

ReactDOM.render(
    <AppContainer>
        <App />
    </AppContainer>,
    rootEl
);

/* The new hot reloading will throw the warning:
 * [react-router] You cannot change <Router routes>; it will be ignored
 * It doesn't affect realoading, so in the meantime, ignore it
 * https://github.com/gaearon/react-hot-loader/issues/298
 */
if (module.hot) {
    module.hot.accept('./App', () => {
        // If you use Webpack 2 in ES modules mode, you can
        // use <App /> here rather than require() a <NextApp />.
        const NextApp = require('./App').default;
        ReactDOM.render(
            <AppContainer>
                <NextApp />
            </AppContainer>,
            rootEl
        );
    });
}
