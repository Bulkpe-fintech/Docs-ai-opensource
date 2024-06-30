require("dotenv").config();
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY || "" });

module.exports = {
  chat: async (prompt) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: prompt,
        temperature: 1,
        max_tokens: 300,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      console.log(response);
      if (response && response.choices[0] && response.choices[0].message) {
        let ree = response.choices[0].message.content;
        return { success: true, result: ree };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.log(error);
      return { error: error.message };
    }
  },
};
