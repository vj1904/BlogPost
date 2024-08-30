require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://blogpost-jade.vercel.app"], // Allow both localhost and Vercel
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("MongoDB URI is not defined in .env file");
  process.exit(1);
}
mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/", require("./routes/postRoutes"));
app.get("/", (req, res) => {
  res.send("Server is up and running !");
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
