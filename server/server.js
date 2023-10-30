const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require("body-parser");
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const DATABASE_NAME = "konekt";
const USER_COLLECTION_NAME = "user";
const CHANNEL_COLLECTION_NAME = "channel";
const MESSAGE_COLLECTION_NAME = "message";

io.on('connection', (socket) => {
  socket.on('sendMessage', (data) => {
    io.emit('messageReceived', data);
  });
  socket.on('messageSent', async (data) => {
    const db = client.db(DATABASE_NAME).collection(MESSAGE_COLLECTION_NAME);
    await db.insertOne(data);
    io.emit('messageReceived', data);
  });
});

const uri = process.env.DATABASE_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}
run();

app.get("/users", async (req, res) => {
  const db = client.db(DATABASE_NAME);
  const userData = await db.collection(USER_COLLECTION_NAME).find().toArray();
  res.status(200).json(userData);
});

app.get("/channels", async (req, res) => {
  const db = client.db(DATABASE_NAME);
  const channelsData = await db.collection(CHANNEL_COLLECTION_NAME).find().toArray();
  res.status(200).json(channelsData);
});

app.get("/messages/:channelId", async (req, res) => {
  const { channelId } = req.params;
  const db = client.db(DATABASE_NAME);
  const messagesData = await db.collection(MESSAGE_COLLECTION_NAME).find().toArray();
  const filteredMessages = messagesData.filter((message) => (message.channelId === channelId));
  res.status(200).json(filteredMessages);
});

app.get("/messages/:userId/:channelId", async (req, res) => {
  const { userId, channelId } = req.params;
  const db = client.db(DATABASE_NAME);
  const messagesData = await db.collection(MESSAGE_COLLECTION_NAME).find().toArray();
  const filteredMessages = messagesData.filter(
    (message) => 
    (message.userId === userId && message.channelId === channelId)
    || 
    (message.userId === channelId && message.channelId === userId));
  res.status(200).json(filteredMessages);
});

app.post("/channel", async (req, res) => {
  try {
    const { channelName } = req.body;
    if (!channelName) {
      return res.status(400).json({ error: "Channel name is required" });
    }
    const db = client.db(DATABASE_NAME).collection(CHANNEL_COLLECTION_NAME);
    const data = await db.find().toArray();
    const foundChannel = data.find((channel) => channel.name === channelName);
    if (foundChannel) {
      return res.status(400).json({ error: "Channel name already exists" });
    }
    await db.insertOne({ name: channelName });
    res.status(200).json({ message: "Channel created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    let userId;
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const db = client.db(DATABASE_NAME).collection(USER_COLLECTION_NAME);
    const data = await db.find().toArray();
    const foundUser = data.find((user) => user.username === username);
    if (foundUser) {
      userId = foundUser._id.toString();
    } else {
      const userAvatar = `https://picsum.photos/seed/${username}/40/40`;
      const newUser = await db.insertOne({ username, userAvatar });
      userId = newUser.insertedId;
    }
    res.status(200).json({ userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});