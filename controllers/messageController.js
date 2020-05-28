const Message = require("../db/message");
const processMessage = require("../helpers/processMessage");

class MessageController {
  static subscribe(req, res) {
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  }

  static messageReciever(req, res) {
    let body = req.body;
    if (body.object === "page") {
      body.entry.forEach(function (entry) {
        entry.messaging.forEach(function (event) {
          const senderID = event.sender.id;
          let type = "";
          let webhook_event = "";
          let mid = "";
          if (event.message && !event.message.is_echo) {
            webhook_event = event.message;
            type = "message";
            mid = webhook_event.mid;
            res.sendStatus(200);
            processMessage(senderID, webhook_event.text);
          }
          if (event.postback) {
            webhook_event = event.postback.payload;
            console.log(event.postback);
            mid = webhook_event.mid;
            type = "postback";
            res.sendStatus(200);
            processMessage(senderID, webhook_event);
          }

          let message = new Message({
            mid,
            senderID,
            message: webhook_event,
            type,
          });
          message.save();
        });
      });
    } else {
      res.sendStatus(404);
    }
  }

  static getMessages(req, res) {
    Message.find().then((messages) => {
      res.status(200).send({ messages });
    });
  }

  static getMessage(req, res) {
    const mid = req.params.mid;
    Message.find({ mid }).then((message) => {
      res.status(200).send({ message });
    });
  }
}

module.exports = MessageController;
