import React, { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import MessageUI from "./MessageUI";
import { useLocation } from "react-router-dom";

const getMessages = async (userId, channelId, isChannel) => {
  const url = isChannel ? `http://localhost:8000/messages/${channelId}` : `http://localhost:8000/messages/${userId}/${channelId}`;
  const res = await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return res;
}

const getUsers = async () => {
  const url = "http://localhost:8000/users";
  const res = await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return res;
}

const Messaging = ({socket}) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const channelId = location.state ? location.state.channelId : null;
  const userId = location.state ? location.state.userId : null;
  const isChannel = location.state ? location.state.isChannel : null;
  useEffect(() => {
    const fetchMessages = async () => {
      const oldMessages = await getMessages(userId, channelId, isChannel);
      setMessages(oldMessages);
    };
    fetchMessages();
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsers(users);
    };
    fetchUsers();
  }, [channelId, userId]);
  return (
    <div className="messaging-page">
      <NavigationBar userId={location.state.userId} />
      <div className="vertical-line" />
      <MessageUI
        data={{users, messages, isChannel, channelId, userId, socket}}
      />
    </div>
  );
};

export default Messaging;
