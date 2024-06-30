import { BASE } from "../src/config";
const sendMessage = async (message) => {
  try {
    const response = await fetch(`${BASE}/api/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message }),
    });
    const data = await response.json();
    console.log(data);
    return data.result.bot;
  } catch (error) {
    console.error("Error:", error);
  }
};

const fetchChatHistory = async () => {
  try {
    console.log(process.env.URL);
    const response = await fetch(`${BASE}/api/listChats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export { sendMessage, fetchChatHistory };
