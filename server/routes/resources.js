const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const admin = require('firebase-admin');

// Middleware to check for admin
const requireAdmin = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      console.log(`No token provided at ${new Date().toISOString()}`);
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken.admin) {
      console.log(`Not an admin at ${new Date().toISOString()}, UID: ${decodedToken.uid}`);
      return res.status(403).json({ error: 'Not an admin' });
    }

    req.user = decodedToken;
    next();
  } catch (err) {
    console.error(`Token verification error at ${new Date().toISOString()}:`, err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// POST /api/resources (Admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, type, location, requiresApproval } = req.body;
    if (!name || !type || !location) {
      console.log(`Missing fields at ${new Date().toISOString()}:`, { name, type, location });
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const resource = new Resource({ name, type, location, requiresApproval });
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    console.error(`Error creating resource at ${new Date().toISOString()}:`, err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// GET /api/resources (Public access)
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    console.error(`Error fetching resources at ${new Date().toISOString()}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/resources/:id (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    console.error(`Error deleting resource at ${new Date().toISOString()}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;