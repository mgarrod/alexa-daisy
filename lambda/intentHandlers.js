/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var textHelper = require('./textHelper'),
    storage = require('./storage');

var registerIntentHandlers = function (intentHandlers, skillContext) {


    intentHandlers.SetDaisyStatusIntent = function (intent, session, response) {
        
        //response.tell('I can not do that Kara');
        var statusValue = textHelper.getStatusValue(intent.slots.Status.value);
        if (!statusValue) {
            response.ask('sorry, I did not hear the status, please say that again', 'Please say the status again');
            return;
        }
        storage.getStatus(session, function (currentStatus) {
            currentStatus.data.status = statusValue; //currentStatus.data.status == "clean" ? "dirty" : "clean";
         
            currentStatus.save(function () {
                response.tell('Mrs Patmore has set the dishes to ' + currentStatus.data.status);
            });
        });
    }

    intentHandlers.GetDaisyStatusIntent = function (intent, session, response) {
      
        //response.tell('I do not know');
        
        storage.getStatus(session, function (currentStatus) {

            var status = currentStatus.data.status !== undefined ? currentStatus.data.status : "dirty";

            var aResponse = 'Mrs Patmore told me the dishes are ' + currentStatus.data.status + ".";
            // if (status == "clean") {
            //     aResponse += ' Matthew will not be able to empty the dish washer, but he wanted me to tell Kara that he loves her.';
            // }
            response.tell(aResponse);

        });
    }

    intentHandlers['AMAZON.HelpIntent'] = function (intent, session, response) {
        var speechOutput = textHelper.completeHelp;
        if (skillContext.needMoreHelp) {
            response.tell(textHelper.completeHelp);
            //response.ask(textHelper.completeHelp + ' So, how can I help?', 'How can I help?');
        } else {
            response.tell(textHelper.completeHelp);
        }
    };

};
exports.register = registerIntentHandlers;
