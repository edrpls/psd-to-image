'use strict';
// Modules
import React from 'react';
// Stores
import PsdStore from 'stores/PsdStore';
// Actions
import PsdActions from 'actions/PsdActions';
// Components
import Header from '../common/Header';
import NoPsds from './NoPsds';
import PsdCard from './PsdCard';

class Dashboard extends React.Component {

    constructor() {
        super();
        this.state = PsdStore.getState();
    }

    componentDidMount() {
        PsdStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        PsdStore.removeChangeListener(this._onChange);
    }

    _onChange = (newState) => {
        this.setState(newState);
    }

    render() {
        const { psd } = this.state;
        return (
            <div className="Dashboard ab-has-page-header">
                <Header pageTitle="PSD Files" />
                <div className="gds-slide-content">
                    <div className="gds-layout__container">
                        <div className='gds-layout__row'>
                            <div className="gds-layout__column--xl-12 gds-layout__column--md-4">
                            <NoPsds />
                            { psd ? < PsdCard psd={psd} /> : null }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
