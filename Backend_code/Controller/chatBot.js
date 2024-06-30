require("dotenv").config();
const AI = require("../Services/RequestAi");
const { response_sucessus, errorResponse } = require("../Configs");
const chatPdf = require("../Services/fileKnowledge");
let pdfAi = require("../loader");
const requestIp = require("request-ip");
const db = require("../Model");
pdfAi
  .injestDocs()
  .then(() => console.log("Process complete.->docs"))
  .catch((error) => console.error("Error:", error));

module.exports = {
  docsAi: async (req, res) => {
    try {
      var clientIp = requestIp.getClientIp(req);
      let ips = req.headers["cf-connecting-ip"] || clientIp || "";
      console.log(ips);
      let ck = await db.ChatSession.findOne({ user: ips });
      if (!ck) {
        ck = await db.ChatSession.create({
          user: ips,
          chats: [
            {
              role: "system",
              content: `
        -act like a chatbot for my organisation ,Make every answer crisp and clear and profesional,
        -if dont know the answer make a replay for previous query
        -dont send unwanted sorry ,please try to replay the query most
        -please dont replay to the general question`,
            },
          ],
        });
      }
      if (ck.chats.length > 50) {
        await db.ChatSession.updateOne({ user: ips }, { $pop: { chats: 1 } });
        return res.send({ ...response_sucessus, message: "You have reached the chat limit,The chats are restarted!" });
      }
      let chatSes = ck.chats;
      let { query } = req.body;
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
      console.log(chatSes);
      const aiResponse = await AI.chat(chatSes);
      chatSes.push({ role: "assistant", content: aiResponse.result });
      await db.ChatSession.updateOne({ user: ips }, { chats: chatSes });
      return res.send({ ...response_sucessus, message: "Success", result: { bot: aiResponse } });
    } catch (error) {
      console.log(error);
      return res.send({ ...errorResponse, message: error.response });
    }
  },
  listChats: async (req, res) => {
    var clientIp = requestIp.getClientIp(req);
    let ips = req.headers["cf-connecting-ip"] || clientIp || "";
    let ck = await db.ChatSession.findOne({ user: ips });
    return res.send({ ...response_sucessus, message: "Success", result: ck });
  },
};
