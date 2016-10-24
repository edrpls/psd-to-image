'use strict';

import React from 'react';
// Actions
import AuthActions from 'actions/AuthActions';
// Stores
import AuthStore from 'stores/AuthStore';
// Components
import NavigationItem from 'components/navigation/NavigationItem';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';

// Styles
import 'styles/navigation/NavigationProfileToggle.scss';

// Helpers
import { find } from 'lodash';

class NavigationProfileToggle extends React.Component {

    _onChange = () => {
        let notifications = JSON.parse(localStorage.getItem('notifications'));
        this.setState({
            notifications,
            count: notifications.filter(n => n.unread).length,
            drawer: false
        });
    }

    componentWillMount() {
        this._onChange();
    }

    componentDidMount() {
        AuthStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        AuthStore.removeChangeListener(this._onChange);
    }

    _toggleNotifications = () => {
        if (this.state.notifications.length) {
            this.setState({
                drawer: !this.state.drawer
            });
        }
    }

    _formatMessage = () => {
        return { __html: this.state.message };
    }

    _showMessage = (id) => {
        return () => {
            let notification = find(this.state.notifications, { id }),
                message = notification && notification.message || null;
            this.setState({ message });
            this._toggleNotifications();
            if (notification.unread) {
                AuthActions.clearNotification(id);
            }
        }
    }

    _closeMessage = () => {
        this.setState({ message: null });
    }

    _logout = () => {
        AuthActions.logout();
    }

    _getTitle(n) {
        return n ?
            `You have ${n} notification${ n > 1 && 's' || '' }` :
            'You don\'t have any new notifications';
    }

    render() {
        let notificationIcon = this.state.count ? 'fa fa-bell' : 'fa fa-bell-o';
        return (
            <div className="-inline-block -float-right -m-r-4">
                <NavigationItem onClick={ this._toggleNotifications } icon={ notificationIcon } level="header" title={ this._getTitle(this.state.count) } />
                <NavigationItem onClick={ this._logout } src={ localStorage.getItem('gravatar') } level="header" value="Logout"/>
                { this.state.drawer &&
                    <div>
                        <div className="triangle"></div>
                        <ul className="NotificationDrawer">
                            { this.state.notifications.map(n => {
                                return (
                                    <li
                                        key={n.id}
                                        className={ n.unread ? 'unread' : '' }
                                        onClick={ this._showMessage(n.id) }>
                                        {n.title}
                                    </li>
                                )
                            }) }
                        </ul>
                    </div>
                }
                { this.state.message &&
                    <ModalContainer onClose={ this._closeMessage }>
                        <ModalDialog width={ 400 } onClose={ this._closeMessage }>
                            <div dangerouslySetInnerHTML={ this._formatMessage() }></div>
                        </ModalDialog>
                    </ModalContainer>
                }
            </div>
        );
    }
}

export default NavigationProfileToggle;
