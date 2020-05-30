const processMessage = require("../../helpers/processMessage");
let messageSender = require("../../helpers/messageSender");
let getNextBirthDay = require("../../helpers/getNextBirthDay");
let Cache = require("../../db/cache");
const constants = require("../../constants");

jest.mock("../../helpers/messageSender");
jest.mock("../../helpers/getNextBirthDay");
jest.mock("../../db/cache");
getNextBirthDay.mockReturnValue(123);
const senderId = "some-senderId";

describe("processMessage:", () => {
  afterEach(() => {
    Cache.findOne.mockReturnValue({
      senderId,
      convoNumber: 0,
    });
    messageSender.mockClear();
  });

  let welcomeMessage = {
    text:
      "Welcome to Talking To Test! To start a new conversation, type RESTART",
  };
  let nameRequest = {
    text: "Please provide your first name in the format 'Name: YourName'",
  };

  test("should send 2 messages at the begining of a conversation with a new user", () => {
    Cache.findOne.mockReturnValue(null);
    processMessage(senderId, "Hello").then(() => {
      expect(messageSender).toHaveBeenCalledTimes(2);
      expect(messageSender).toHaveBeenCalledWith(senderId, welcomeMessage);
      expect(messageSender).toHaveBeenLastCalledWith(senderId, nameRequest);
      expect(new Cache().save).toHaveBeenCalledTimes(1);
    });
  });

  test("should send 2 messages at the begining of a conversation with existing user", () => {
    processMessage(senderId, "Hello").then(() => {
      expect(messageSender).toHaveBeenCalledTimes(2);
      expect(messageSender).toHaveBeenCalledWith(senderId, welcomeMessage);
      expect(messageSender).toHaveBeenLastCalledWith(senderId, nameRequest);
      expect(Cache.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });
  });

  test("should send 2 messages if called with RESTART message", () => {
    processMessage(senderId, "RESTART").then(() => {
      expect(messageSender).toHaveBeenCalledTimes(2);
      expect(messageSender).toHaveBeenCalledWith(senderId, welcomeMessage);
      expect(messageSender).toHaveBeenLastCalledWith(senderId, nameRequest);
    });
  });

  test("should request for date of birth if name is appropriately sent.", () => {
    const message = { text: "Please provide your Birthday: YYYY-MM-DD" };
    processMessage(senderId, "Name:Obinna").then(() => {
      expect(messageSender).toHaveBeenCalledTimes(1);
      expect(messageSender).toHaveBeenCalledWith(senderId, message);
    });
  });

  test("should enquire if days before next birthday should be sent if given a birthday.", () => {
    Cache.findOne.mockReturnValue({
      senderId,
      convoNumber: 1,
    });
    const message = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Do you want to know how many days till your next birtday?",
          buttons: [
            {
              type: "postback",
              title: "Yes",
              payload: "yes",
            },
            {
              type: "postback",
              title: "No",
              payload: "no",
            },
          ],
        },
      },
    };
    processMessage(senderId, "1990-02-18").then(() => {
      expect(messageSender).toHaveBeenCalledTimes(1);
      expect(messageSender).toHaveBeenCalledWith(senderId, message);
    });
  });

  test("should send days before next birthday if response is yes, yeah, etc", () => {
    Cache.findOne.mockReturnValue({
      senderId,
      convoNumber: 2,
    });
    message = {
      text: `There are ${getNextBirthDay(
        "1990-02-18"
      )} days left until your next birthday`,
    };

    constants.yes.forEach((element) => {
      processMessage(senderId, element).then(() => {
        expect(messageSender).toHaveBeenCalledWith(senderId, message);
      });
    });
  });

  test("should send Goodbye 👋 if response is yes, yeah, etc", () => {
    Cache.findOne.mockReturnValue({
      senderId,
      convoNumber: 2,
    });
    message = { text: "Goodbye 👋" };

    constants.no.forEach((element) => {
      processMessage(senderId, element).then(() => {
        expect(messageSender).toHaveBeenCalledWith(senderId, message);
      });
    });
  });
});
