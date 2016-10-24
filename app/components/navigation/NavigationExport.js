'use strict';
// Modules
import React from 'react';
// Components
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import BuilderExportContent from '../builder/BuilderExportContent';
import NavigationItem from './NavigationItem';

class NavigationExport extends React.Component {

    constructor() {
        super();
        this.state = {
            modalIsOpen: false
        };
    }

    openModal = () => {
        this.setState({modalIsOpen: true});
    }

    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    render() {
        return (
            <div className="BuilderExport -inline-block">
                <NavigationItem onClick={ this.openModal } icon="fa fa-download" level="builder" value="Export"/>
                {
                    this.state.modalIsOpen &&
                    <ModalContainer zIndex={ 14 } onClose={ this.closeModal }>
                        <ModalDialog width={ 500 } onClose={ this.closeModal }>
                            <BuilderExportContent/>
                        </ModalDialog>
                    </ModalContainer>
                }
            </div>
        );
    }
}

export default NavigationExport;
