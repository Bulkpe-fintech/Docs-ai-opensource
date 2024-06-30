const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const url = require("../Configs");

const urls = url.urlForScrape;
module.exports = {
  scrapeWebsite: async () => {
    let allContent = [];
    for (const url of urls) {
      const content = await scrapePage(url);
      allContent = allContent.concat(content);
    }

    let formattedContent = allContent
      .filter((line) => line.trim() !== "")
      .map((line) => `    ${line.trim()}`)
      .join("\n");
    fs.appendFile("./Source/output.txt", formattedContent, (err) => {
      if (err) {
        console.error("Error appending to file:", err);
      } else {
        console.log("Content successfully appended!");
      }
    });
  },
};
async function scrapePage(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract specific content; modify selectors based on the actual content
    let content = [];
    $("h2, h3, p").each((i, element) => {
      content.push($(element).text());
    });

    return content;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return [];
  }
}
