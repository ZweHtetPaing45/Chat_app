const express = require("express");
const multer = require("multer");
const { register, login } = require("../controllers/authController");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

module.exports = (db) => {
  router.use((req, res, next) => { req.db = db; next(); });

  router.post("/register", upload.single("image"), register);
  router.post("/login", login);

  return router;
};