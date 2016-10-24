'use strict';
// Modules
import React from 'react';

class NavigationItem extends React.Component {
    render() {
        const iconNavigationItem = `-m-h-2 ${this.props.icon}`;

        // Styles
        const containerNavigationItemStyles = {
            verticalAlign: 'middle'
        };
        const iconNavigationItemStyles = {
            color: '#FFF'
        };

        return (
            <div style={ containerNavigationItemStyles } className="-cursor--pointer -inline-block" onClick={ this.props.onClick }>
                <a style={ this.props.level === 'header' ? iconNavigationItemStyles : {} } className={ iconNavigationItem } src={ this.props.src } />
                <span>{ this.props.value }</span>
            </div>
        );
    }
}

export default NavigationItem;
