const express = require("express");
const Router = express.Router();
const Controller = require("../Controller");
const { response_sucessus } = require("../Configs");

Router.get("/", async (req, res) => {
  return res.send({ ...response_sucessus, message: "Api is running good" });
});

Router.post("/request", Controller.chatBot.docsAi);
Router.post("/listChats", Controller.chatBot.listChats);

module.exports = Router;
