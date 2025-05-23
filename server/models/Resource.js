// server/models/Resource.js

const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  requiresApproval: { type: Boolean, default: false },
});

module.exports = mongoose.model("Resource", ResourceSchema);
