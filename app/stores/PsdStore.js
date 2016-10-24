import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import PsdConstants from '../constants/PsdConstants';
// Helpers
import * as http from '../helpers/http';

let _state = {
    psd: null,
    message: '',
    creating: false,
    caveats: [
        'Only visible layers will be exported to image',
        'The total number of visible layers must not exceed 50',
        'Fonts, Effects, blend modes and shapes must be rasterized or won\'t show up',
        'Layers inside the first level of groups will be merged into a single image'
    ]
};

const _errorToMessage = err => _state.message = err.toString();

const _createPsd = function (query) {
    if (_state.creating !== false) return;
    _state.creating = true;
    const { fileName, file, after } = query;
    const data = new FormData();
    data.append('fileName', fileName);
    data.append('file', file);
    return http.post('/psd', data)
        .then(response => {
            if (response.error) throw new Error(response.error);
            _state.creating = false;
            _state.psd = response.psd;
            after && after();
        })
        .catch(err => {
            after && after();
            alert(err)
            return _errorToMessage(err);
        });
};

class PsdStore extends Store {
    constructor() {
        super();
    }

    getState() {
        return _state;
    }
}

let psdStoreInstance = new PsdStore();

psdStoreInstance.dispatchToken = AppDispatcher.register(async function (action) {

    switch (action.actionType) {
        case PsdConstants.CREATE_PSD:
            await _createPsd(action.query);
            break;
    }

    psdStoreInstance.emitChange();
});

export default psdStoreInstance;
