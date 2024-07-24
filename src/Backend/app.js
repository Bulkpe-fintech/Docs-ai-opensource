const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cron = require("./Services/cron");
const path = require("path");
const PORT = process.env.PORT || 3000;
require("dotenv").config();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());
app.use(bodyParser.text());
app.use(express.static("public"));
app.set("trust proxy", true);
app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"));
});
// Route setup
app.use("/api", require("./Routes/index"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Handling 404 Not Found errors
app.use((req, res) => {
  res.status(404).send("URL Not Found");
});

// Connect to MongoDB
if (process.env.DB && process.env.DB != "") {
  mongoose.Promise = global.Promise;
  mongoose
    .connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to the database");
      // Start the server after successfully connecting to the database
    })
    .catch((err) => {
      console.error("Could not connect to the database. Exiting now...", err);
      process.exit(1); // Exiting the application with an error status
    });
} else {
}

cron;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
