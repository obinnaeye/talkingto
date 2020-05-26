'use strict';

const messageSender = require("./messageSender")
const getNextBirthDay = require("./getNextBirthDay")

module.exports = function processMessage(senderId, webhook_event, dob="") {
    let message = {text: "Welcome to Talking To Test! To start a new conversation, type RESTART"}
    
    if (webhook_event.toLowerCase() !== "restart") {
        if (webhook_event.match(/^Name/i)){
            message = {text: "Please provide your Birthday: YYYY-MM-DD"}
        } else if (webhook_event.match(/^\d{4}-\d{2}-\d{2}/)){
            message = {
                "attachment":{
                  "type":"template",
                  "payload":{
                    "template_type":"button",
                    "text":"Do want to know how many days till your next birtday?",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":"Yes",
                        "payload":`yes:${webhook_event}`
                      },
                      {
                        "type":"postback",
                        "title":"No",
                        "payload":"no"
                      }
                    ]
                  }
                }
              }
        } else if (webhook_event.match(/^yes:\d{4}-\d{2}-\d{2}/)) {
            const date = webhook_event.substr(4)
            message = {text: `There are ${getNextBirthDay(date)} days left until your next birthday`}
        } else if (webhook_event === "no") {
            message = {text: "Goodbye 👋"}
        } else {
            messageSender(senderId, message)
            message = {text: "Please provide your first name in the format 'Name: YourName'"}
        }
        messageSender(senderId, message)
    } else { 
        messageSender(senderId, message) 
    }
    
}
