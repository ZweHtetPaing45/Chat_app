const express = require("express");
const { getMessages,deleteChat } = require("../controllers/chatController");

const router = express.Router();

module.exports = (db) => {
  router.use((req, res, next) => { req.db = db; next(); });

  router.get("/:from/:to", getMessages);
  router.delete("/:user1/:user2", deleteChat);

  return router;
};