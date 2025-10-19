const bcrypt = require("bcrypt");

exports.createUser = async (db, { username, name, password, image }) => {
  const hashed = await bcrypt.hash(password, 10);
  const result = await db.collection("users").insertOne({
    username,
    name,
    password: hashed,
    image,
  });
  return result;
};

exports.findUserByUsername = async (db, username) => {
  return await db.collection("users").findOne({ username });
};