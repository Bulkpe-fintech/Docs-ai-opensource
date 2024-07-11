const { OpenAI } = require("langchain/llms/openai");
const { FaissStore } = require("langchain/vectorstores/faiss");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { loadQAStuffChain } = require("langchain/chains");
require("dotenv").config();

module.exports = {
  chatBotPdf: async (question) => {
    try {
      const llmA = new OpenAI({ openAIApiKey: process.env.OPENAI_KEY, modelName: "gpt-3.5-turbo" });
      const chainA = loadQAStuffChain(llmA);
      const directory = `./Source/docs`;
      const loadedVectorStore = await FaissStore.load(directory, new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_KEY }));
      const result = await loadedVectorStore.similaritySearch(question, 1);
      const resA = await chainA._call({
        input_documents: result,
        question,
      });
      return { success: true, result: resA };
    } catch (error) {
      console.error(error);
      return { success: true, result: error.response };
    }
  },
};
