import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CalendarView.css'; // Add CSS for styling

const CalendarView = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = await user.getIdToken();
        const res = await axios.get('/api/bookings/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  return (
    <div className="calendar-view">
      <h2>Booking Calendar</h2>
      <p>Welcome, {user.email}!</p>
      <Link to="/calendar/create" className="create-booking-link">
        Create New Booking
      </Link>

      <h3>Your Bookings</h3>
      {loading ? (
        <p className="loading">Loading bookings...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="no-bookings">You have no bookings. Create one to get started!</p>
      ) : (
        <ul className="bookings-list">
          {bookings.map((booking) => (
            <li key={booking._id} className="booking-item">
              <span className="resource-name">{booking.resourceId?.name || 'Unknown Resource'}</span>
              <span className="time-slot">
                {new Date(booking.start).toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}{' '}
                -{' '}
                {new Date(booking.end).toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CalendarView;