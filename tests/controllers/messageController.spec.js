const dotenv = require("dotenv");

const MessageController = require("../../controllers/messageController");
let processMessage = require("../../helpers/processMessage");
let Message = require("../../db/message");

jest.mock("../../helpers/processMessage");
jest.mock("../../db/message");
let messages = [{ m1: "some message 1" }, { m2: "some message 2" }];
let req = {};
let message = {
  mid: "some-mid",
  text: "some-text",
};
let postback = {
  payload: "some-payload",
};
let senderId = "some-senderID";
let entry = [
  {
    messaging: [
      {
        sender: { id: senderId },
        message,
        postback: null,
      },
    ],
  },
];
let reqBody = {
  object: "page",
  entry,
};
let req_payload = {
  body: reqBody,
  query: {
    "hub.mode": "subscribe",
    "hub.verify_token": process.env.VERIFY_TOKEN,
    "hub.challenge": "some challenge",
  },
};

let res = {};
res.status = jest.fn((code) => {
  return { send: jest.fn((msg) => {}) };
});
res.sendStatus = jest.fn();

Message.mockReturnValue({ save: jest.fn() });
Message.find = jest.fn(() => {
  return messages;
});

Message.findOne = jest.fn(() => {
  return message;
});

describe("MessageController:", () => {
  afterEach(() => {
    res.status.mockClear();
    res.sendStatus.mockClear();
    processMessage.mockClear();
    Message.find.mockClear();
    Message.mockClear();
    req.query["hub.mode"] = "page";
    req.body.entry = entry;
    req.query["hub.verify_token"] = process.env.VERIFY_TOKEN;
  });

  describe("subscribe: ", () => {
    req = req_payload;
    test("subscribe should send challenge with status 200 when called with correct quries", () => {
      MessageController.subscribe(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status.mock.results[0].value.send).toHaveBeenCalledTimes(1);
      expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith(
        req.query["hub.challenge"]
      );
    });

    test("subscribe should send status 403 when called with incorrect token", () => {
      req.query["hub.verify_token"] = "some-incorrect-token";
      MessageController.subscribe(req, res);
      expect(res.sendStatus).toHaveBeenCalledTimes(1);
      expect(res.sendStatus).toHaveBeenCalledWith(403);
    });

    test("subscribe should do nothing when called without a token", () => {
      req.query["hub.verify_token"] = null;
      MessageController.subscribe(req, res);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.sendStatus).not.toHaveBeenCalled();
    });

    test("subscribe should do nothing when called without a mode", () => {
      req.query["hub.verify_token"] = process.env.VERIFY_TOKEN;
      req.query["hub.mode"] = null;
      MessageController.subscribe(req, res);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.sendStatus).not.toHaveBeenCalled();
    });
  });

  describe("messageReciever", () => {
    test("should process message if message and no echo", () => {
      MessageController.messageReciever(req, res);
      expect(res.sendStatus).toHaveBeenCalledTimes(1);
      expect(processMessage).toHaveBeenCalledTimes(1);
      expect(res.sendStatus).toHaveBeenCalledWith(200);
      expect(processMessage).toHaveBeenCalledWith(senderId, message.text);
      expect(Message.mock.results[0].value.save).toHaveBeenCalled();
    });

    test("should do nothing if no message and no postback", () => {
      req.body.entry[0].messaging[0].message = null;
      MessageController.messageReciever(req, res);
      expect(res.sendStatus).not.toHaveBeenCalled();
      expect(processMessage).not.toHaveBeenCalled();
      expect(Message.mock.results[0]).toBe(undefined);
    });

    test("should do nothing if message is echo", () => {
      req.body.entry[0].messaging[0].message = { is_echo: "true" };
      MessageController.messageReciever(req, res);
      expect(res.sendStatus).not.toHaveBeenCalled();
      expect(processMessage).not.toHaveBeenCalled();
      expect(Message.mock.results[0]).toBe(undefined); // tests save is not called
    });

    test("should process message if postback", () => {
      req.body.entry[0].messaging[0].postback = postback;
      req.body.entry[0].messaging[0].message = null;
      MessageController.messageReciever(req, res);
      expect(res.sendStatus).toHaveBeenCalledTimes(1);
      expect(processMessage).toHaveBeenCalledTimes(1);
      expect(res.sendStatus).toHaveBeenCalledWith(200);
      expect(processMessage).toHaveBeenCalledWith(senderId, postback.payload);
      expect(Message.mock.results[0].value.save).toHaveBeenCalled();
    });

    test("should do nothing if messaging is empty", () => {
      req.body.entry[0].messaging = [];
      MessageController.messageReciever(req, res);
      expect(res.sendStatus).not.toHaveBeenCalled();
      expect(processMessage).not.toHaveBeenCalled();
      expect(Message.mock.results[0]).toBe(undefined);
    });

    test("should do nothing if no entry", () => {
      req.body.entry = [];
      MessageController.messageReciever(req, res);
      expect(res.sendStatus).not.toHaveBeenCalled();
      expect(processMessage).not.toHaveBeenCalled();
      expect(Message.mock.results[0]).toBe(undefined);
    });

    test("should send status 404 if body.object is not page", () => {
      req.body.object = "not-page";
      MessageController.messageReciever(req, res);
      expect(res.sendStatus).toHaveBeenCalledTimes(1);
      expect(res.sendStatus).toHaveBeenCalledWith(404);
      expect(processMessage).not.toHaveBeenCalled();
      expect(Message.mock.results[0]).toBe(undefined);
    });
  });

  describe("getMessages:", () => {
    test("should find messages", () => {
      MessageController.getMessages(req, res).then(() => {
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(Message.find).toHaveBeenCalledTimes(1);
        expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
          messages,
        });
      });
    });
  });

  describe("getMessage:", () => {
    req.params = { mid: "some-mid" };
    test("should find messages", () => {
      MessageController.getMessage(req, res).then(() => {
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(Message.findOne).toHaveBeenCalledTimes(1);
        expect(Message.findOne).toHaveBeenCalledWith(
          req.params,
          expect.any(Function)
        );
        expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
          message,
        });
      });
    });
  });
});
//TO-DO: test for 0-1-2 elements in list
