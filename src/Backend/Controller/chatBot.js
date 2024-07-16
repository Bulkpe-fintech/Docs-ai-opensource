require("dotenv").config();
const AI = require("../Services/RequestAi");
const { successResponse, errorResponse, basePrompt } = require("../Configs");
const chatPdf = require("../Services/fileKnowledge");
let pdfAi = require("../loader");
const db = require("../Model");
const dbAccess = process.env.DB;
const fs = require("fs").promises;
const path = require("path");

pdfAi
  .injestDocs()
  .then(() => console.log("Process complete.->docs"))
  .catch((error) => console.error("Error:", error));

module.exports = {
  docsAi: async (req, res) => {
    try {
      let { deviceId, query } = req.body;
      if (!deviceId) return res.send({ ...errorResponse, message: "Device not recognized" });

      let checkChats;
      if (dbAccess) {
        checkChats = await db.ChatSession.findOne({ user: deviceId });
        if (!checkChats) {
          checkChats = await db.ChatSession.create({
            user: deviceId,
            chats: [
              {
                role: "system",
                content: basePrompt,
              },
            ],
          });
        }
      } else {
        checkChats = await fetchDataFromJSON(deviceId);
        if (!checkChats) {
          checkChats = { user: deviceId, chats: [{ role: "system", content: basePrompt }] };
          await appendDataToJSON(deviceId, checkChats);
        }
      }

      if (!query) return res.send({ ...errorResponse, message: "Please enter your query" });

      let array = ["python", "java", "js", "c\\+\\+", ".net", "curl", "php", "ruby", "swift", "kotlin", "perl", "openai", "elon", "musk"];
      let result = query;
      array.sort((a, b) => b.length - a.length);
      array.forEach((value) => {
        result = result.replace(new RegExp(value, "gi"), "");
      });

      let callpdf = await chatPdf.chatBotPdf(result);
      if (!callpdf || !callpdf.result) {
        return res.send({ ...errorResponse, message: "We can't process your request!" });
      }

      checkChats.chats.push({ role: "user", content: query });
      checkChats.chats.push({ role: "system", content: callpdf.result.text });

      const aiResponse = await AI.chat(checkChats.chats);
      checkChats.chats.push({ role: "assistant", content: aiResponse.result });

      if (checkChats.chats.length > 30) {
        checkChats.chats.splice(1, 1);
      }

      if (dbAccess) {
        await db.ChatSession.updateOne({ user: deviceId }, { chats: checkChats.chats });
      } else {
        await appendDataToJSON(deviceId, checkChats);
      }

      return res.send({ ...successResponse, message: "Success", result: { bot: aiResponse } });
    } catch (error) {
      console.log(error);
      return res.send({ ...errorResponse, message: error.response });
    }
  },

  listChats: async (req, res) => {
    try {
      let { deviceId } = req.body;
      if (!deviceId) return res.send({ ...errorResponse, message: "Device not recognized" });

      let checkChats;

      if (dbAccess) {
        checkChats = await db.ChatSession.findOne({ user: deviceId });
      } else {
        checkChats = await fetchDataFromJSON(deviceId);
      }

      return res.send({ ...successResponse, message: "Success", result: checkChats });
    } catch (error) {
      console.error("Error fetching chats:", error);
      return res.send({ ...errorResponse, message: "Failed to fetch chats" });
    }
  },
};

async function fetchDataFromJSON(deviceId) {
  try {
    const data = await fs.readFile(path.resolve(__dirname, "../Source/local.json"), "utf-8");
    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) ? parsedData.find((session) => session.user === deviceId) || null : null;
  } catch (error) {
    if (error.code === "ENOENT") {
      const initialData = [];
      await fs.writeFile(path.resolve(__dirname, "../Source/local.json"), JSON.stringify(initialData, null, 2), "utf-8");
      return null;
    } else {
      console.error("Error reading JSON file:", error);
      throw error;
    }
  }
}

async function appendDataToJSON(deviceId, newData) {
  try {
    let data = await fetchAllDataFromJSON();
    if (!data) data = [];

    const existingSessionIndex = data.findIndex((session) => session.user === deviceId);
    if (existingSessionIndex !== -1) {
      data[existingSessionIndex] = newData;
    } else {
      data.push(newData);
    }

    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(path.resolve(__dirname, "../Source/local.json"), jsonData, "utf-8");
    console.log("Data appended to JSON file successfully.");
  } catch (error) {
    console.error("Error writing to JSON file:", error);
    throw error;
  }
}

async function fetchAllDataFromJSON() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, "../Source/local.json"), "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      const initialData = [];
      await fs.writeFile(path.resolve(__dirname, "../Source/local.json"), JSON.stringify(initialData, null, 2), "utf-8");
      return initialData;
    } else {
      console.error("Error reading JSON file:", error);
      throw error;
    }
  }
}
