const { TextLoader } = require("langchain/document_loaders/fs/text");
const { FaissStore } = require("langchain/vectorstores/faiss");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
require("dotenv").config();

module.exports = {
  injestDocs: async () => {
    const loader = new TextLoader("./Source/output.txt");
    const docs = await loader.load();
    console.log("Docs loaded");

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docOutput = await textSplitter.splitDocuments(docs);
    let vectorStore = await FaissStore.fromDocuments(docOutput, new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_KEY }));
    console.log("Saving...");

    const directory = "../../Source/docs";
    await vectorStore.save(directory);
    console.log("Saved!");
  },
};
