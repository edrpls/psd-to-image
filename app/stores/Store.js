import EventEmitter from 'events';

const CHANGE_EVENT = 'change';


class Store extends EventEmitter {

    constructor() {
        super();
        this.setMaxListeners(0);
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

Store.dispatchToken = null;

export default Store;
