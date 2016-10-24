'use strict';
// Modules
import React from 'react';
// CSS
import 'styles/common/DSOverrides.scss';

class Header extends React.Component {
    render() {
        return (
            <header className="gds-page-header">
                <div className="gds-page-header__product-bar">
                    <div className="gds-layout__row">
                        <div className="gds-layout__column--xl-3 gds-layout__column--md-3">
                            <h6 className="gds-page-header__product-name">GumGum PSD Export Tool</h6>
                        </div>
                        <div className="gds-layout__column--xl-5 gds-layout__column--md-6 -text-center">
                            <p className="gds-page-header__page-name gds-text__header--small">{ this.props.pageTitle }</p>
                        </div>
                        <div className="gds-layout__column--xl-4 gds-layout__column--md-3">
                            <a href="http://gumgum.com" target="_blank"><img className="gds-page-header__logo" src="https://ds.gumgum.com/images/svg/logo-white.svg"/></a>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
