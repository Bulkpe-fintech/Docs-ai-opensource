// AppConfigs
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSession = new Schema(
  {
    user: String,
    chats: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatSession", ChatSession);
