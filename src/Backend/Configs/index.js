module.exports = {
  errorResponse: {
    result: {},
    message: "Somthing wend wrong",
  },
  successResponse: {
    result: {},
    message: "Success",
  },
  NotionBaseurl: "https://api.notion.com",
  basePrompt: `
        -act like a chatbot for my organisation ,Make every answer crisp and clear and profesional,
        -if dont know the answer make a replay for previous query
        -dont send unwanted sorry ,please try to replay the query most
        -please dont replay to the general question`,
  urls: [],
};
