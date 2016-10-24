'use strict';
import React from 'react';
import PsdStore from 'stores/PsdStore';
import PsdActions from 'actions/PsdActions';
import Button from '../common/Button';

class NewPsdForm  extends React.Component {
    state = {
        fileName: '',
        file: null,
        uploading: false
    }

    assignState = newState => this.setState(Object.assign({}, this.state, newState))

    componentDidMount() {
        PsdStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        PsdStore.removeChangeListener(this._onChange);
    }

    _onChange = () => {
        const newState = Object.assign({}, PsdStore.getState());
        this.setState(newState);
    }

    submit(event) {
        event.preventDefault();
        const { fileName, file } = this.state;
        if (fileName && file) {
            this.assignState({ uploading: true })
            PsdActions.createPsd({
                file,
                fileName,
                after: this.props.close
            });
        }
    }

    handleNameEdit(e) {
        this.assignState({ fileName: e.target.value });
    }

    handleFileSelection(e) {
        const file = e.target.files[0];
        const rename = name => name
            .replace(/(_|-)/g, ' ')
            .replace('.psd', '');
        if (file) {
            const fileName = rename(file.name);
            this.assignState({
                file,
                fileName
            });
        }
    }

    render() {
        const { fileName, file, uploading } = this.state;
        const showNext = file ? true : false;
        const isDisabled = uploading ? 'disabled' : false;
        const baseButton = `sm block ${ uploading ? 'default' : 'success' }`;
        return (
            <form
                onSubmit={e => this.submit(e) }
                className="NewPsdForm form">
                <label className="gds-form-group__label">Upload a PSD file</label>
                <fieldset disabled={ isDisabled } style={ {border: 'none'} }>
                    <label className="gds-form-group__file">
                        <input
                            className="gds-form-group__file-input"
                            type="file"
                            name="file"
                            accept="image/vnd.adobe.photoshop"
                            onChange={ e => this.handleFileSelection(e) }
                        />
                        <span className="gds-form-group__file-indicator" data-button-label="Browse" data-input-label="Upload a PSD file"></span>
                    </label>
                    { showNext && (<div>
                        <div className="gds-form-group">
                            <label className="gds-form-group__label">File name</label>
                            <input
                                onChange={ e => this.handleNameEdit(e) }
                                className="gds-form-group__text-input"
                                type="text"
                                placeholder="Name"
                                value={ fileName }
                            />
                        </div>
                        <Button action="submit"
                            mods={ baseButton }
                            text={ uploading ? '...Uploading' : 'Upload' }
                            icon="upload" />
                    </div>) }
                </fieldset>
            </form>
        );
    }
}

export default NewPsdForm;
