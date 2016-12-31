/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var AWS = require("aws-sdk");

var storage = (function () {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    /*
     * The Game class stores all game states for the user
     */
    function Dishes(session, data) {
        if (data) {
            this.data = data;
        } else {
            this.data = {
                status: "dirty"
            };
        }
        this._session = session;
    }

    Dishes.prototype = {
        save: function (callback) {
            //save the game states in the session,
            //so next time we can save a read from dynamoDB
            this._session.attributes.currentStatus = this.data;
            dynamodb.putItem({
                TableName: 'DaisyStatusData',
                Item: {
                    Status: {
                        S: this._session.user.userId
                    },
                    Data: {
                        S: JSON.stringify(this.data)
                    }
                }
            }, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                }
                if (callback) {
                    callback();
                }
            });
        }
    };

    return {
        getStatus: function (session, callback) {
            if (session.attributes.currentStatus) {
                console.log('get status from session=' + session.attributes.currentStatus);
                callback(new Dishes(session, session.attributes.currentStatus));
                return;
            }
            dynamodb.getItem({
                TableName: 'DaisyStatusData',
                Key: {
                    Status: {
                        S: session.user.userId
                    }
                }
            }, function (err, data) {
                var currentStatus;
                if (err) {
                    console.log(err, err.stack);
                    currentStatus = new Dishes(session);
                    session.attributes.currentStatus = currentStatus.data;
                    callback(currentStatus);
                } else if (data.Item === undefined) {
                    currentStatus = new Dishes(session);
                    session.attributes.currentStatus = currentStatus.data;
                    callback(currentStatus);
                } else {
                    console.log('get status from dynamodb=' + data.Item.Data.S);
                    currentStatus = new Dishes(session, JSON.parse(data.Item.Data.S));
                    session.attributes.currentStatus = currentStatus.data;
                    callback(currentStatus);
                }
            });
        }//,
        // newGame: function (session) {
        //     return new Game(session);
        // }
    };
})();
module.exports = storage;
