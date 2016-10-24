import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
// Components
import Dashboard from './psd/Dashboard';

if (GA) {
    browserHistory.listen(location =>
        window.ga('send', 'pageview', { page: location.pathname }));
}

const App = () => (
    <Router history={ browserHistory }>
        <Route path="/" component={ Dashboard } />
    </Router>
);

export default App;
