const Controller = require("../controllers/messageController");

class Routes {
  static initializeRoute(router) {
    this.subscribeRoute(router);
    this.messageRecieverRoute(router);
    this.getMessagesRoute(router);
    this.getMessageRoute(router);
  }

  static subscribeRoute(router) {
    router.get("/webhook", Controller.subscribe);
  }

  static messageRecieverRoute(router) {
    router.post("/webhook", Controller.messageReciever);
  }

  static getMessagesRoute(router) {
    router.get("/messages", Controller.getMessages);
  }

  static getMessageRoute(router) {
    router.get("/message/:mid", Controller.getMessage);
  }
}

module.exports = Routes;
