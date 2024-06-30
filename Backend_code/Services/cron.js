const fs = require("fs");
require("dotenv").config();
const axios = require("axios");
const cron = require("node-cron");
const scrape = require("./scrapeKnowledge");

// Function to fetch Notion page blocks
async function fetchAllNotionBlocks(pageId) {
  let allBlocks = [];
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    const response = await axios.get(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": "2021-05-13",
      },
      params: {
        start_cursor: startCursor,
      },
    });

    allBlocks = allBlocks.concat(response.data.results);
    hasMore = response.data.has_more;
    startCursor = response.data.next_cursor;
  }
  return allBlocks;
}
async function updateTextFileAndSave(filePath, pageId) {
  const blocks = await fetchAllNotionBlocks(pageId);
  let textContent = "";

  for (const block of blocks) {
    if (block.paragraph) {
      const text = block.paragraph.text.map((t) => t.plain_text).join("\n");
      textContent += text + "\n\n";
    }
  }

  fs.writeFileSync(filePath, textContent);
  console.log("New text file created and updated successfully:", filePath);
}

cron.schedule("*/5 * * * *", async () => {
  const pageId = process.env.NOTION_PAGE;
  const textFilePath = "./Source/output.txt";

  try {
    await updateTextFileAndSave(textFilePath, pageId);
    console.log("doc content updated successfully");
  } catch (error) {
    console.error("Error updating PDF:", error);
  }
});

cron.schedule("*/5 * * * *", async () => {
  try {
    await scrape.scrapeWebsite();
    console.log("doc content updated successfully");
  } catch (error) {
    console.error("Error updating PDF:", error);
  }
});
