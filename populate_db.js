require("dotenv").config();
const db = require("./config/database");

const User = require("./models/user");
const Message = require("./models/message");

// Connect to DB
async function dbConnectWrapper() {
  await db.connect();
}
dbConnectWrapper().catch((err) => console.log(err));

const users = [
  new User({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: { salt: "randomsalt", hash: "randomhash" },
    isMember: true,
  }),
  new User({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    password: { salt: "randomsalt", hash: "randomhash" },
    isMember: false,
  }),
];

// Sample Messages
const messages = [
  new Message({
    user: users[0]._id,
    title: "Hello World",
    text: "This is my first message.",
  }),
  new Message({
    user: users[0]._id,
    title: "Second Message",
    text: "This is my second message.",
  }),
  new Message({
    user: users[1]._id,
    title: "Wello Horld",
    text: "What's up?",
  }),
];

// Save Data to DB
const saveData = async () => {
  await User.deleteMany({});
  await Message.deleteMany({});
  for (let user of users) {
    await user.save();
  }
  for (let message of messages) {
    await message.save();
  }
  console.log("Database has been populated!");
  db.disconnect();
};

saveData().catch(console.error);
