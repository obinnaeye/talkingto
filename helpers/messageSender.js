const request = require("request");

module.exports = function sendMessage(recipientId, message) {
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
    function (error, response, body) {
      if (!error) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + error);
      }
    }
  );
};
