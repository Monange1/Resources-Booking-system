const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const admin = require('firebase-admin');

// Middleware to check for authenticated user
const requireAuth = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      console.log(`No token provided at ${new Date().toISOString()}`);
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error(`Token verification error at ${new Date().toISOString()}:`, err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// POST /api/bookings/check-availability - Check resource availability
router.post('/check-availability', async (req, res) => {
  try {
    const { start, end } = req.body;

    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end times are required' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const conflictingBookings = await Booking.find({
      $or: [
        { start: { $lte: endDate }, end: { $gte: startDate } },
      ],
    });

    res.json(conflictingBookings);
  } catch (err) {
    console.error(`Error checking availability at ${new Date().toISOString()}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/my-bookings - Fetch user's bookings
router.get('/my-bookings', requireAuth, async (req, res) => {
  try {
    console.log(`Fetching bookings for user ${req.user.email} at ${new Date().toISOString()}`);
    const bookings = await Booking.find({ userEmail: req.user.email });
    console.log(`Found ${bookings.length} bookings for ${req.user.email}`);
    res.json(bookings);
  } catch (err) {
    console.error(`Error fetching bookings at ${new Date().toISOString()}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/bookings/:id - Cancel a booking
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    if (booking.userEmail !== req.user.email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error(`Error cancelling booking at ${new Date().toISOString()}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bookings - Create a new booking
router.post('/', requireAuth, async (req, res) => {
  try {
    const { resourceId, start, end } = req.body;

    console.log(`Received booking request at ${new Date().toISOString()}:`, { resourceId: typeof resourceId, start: typeof start, end: typeof end, rawData: req.body });

    if (typeof resourceId !== 'string' || resourceId.trim() === '') {
      console.log(`Invalid resourceId at ${new Date().toISOString()}:`, resourceId);
      return res.status(400).json({ error: 'Resource ID is required' });
    }
    if (typeof start !== 'string' || start.trim() === '') {
      console.log(`Invalid start at ${new Date().toISOString()}:`, start);
      return res.status(400).json({ error: 'Start time is required' });
    }
    if (typeof end !== 'string' || end.trim() === '') {
      console.log(`Invalid end at ${new Date().toISOString()}:`, end);
      return res.status(400).json({ error: 'End time is required' });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      console.log(`Resource not found: ${resourceId} at ${new Date().toISOString()}`);
      return res.status(400).json({ error: 'Resource not found' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime())) {
      console.log(`Invalid start date format at ${new Date().toISOString()}: ${start}`);
      return res.status(400).json({ error: 'Invalid start time format' });
    }
    if (isNaN(endDate.getTime())) {
      console.log(`Invalid end date format at ${new Date().toISOString()}: ${end}`);
      return res.status(400).json({ error: 'Invalid end time format' });
    }
    if (startDate >= endDate) {
      console.log(`Invalid date range at ${new Date().toISOString()}: Start ${start}, End ${end}`);
      return res.status(400).json({ error: 'End time must be after start time' });
    }
    if (startDate < new Date()) {
      console.log(`Past start time at ${new Date().toISOString()}: ${start}`);
      return res.status(400).json({ error: 'Start time cannot be in the past' });
    }

    const conflictingBookings = await Booking.find({
      resourceId,
      $or: [
        { start: { $lte: endDate }, end: { $gte: startDate } },
      ],
    });

    if (conflictingBookings.length > 0) {
      console.log(`Conflict found for resource ${resourceId} at ${new Date().toISOString()}`);
      return res.status(400).json({ error: 'Resource is already booked for the selected time' });
    }

    const booking = new Booking({
      userEmail: req.user.email,
      resourceId,
      start: startDate,
      end: endDate,
      status: resource.requiresApproval ? 'pending' : 'confirmed',
    });

    await booking.save();
    console.log(`Booking created successfully at ${new Date().toISOString()} for ${req.user.email}`);
    res.status(201).json(booking);
  } catch (err) {
    console.error(`Error creating booking at ${new Date().toISOString()}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;