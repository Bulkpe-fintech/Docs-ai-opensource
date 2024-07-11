# Docs ai open source by Bulkpe

## Description
Docs AI is a chatbot that allows users to add PDFs, URLs, or Notion pages as sources of knowledge. Users can then ask any query regarding the provided documents.

## Getting Started

### Prerequisites
- Node.js (version 21 or above)
- NPM (Node Package Manager)

### Steps to Clone and Setup the Repository

1. **Clone this repository**
   ```sh
   git clone https://github.com/Bulkpe-fintech/Docs-ai-opensource.git
   cd Docs-ai-opensource

### Step 1: Prepare and Host Backend Code
### Backend Setup (Node.js)
1.	Navigate to the backend directory:
```sh
cd src/Backend
```
2.	Install the required dependencies:
```sh
npm install
```
3.	Configure the environment variables by creating a .env file with the following parameters:
```sh
PORT="<your_port>"  optional
MONGO_DB_URL="<your_mongo_db_url> " optional
NOTION_API_KEY="<your_notion_api_key>"  optional
NOTION_PAGE_ID="<your_notion_page_id>"  optional
OPEN_API_KEY="<your_open_api_key>" mand
```
4.	Run the backend code:
```sh
node app.js
```
5.	Test the backend to ensure it is working properly.
6.	Host the backend code on any server and obtain the URL for the next step.

### Step 2: Build the Widget
### Widget Setup (React)

1.	Navigate to the frontend directory:
```sh
cd src/frontend
```
2.	Install the required packages:
```sh
npm install
```
3.	Update the src/config.js file with the following parameters:
```sh
module.exports = {
BASE = '<your_backend_hosted_url>';
preDefinedQuestions = [
    // Your predefined questions here
    e.g: what is  bulkpe?,what we can do?
];
widgetHeading: "Docs AI",
widgetDiscription: "from bulkpe",
}
```
4.	Run the code to test the widget:
```sh
npm start
```
5.	If the widget works fine, build the production version:
```sh
npm run build
```
6.	The build command will create a dist folder. Inside the dist folder, you will find a bundle.min.js file. This file is needed for your site. get it to the next step.

### Step 3: Test the Widget
1.	Navigate to the sample site directory:
```sh
cd Example
```
2.	Paste the bundle.min.js file into this folder.
3.	Run the HTML file to test the sample site. You should see the chat widget in the bottom right corner.


