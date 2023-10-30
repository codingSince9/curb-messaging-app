# CURB Messaging Application

This is a messaging application that allows users to send messages to each other in real-time. It is built using React and Node.js.

## Installation
Clone the github repository and install the required npm packages:

```bash
git clone https://github.com/codingSince9/curb-messaging-app
cd frontend/
npm install
cd ../server/
npm install
```

## Configuration
The server requires a MongoDB database to store user information and messages. \
You can create a free MongoDB database at [https://www.mongodb.com/](https://www.mongodb.com/). \

In the .env file in the server/ directory, replace the DATABASE_URI variable with your MongoDB connection string.\
```bash
DATABASE_URI=YOUR_MONOGO_URI
```

In the server.js file in the server/ directory, replace the following variables with your own values: \

```javascript
// server/server.js
const DATABASE_NAME = "konekt";
const USER_COLLECTION_NAME = "user";
const CHANNEL_COLLECTION_NAME = "channel";
const MESSAGE_COLLECTION_NAME = "message";
```

## Running the app
To run the app, you will need to run the frontend and server separately.\
Execute this command in frontend/ directory: 

```bash
npm run start
```

Execute this command in server/ directory: 

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

## Interaction
First page will be a "Log In" page where you can also create a new channel.\
Log in is very simple and does not require a password.\
If you want to log in as a new user, simply enter a new username and click "Log In".\
If you want to log in as an existing user, enter the username of the user you want to log in as and click "Log In".\
