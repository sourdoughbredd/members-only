const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  text: { type: String, required: true, default: "" },
});

module.exports = mongoose.model("Message", MessageSchema);
