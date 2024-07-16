import React, { useEffect, useState } from "react";
import { Widget, addResponseMessage, addUserMessage, toggleMsgLoader } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import "./App.css";
import { sendMessage, fetchChatHistory } from "./Request";
import { preDefinedQuestions, widgetHeading, widgetDiscription } from "./config";

function App({ profileAvatar = "", title = widgetHeading, subtitle = widgetDiscription }) {
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    const initializeDeviceId = () => {
      let id = localStorage.getItem("device_id");
      if (!id) {
        id = `device_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("device_id", id);
        console.log("New Device ID generated and stored:", id);
      } else {
        console.log("Existing Device ID found:", id);
      }
      setDeviceId(id);
    };

    initializeDeviceId();
  }, []);

  useEffect(() => {
    const getChatHistory = async () => {
      try {
        const history = await fetchChatHistory(deviceId);
        if (history.result != "") {
          let chats = history.result.chats;
          for (let chat in chats) {
            // console.log(chats[chat]);
            chat = chats[chat];

            if (chat.role === "user") addUserMessage(chat.content);
            if (chat.role === "assistant") addResponseMessage(chat.content);
          }
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
      //  addPredefinedQuestions();
    };
    getChatHistory();
  }, [deviceId]);

  const addPredefinedQuestions = () => {
    const predefinedQuestionsElement = document.getElementById("messages");
    if (predefinedQuestionsElement) {
      preDefinedQuestions.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        li.className = "preDef";
        li.addEventListener("click", () => handleListItemClick(item));
        predefinedQuestionsElement.appendChild(li);
      });
    }
  };

  const handleNewUserMessage = async (newMessage) => {
    toggleMsgLoader(); // Show loader
    sendMessage(newMessage, deviceId)
      .then((response) => {
        // console.log("log", response);

        toggleMsgLoader(); // Hide loader
        if (!response) {
          addResponseMessage("Sorry,have some issue with our end.");
        }
        addResponseMessage(response.result);
      })
      .catch((error) => {
        toggleMsgLoader(); // Hide loader
        console.error("Error sending message:", error);
      });
  };
  const handleListItemClick = (item) => {
    addUserMessage(item);
    handleNewUserMessage(item);
    const elements = document.querySelectorAll(".preDef");
    elements.forEach((element) => {
      element.style.display = "none";
    });
  };

  return (
    <div className="App">
      <Widget handleNewUserMessage={handleNewUserMessage} profileAvatar={profileAvatar} title={title} subtitle={subtitle} resizable={true} senderPlaceHolder="Enter your query..." />
    </div>
  );
}

export default App;
