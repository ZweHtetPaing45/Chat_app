const { getMessages: getMsgs, deleteMessages } = require("../models/messageModel");

exports.getMessages = async (req, res) => {
  try {
    const db = req.db;
    const { from, to } = req.params;
    const messages = await getMsgs(db, from, to);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const db = req.db;
    const { user1, user2 } = req.params;
    const deletedCount = await deleteMessages(db, user1, user2);
    if (deletedCount > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "No messages to delete" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};