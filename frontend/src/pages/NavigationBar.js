import React from "react";
import { useLoaderData, Link } from "react-router-dom";

const NavigationBar = ({userId}) => {
  const allChannels = useLoaderData();
  const channels = [];
  const directMessages = [];
  for (let channel of allChannels) {
    if ("name" in channel) {
      channels.push(channel);
    } else if (channel._id != userId) {
      directMessages.push(channel);
    }
  }

  const setChannelSelected = (channelName) => {
    channelName.classList.add("selected");
    const channelElements = document.getElementsByClassName("channel");
    const directMessageElements = document.getElementsByClassName("direct-message-user");
    const allChannels = [...channelElements, ...directMessageElements];
    for (let channelElement of allChannels) {
      if (channelElement.textContent != channelName.textContent) {
        channelElement.classList.remove("selected");
      }
    }
  }

  return (
    <div className="navigation-bar">
      <div className="app-name">
        <img className="app-image" src="/chat_app_image.png" />
        Curb
      </div>
      <hr />
      <h2>Channels</h2>
      <div className="channel-list">
        {channels.map((channel) => (
          <Link
            onClick={(e) => setChannelSelected(e.target)}
            to={channel.name}
            key={channel._id}
            className="channel"
            state={{isChannel:true, channelId:channel._id, userId}}
          ># {channel.name}</Link>
        ))
        }
      </div>
      <hr />
      <h2>Direct messages</h2>
      <div className="direct-messages-list">
        {directMessages.map((user) => (
          <Link
            onClick={(e) => setChannelSelected(e.target)}
            to={user.username}
            key={user._id}
            className="direct-message"
            state={{isChannel:false, channelId:user._id, userId}}
          >
            <div className="direct-message-user">
              <img className="direct-message-user-image" src={user.userAvatar} />
              &nbsp;{user.username}
            </div>
          </Link>
        ))
        }
      </div>
      <Link to="/" className="logout-button">Logout</Link>
    </div>
  );
};

export const channelsLoader = async () => {
  const channels = await fetch("http://localhost:8000/channels")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  const users = await fetch("http://localhost:8000/users")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return [...channels, ...users];
}

export default NavigationBar;
