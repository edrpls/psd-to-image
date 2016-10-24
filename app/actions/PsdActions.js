import PsdConstants from '../constants/PsdConstants';
import AppDispatcher from '../dispatcher/AppDispatcher';

const PsdActions = {
    createPsd(query) {
        AppDispatcher.dispatch({
            actionType: PsdConstants.CREATE_PSD,
            query: query
        });
    }
};

export default PsdActions;
