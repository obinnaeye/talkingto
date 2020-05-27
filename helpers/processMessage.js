'use strict';

const messageSender = require("./messageSender")
const getNextBirthDay = require("./getNextBirthDay")
const Cache = require('../db/cache')
const constants = require("../constants")

module.exports = function processMessage(senderId, webhook_event) {
    let message = {text: "Welcome to Talking To Test! To start a new conversation, type RESTART"}
    let nameRequest = {text: "Please provide your first name in the format 'Name: YourName'"}
    let convoNumber = 0
    let dob = ''
    let isNewUser = false
    Cache.findOne({senderId}, (err, doc) => {
      if(doc){
        convoNumber = doc.convoNumber
        dob = doc.dob
        console.log({doc})
      } else {
        isNewUser = true
        console.log(isNewUser)
      }

    
      if (webhook_event.toLowerCase() !== "restart") {
        let intro = ''
        if (webhook_event.match(/^Name/i)){
            convoNumber = 1
            message = {text: "Please provide your Birthday: YYYY-MM-DD"}
        } else if (webhook_event.match(/^\d{4}-\d{2}-\d{2}/) && convoNumber == 1){
            convoNumber = 2
            dob = webhook_event
            console.log({dob})
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
                        "payload":"yes"
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
        } else if (constants.yes.includes(webhook_event.toLowerCase()) && convoNumber > 1) {
            convoNumber = 3
            message = {text: `There are ${getNextBirthDay(dob)} days left until your next birthday`}
        } else if (constants.no.includes(webhook_event.toLowerCase()) && convoNumber > 1) {
            convoNumber = 3
            message = {text: "Goodbye 👋"}
        } else {
            intro = nameRequest;
        }
        if (intro) {
            convoNumber = 0
            messageSender(senderId, message)
            messageSender(senderId, intro)
        } else {
            messageSender(senderId, message) 
        }
      } else {
          convoNumber = 0
          messageSender(senderId, message)
          messageSender(senderId, nameRequest) 
      }
      if (isNewUser) {
        let cache  = new Cache({
          senderId,
          convoNumber
        })
        cache.save()
      } else {
        Cache.findOneAndUpdate({senderId}, {convoNumber, dob}, (err, doc) => {})
      }

    })
}
