import moment from 'moment';

/*
 * Print a sumo-logic compatible message on the forever log.
 * e.g.
 * 2016-07-25T11:04:37-07:00 [INFO] Some message.
 * 2016-07-25T11:04:39-50:00 [INFO] Etc
 * */
function logger(level) {
    return message => console.log(
        moment().format(),
        level,
        JSON.stringify(message)
    );
}

module.exports = {
    debug: logger('DEBUG'),
    info: logger('INFO'),
    error: logger('ERROR'),
    custom: logger
};
