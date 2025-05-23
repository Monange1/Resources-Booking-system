const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const admin = require('firebase-admin');
const resourcesRoutes = require('./routes/resources');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('./booking-system-b425d-firebase-adminsdk-fbsvc-f619254805.json')),
});

// Test route
app.get("/", (req, res) => {
  console.log(`Root route accessed at ${new Date().toISOString()}`);
  res.send("✅ Server is working");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(`✅ MongoDB connected at ${new Date().toISOString()}`))
.catch((err) => {
  console.error(`❌ MongoDB connection error at ${new Date().toISOString()}:`, err.stack);
  process.exit(1);
});

// Routes
console.log("Mounting routes...");
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/resources", resourcesRoutes);

// Catch-all route for 404s
app.use((req, res, next) => {
  console.log(`404 Not Found at ${new Date().toISOString()}: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Not Found" });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(`Server error at ${new Date().toISOString()}:`, {
    error: err.stack,
    request: { method: req.method, url: req.url, body: req.body, headers: req.headers },
  });
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} at ${new Date().toISOString()}`);
});