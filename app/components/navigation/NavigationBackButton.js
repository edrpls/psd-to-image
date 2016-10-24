'use strict';
// Modules
import React from 'react';
import { Link } from 'react-router';
// Actions
import BuilderActions from 'actions/BuilderActions';

class NavigationBackButton extends React.Component {
    render() {
        const { route } = this.props;
        let link = '/dashboard';
        let adminLink;
        if (route && ~route.indexOf('/admin')) {
            adminLink = route.split('/');
            adminLink = adminLink
                .filter((p, i) => i < adminLink.length - 1)
                .join('/');
            link = adminLink !== '' ? adminLink : link;
        }

        // Styles
        const linkNavigationBackButtonStyles = {
            float: 'left',
            width: '24px',
            height: '24px',
            marginRight: '24px',
            borderRadius: '50%',
            boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.26)',
            background: '#FFF',
            color: 'grey',
            textAlign: 'center',
            paddingTop: '4px'
        };
        return (
            <div>
                <Link to={ link } style={ linkNavigationBackButtonStyles } className="fa fa-arrow-left"></Link>
            </div>
        );
    }
}

export default NavigationBackButton;
