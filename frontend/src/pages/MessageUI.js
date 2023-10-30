import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom'

const MessageUI = (props) => {
  let isChannel = props.data.isChannel;
  let channelId = props.data.channelId;
  let userId = props.data.userId;
  let socket = props.data.socket;
  let oldMessages = props.data.messages;
  let users = props.data.users;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{content: "test"}]);

  const location = useLocation();
  isChannel = location.state ? location.state.isChannel : isChannel;
  channelId = location.state ? location.state.channelId : channelId;
  userId = location.state ?  location.state.userId : userId;

  useEffect(() => {
    setMessages(oldMessages);
    socket.on("messageReceived", async (data) => {
      if (
        (isChannel && data.channelId === channelId)
        ||
        ((data.userId === userId && data.channelId === channelId)
        ||
        (data.userId === channelId && data.channelId === userId))
        ) {
          const allMessages1 = [...oldMessages, data];
          setMessages(allMessages1);
          oldMessages = allMessages1;
      }
    });
    return () => socket.off('messageReceived');
  }, [oldMessages, socket]);

  const submitMessage = async () => {
    socket.emit('messageSent',{
      userId,
      channelId,
      content: message,
      timestamp: Date.now(),
    });
    setMessage("");
  }

  const sortMessages = (messages) => {
    const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
    const groupedMessages = [];
    let currentGroup = [];
    let currentUserId = null;
    for (let message of sortedMessages) {
      if (message.userId == currentUserId) {
        currentGroup.push(message);
      } else {
      if (currentGroup.length != 0) groupedMessages.push(currentGroup);
        currentUserId = message.userId;
        currentGroup = [message];
      }
      if (message._id == sortedMessages[sortedMessages.length - 1]._id && currentGroup.length != 0) groupedMessages.push(currentGroup);
    }

    const groupedMessagesWithAvatars = [];
    const currentTime = Date.now();
    for (let group of groupedMessages) {
      const userAvatar = users.find((user) => user._id === group[0].userId).userAvatar;
      let userName;
      if (userId === group[0].userId) userName = "You";
      else userName = users.find((user) => user._id === group[0].userId).username;
      const lastMessageTimestamp = group[group.length - 1].timestamp;
      let lastMessageInfo;
      const time = Math.floor(((currentTime - lastMessageTimestamp)/1000)/60);
      if (time < 60) {
        lastMessageInfo = `${time} minute`;
      } else if (Math.floor(time/60) < 24) {
        lastMessageInfo = `${Math.floor(time/60)} hour`;
      } else if (Math.floor(time/60/24) < 7) {
        lastMessageInfo = `${Math.floor(time/60/24)} day`;
      } else {
        lastMessageInfo = `${Math.floor(time/60/24/7)} week`;
      }

      if (lastMessageInfo.split(" ")[0] == "1") lastMessageInfo += " ago";
      else if (lastMessageInfo.split(" ")[0] == "0") lastMessageInfo = "Just now";
      else lastMessageInfo += "s ago";

      groupedMessagesWithAvatars.push({
        userName,
        messages: group,
        avatar: userAvatar,
        lastMessageTimestamp: lastMessageInfo,
      });
    }
    return groupedMessagesWithAvatars;
  }

  const renderGroup = (group) => (
    <div>
      <div className="message-group-info">
        <img src={group.avatar} alt="avatar" className="user-info-img" />
        <div className="user-info">
          <div className="user-info-name">
             &nbsp; {group.userName}
          </div>
          <div className="user-info-timestamp">
            &nbsp; &nbsp; {group.lastMessageTimestamp}
          </div>
        </div>
      </div>
      <div className="message-group">
        {group.messages.map((message) => (
          <div className={group.userName == "You" ? "message-current-user" : "message"} key={message._id}>{message.content}</div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {isChannel == null || channelId == null ? 
      (<div className="select-channel-or-direct-message">Select a channel or direct message to start messaging</div>)
      :
      (
        <>
          <div className="channel-info">
            <div className="channel-name">
              {decodeURIComponent(location.pathname.split("/")[2])}
            </div>
            <hr className="channel-name-divider" />
          </div>
          <div className="messages-container">
            <div>
              <div className="messages">
                {sortMessages(messages).map((group) => (
                  renderGroup(group)
                ))}
              </div>
              <div className="message-form">
                <input className="form-input" type="text" placeholder="Message" onChange={(event) => setMessage(event.target.value)} value={message}/>
                <button className="form-button" onClick={submitMessage}>
                  <img className="send-message-image" src="/send_message.png" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MessageUI;
