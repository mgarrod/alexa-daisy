/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var textHelper = (function () {
    var statusGreenlist = {
        CLEAN:1,
        DIRTY:1
    };

    return {
        completeHelp: 'Here\'s some things you can say,'
        + ' the dishs are clean.'
        + ' the dishs are dirty.'
        + ' if the dishes are clean or dirty.'
        + ' what is the status of the dishes.',

        getStatusValue: function (recognizedStatus) {
            if (!recognizedStatus) {
                return undefined;
            }
            var split = recognizedStatus.indexOf(' '), newStatus;

            if (split < 0) {
                newStatus = recognizedStatus;
            } else {
                //the name should only contain a first name, so ignore the second part if any
                newStatus = recognizedStatus.substring(0, split);
            }
            if (statusGreenlist[newStatus.toUpperCase()] === undefined) {
                //if the status is not on our blacklist, it must be mis-recognition
                return undefined;
            }
            return newStatus;
        }
    };
})();
module.exports = textHelper;
