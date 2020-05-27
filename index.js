'use strict';

const mongoose = require("mongoose")
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);

const Message = require("./db/message")
const processMessage = require("./helpers/processMessage")
const Routes = require('./routes/routes')

const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());

const router = express.Router();



Routes.initializeRoute(router)

app.get("/", (req, res) => {
    res.status(200).send("<h3>Welcome To TalkingTo<h3>")
})
// app.post('/webhook', (req, res) => {  

// let body = req.body;
// if (body.object === 'page') {
//     body.entry.forEach(function(entry) {
//     console.log({entry: entry})
//     entry.messaging.forEach(function(event) {
//         const senderID = event.sender.id;
//         let type = ''
//         let webhook_event = ""
//         let mid = ""
//         if (event.message && !event.message.is_echo){
//             webhook_event = event.message;
//             type = "message"
//             mid = webhook_event.mid
//             res.sendStatus(200);
//             processMessage(senderID, webhook_event.text);
//         }
//         if (event.postback) {
//             webhook_event = event.postback.payload;
//             mid = webhook_event.mid
//             type = "postback"
//             res.sendStatus(200);
//             processMessage(senderID, webhook_event);
//         }

//         let message = new Message({
//             mid,
//             senderID,
//             message: webhook_event,
//             type
//         })
//         message.save()
//     })
//     });
// } else {
//     res.sendStatus(404);
// }

// });

// app.get('/webhook', (req, res) => {

// let VERIFY_TOKEN = process.env.VERIFY_TOKEN
// let mode = req.query['hub.mode'];
// let token = req.query['hub.verify_token'];
// let challenge = req.query['hub.challenge'];
// if (mode && token) {
//     if (mode === 'subscribe' && token === VERIFY_TOKEN) {
//     console.log('WEBHOOK_VERIFIED');
//     res.status(200).send(challenge);
    
//     } else {
//     res.sendStatus(403);      
//     }
// }
// });

// app.get("/messages", (req, res) => {
//     Message.find().then((messages) => {
//     res.status(200).send({messages})
//     })
// })

// app.get("/message/:mid", (req, res) => {
// const mid = req.params.mid
// Message.findById(mid).then((message) => {
//     res.status(200).send({message})
// })
// })
app.use(router);
app.listen(process.env.PORT || 1234, () => console.log('webhook is listening'));
