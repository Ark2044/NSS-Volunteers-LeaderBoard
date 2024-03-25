// app.js
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/public", express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
const PORT = process.env.PORT;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

const Schema = mongoose.Schema;

const volunteerSchema = new Schema({
  srno: { type: Number, required: true, unique: true },
  vecno: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  eventsattained: [
    {
      eventcategory: String,
      eventname: String,
      date: mongoose.Schema.Types.Date,
      hoursalloted: mongoose.Schema.Types.Mixed,
    },
  ],
});

const VolunteerModel = mongoose.model("Volunteer", volunteerSchema);

// endpoint for fetching all volunteers
app.get("/get-all-volunteers", async (req, res) => {
  try {
    // Fetch all volunteers data from MongoDB
    const allVolunteers = await VolunteerModel.find();

    if (!allVolunteers || allVolunteers.length === 0) {
      console.log("No volunteers found");
      res.json([]); // Send an empty array if no volunteers are found
    } else {
      console.log("All volunteers data retrieved:");
      res.json(allVolunteers); // Send the array directly
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Serve static files from the 'frontend/build' directory
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Handle other routes and return the React app
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
  

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
