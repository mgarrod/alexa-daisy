
'use strict';
var DaisyStatus = require('./daisyStatus');

exports.handler = function (event, context) {
    var daisyStatus = new DaisyStatus();
    daisyStatus.execute(event, context);
};
