const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true, maxLength: 50 },
  lastName: { type: String, required: true, maxLength: 50 },
  email: { type: String, required: true, maxLength: 320 },
  password: {
    salt: { type: String, required: true },
    hash: { type: String, required: true },
  },
  isMember: { type: Boolean, required: true, default: false },
  messages: {
    type: [Schema.Types.ObjectId],
    ref: "Message",
    required: true,
    default: [],
  },
});

UserSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

module.exports = mongoose.model("User", UserSchema);