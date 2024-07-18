import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { sendMessage, fetchChatHistory } from "./Request";
import { widgetHeading, widgetLogo } from "./config";
import localLogo from "./bulkpe.png";
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const chatbotMessageWindow = useRef(null);
  const [deviceId, setDeviceId] = useState("");

  const loaderHtml = "<span class='loader'><span class='loader__dot'></span><span class='loader__dot'></span><span class='loader__dot'></span></span>";
  const errorMessage = "My apologies, I'm not avail at the moment.";

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
    const handleKeyPress = (event) => {
      if (event.which === 13) {
        validateMessage();
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [inputValue]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => document.querySelector(".chatbot__input").focus(), 300);
      scrollToBottom();
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    if (chatbotMessageWindow.current) {
      chatbotMessageWindow.current.scrollTop = chatbotMessageWindow.current.scrollHeight;
    }
  };

  useEffect(() => {
    const getChatHistory = async () => {
      try {
        const history = await fetchChatHistory(deviceId);
        // console.log(history);
        if (history.result !== "") {
          let chats = history.result.chats;
          let messagesArray = [];
          chats.forEach((chat) => {
            if (chat.role === "user") {
              messagesArray.push({ type: "user", content: chat.content });
            } else if (chat.role === "assistant") {
              messagesArray.push({ type: "ai", content: chat.content });
            }
          });
          setMessages(messagesArray);
          scrollToBottom();
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    if (deviceId) {
      getChatHistory();
    }
  }, [deviceId]);

  const handleNewUserMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, { type: "ai", content: loaderHtml, isLoading: true }]);
    scrollToBottom();
    sendMessage(newMessage, deviceId)
      .then((response) => {
        if (!response) {
          aiMessage(errorMessage, true, 1000);
        } else {
          aiMessage(response.result, false, 2000);
        }
      })
      .catch((error) => {
        aiMessage(error.message || errorMessage, false, 2000);
        console.error("Error sending message:", error);
      });
  };

  const userMessage = (content, shouldScroll = true) => {
    setMessages((prevMessages) => [...prevMessages, { type: "user", content }]);
    if (shouldScroll) scrollToBottom();
  };

  const aiMessage = (content, isLoading = false, delay = 0) => {
    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.map((message, index) => (index === prevMessages.length - 1 && message.isLoading ? { type: "ai", content, isLoading: false } : message)));
      scrollToBottom();
    }, delay);
  };

  const escapeScript = (unsafe) => {
    return unsafe.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\\/g, "&#x5C;").replace(/\s+/g, " ").trim();
  };

  const validateMessage = () => {
    const safeText = escapeScript(inputValue);
    if (safeText.length && safeText !== " ") {
      resetInputField();
      userMessage(safeText);
      handleNewUserMessage(safeText);
    }
  };

  const resetInputField = () => {
    setInputValue("");
  };

  return (
    <div className={`chatbot ${isOpen ? "" : "chatbot--closed"}`}>
      <div className="chatbot__header" onClick={toggleChatbot}>
        <p>
          <img className="widgetLogo" src={widgetLogo ? widgetLogo : localLogo} alt="Widget Logo" />
        </p>
        <p>{isOpen ? widgetHeading : ""}</p>
        <svg className="chatbot__close-button icon-speech" viewBox="0 0 32 32">
          <use xlinkHref="#icon-speech" />
        </svg>
        <svg className="chatbot__close-button icon-close" viewBox="0 0 32 32">
          <use xlinkHref="#icon-close" />
        </svg>
      </div>
      <div className="chatbot__message-window" ref={chatbotMessageWindow}>
        <ul className="chatbot__messages">
          {messages.map((message, index) => (
            <li key={index} className={`animation ${message.type === "user" ? "is-user" : "is-ai"}`}>
              {message.type === "ai" && (
                <div className="is-ai__profile-picture">
                  <img className="avatar_logo" src="https://cdn-icons-png.flaticon.com/128/8787/8787632.png" alt="AI Avatar" />
                </div>
              )}
              <span className={`chatbot__arrow ${message.type === "user" ? "chatbot__arrow--right" : "chatbot__arrow--left"}`}></span>
              <p className="chatbot__message" dangerouslySetInnerHTML={{ __html: message.content }}></p>
            </li>
          ))}
        </ul>
      </div>
      <div className={`chatbot__entry ${isOpen ? "" : "chatbot--closed"}`}>
        <input type="text" className="chatbot__input" placeholder="Write a message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <svg className="chatbot__submit" viewBox="0 0 32 32" onClick={validateMessage}>
          <use xlinkHref="#icon-send" />
        </svg>
      </div>
    </div>
  );
};

export default Chatbot;
