require("dotenv").config();
const AI = require("../Services/RequestAi");
const { successResponse, errorResponse, basePrompt } = require("../Configs");
const chatPdf = require("../Services/fileKnowledge");
let pdfAi = require("../loader");
const db = require("../Model");
const dbAccess = process.env.DB;
pdfAi
  .injestDocs()
  .then(() => console.log("Process complete.->docs"))
  .catch((error) => console.error("Error:", error));

module.exports = {
  docsAi: async (req, res) => {
    try {
      let { deviceId, query, chatFromLocal } = req.body;

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
        checkChats = chatFromLocal.chats ? chatFromLocal : { chats: [] };
      }

      if (!dbAccess) {
        checkChats.chats = [
          {
            role: "system",
            content: basePrompt,
          },
          ...checkChats.chats,
        ];
      }
      console.log("list", checkChats.chats.length, checkChats);
      if (checkChats.chats.length > 50) {
        await db.ChatSession.updateOne({ user: deviceId }, { chats: checkChats.chats });
      }

      let chatSes = checkChats.chats;
      if (!query) return res.send({ ...errorResponse, message: "Please enter your query" });

      let array = ["python", "java", "js", "c\\+\\+", ".net", "curl", "php", "ruby", "swift", "kotlin", "perl", "openai", "elon", "musk"];
      let result = query;
      array.sort((a, b) => b.length - a.length);
      array.forEach((value) => {
        result = result.replace(new RegExp(value, "gi"), "");
      });
      let callpdf = await chatPdf.chatBotPdf(result);
      if (!callpdf && !callpdf.result) {
        return res.send({ ...errorResponse, message: "We cant process your request!" });
      }
      chatSes.push({ role: "user", content: query });
      chatSes.push({ role: "system", content: callpdf.result.text });
      const aiResponse = await AI.chat(chatSes);
      chatSes.push({ role: "assistant", content: aiResponse.result });
      if (dbAccess) await db.ChatSession.updateOne({ user: deviceId }, { chats: chatSes });
      return res.send({ ...successResponse, message: "Success", result: { bot: aiResponse } });
    } catch (error) {
      console.log(error);
      return res.send({ ...errorResponse, message: error.response });
    }
  },
  listChats: async (req, res) => {
    if (!dbAccess) return res.send({ ...errorResponse, message: "failed", result: "Local" });

    let { deviceId } = req.body;
    let checkChats = await db.ChatSession.findOne({ user: deviceId });
    return res.send({ ...successResponse, message: "Success", result: checkChats });
  },
};
