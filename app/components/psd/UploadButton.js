'use strict';

import React from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import NewPsdForm from './NewPsdForm';
import CaveatsList from './CaveatsList';

class UploadButton extends React.Component {

    state = {
        isShowingModal: false
    }

    handleClick = () => this.setState({ isShowingModal: true })

    handleClose = () => this.setState({ isShowingModal: false })

    componentWillReceiveProps(props) {
        if (props.created) this.handleClose();
    }

    render() {
        const message = this.props.message || 'Import';
        return (
            <div className="-inline-block">
                <button onClick={ this.handleClick } className="gds-button gds-button--warning gds-button--sm">
                    <span className="fa fa-upload"></span>
                    { ` ${message}`}
                </button>
                { this.state.isShowingModal && (
                    <ModalContainer>
                        <ModalDialog onClose={ this.handleClose }>
                            <p className="gds-text--header-sm -m-b-2">Export PSD layers as PNG</p>
                            <CaveatsList />
                            <NewPsdForm close={ this.handleClose } />
                        </ModalDialog>
                    </ModalContainer>
                ) }
            </div>
        );
    }
}

export default UploadButton;
