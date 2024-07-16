import { BASE } from "./config";

const sendMessage = async (message, deviceId) => {
  try {
    const response = await fetch(`${BASE}/api/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message, deviceId: deviceId }),
    });
    const data = await response.json();
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
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export { sendMessage, fetchChatHistory };
