exports.saveMessage = async (db, message) => {
  await db.collection("messages").insertOne(message);
};

exports.getMessages = async (db, from, to) => {
  const room = [from, to].sort().join("-");
  return await db
    .collection("messages")
    .find({ room })
    .sort({ time: 1 })
    .toArray();
};

// ✅ Delete all messages between two users
exports.deleteMessages = async (db, user1, user2) => {
  const room = [user1, user2].sort().join("-");
  const result = await db.collection("messages").deleteMany({ room });
  return result.deletedCount;
};