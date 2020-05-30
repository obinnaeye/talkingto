const request = require("request");
const dotenv = require("dotenv");
dotenv.config();

module.exports = function messageSender(recipientId, message) {
  request(
    {
      url: "https://graph.facebook.com/v7.0/me/messages",
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
      },
      method: "POST",
      json: {
        recipient: { id: recipientId },
        message: message,
      },
    },
    (error, response, body) => {
      if (!error) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + error);
      }
    }
  );
};
