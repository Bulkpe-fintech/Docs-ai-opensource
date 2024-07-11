import { BASE } from "./config";

const sendMessage = async (message, deviceId, chat) => {
  try {
    console.log("request", chat);
    const response = await fetch(`${BASE}/api/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message, deviceId: deviceId, chatFromLocal: { chats: chat } }),
    });
    const data = await response.json();
    console.log(data);
    return data.result.bot;
  } catch (error) {
    console.error("Error:", error);
  }
};

const fetchChatHistory = async (deviceId) => {
  try {
    const response = await fetch(`${BASE}/api/listChats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deviceId: deviceId }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export { sendMessage, fetchChatHistory };
