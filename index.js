'use strict';

const messageSender = require("./messageSender")

const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());


  app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    if (body.object === 'page') {
      body.entry.forEach(function(event) {
          if (event.message){
            let webhook_event = entry.messaging[0];
            const senderID = event.sender.id;
            console.log(webhook_event)
            messageSender(senderID, webhook_event);
          }
      });
    } else {
      res.sendStatus(404);
    }

  });

  app.get('/webhook', (req, res) => {

    let VERIFY_TOKEN = "YOUR_VERIFY_TOKEN"
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        res.sendStatus(403);      
      }
    }
  });

  app.get("/", (req, res) => {
      res.status(200).send("<h3>Welcome To TalkingTo<h3>")
  })

  app.get("/messages", (req, res) => {
      // some queries to db to get messages
  })

app.listen(process.env.PORT || 1234, () => console.log('webhook is listening'));
