import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateBooking.css';

const CreateBooking = ({ user }) => {
  const [resourceId, setResourceId] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [resources, setResources] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/resources');
        setResources(res.data);
        setAvailableResources(res.data); // Initially, all resources are shown
        setError('');
      } catch (err) {
        console.error("Fetch resources error:", JSON.stringify(err.response || err, null, 2));
        setError(err.response?.data?.error || 'Failed to load resources.');
      }
    };
    fetchResources();
  }, []);

  const checkAvailability = async () => {
    if (!start || !end) return;

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate >= endDate) {
      setError('End time must be after start time.');
      return;
    }
    if (startDate < new Date()) {
      setError('Start time cannot be in the past.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/bookings/check-availability', {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });
      const available = resources.filter(resource =>
        !response.data.some(booking => booking.resourceId === resource._id)
      );
      setAvailableResources(available);
      setResourceId(''); // Reset selection if current resource is unavailable
    } catch (err) {
      console.error("Check availability error:", JSON.stringify(err.response || err, null, 2));
      setError(err.response?.data?.error || 'Error checking availability.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!resourceId || resourceId === '' || !availableResources.some(r => r._id === resourceId)) {
      setError('Please select a valid resource.');
      console.error("Validation failed: Invalid or missing resourceId");
      return;
    }
    if (!start || start.trim() === '') {
      setError('Start time is required.');
      console.error("Validation failed: Missing start time");
      return;
    }
    if (!end || end.trim() === '') {
      setError('End time is required.');
      console.error("Validation failed: Missing end time");
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime())) {
      setError('Invalid start time format.');
      return;
    }
    if (isNaN(endDate.getTime())) {
      setError('Invalid end time format.');
      return;
    }
    if (startDate >= endDate) {
      setError('End time must be after start time.');
      return;
    }
    if (startDate < new Date()) {
      setError('Start time cannot be in the past.');
      return;
    }

    if (!user) {
      setError('Please sign in to create a booking.');
      console.error("User not authenticated: user prop is null or undefined");
      return;
    }

    try {
      const token = await user.getIdToken();
      if (!token) {
        setError('Authentication token not available. Please sign in again.');
        console.error("No token received from user.getIdToken()");
        return;
      }

      const booking = {
        resourceId: resourceId.trim(),
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      };

      const response = await axios.post('http://localhost:5000/api/bookings', booking, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Booking created successfully!');
      setResourceId('');
      setStart('');
      setEnd('');
      setAvailableResources(resources); // Reset available resources
    } catch (err) {
      console.error("Create booking error:", JSON.stringify(err.response || err, null, 2));
      setError(err.response?.data?.error || 'Error creating booking.');
    }
  };

  return (
    <div className="create-booking">
      <h2>Create a Booking</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Start Time</label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              checkAvailability();
            }}
            required
          />
        </div>
        <div className="form-group">
          <label>End Time</label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => {
              setEnd(e.target.value);
              checkAvailability();
            }}
            required
          />
        </div>
        <div className="form-group">
          <label>Resource</label>
          <select
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            required
          >
            <option value="">Select a resource</option>
            {availableResources.map((resource) => (
              <option key={resource._id} value={resource._id}>
                {resource.name} ({resource.type}, {resource.location})
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Booking</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default CreateBooking;