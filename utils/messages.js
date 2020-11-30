const moment = require('moment');
// moment.js: Time-and-Date javaScript library
// https://github.com/moment

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
};


module.exports = formatMessage;
