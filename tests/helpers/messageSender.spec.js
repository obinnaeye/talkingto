let request = require("request");
const dotenv = require("dotenv");

const messageSender = require("../../helpers/messageSender");

dotenv.config();

jest.mock("request");
describe("messageSender:", () => {
  const recipientId = "some-recipientId";
  const message = "some-message";
  const reqBody = {
    url: "https://graph.facebook.com/v7.0/me/messages",
    qs: {
      access_token: process.env.PAGE_ACCESS_TOKEN,
    },
    method: "POST",
    json: {
      recipient: { id: recipientId },
      message: message,
    },
  };
  test("should call request with payload and a callback function", () => {
    messageSender(recipientId, message);
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(reqBody, expect.any(Function));
  });
});
