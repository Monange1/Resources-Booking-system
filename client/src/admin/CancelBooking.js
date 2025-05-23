import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CancelBooking = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setError('Please sign in to view bookings.');
        console.error("User not authenticated: user prop is null or undefined");
        return;
      }

      try {
        const token = await user.getIdToken();
        console.log(`Fetching bookings with token for ${user.email} at ${new Date().toISOString()}`);
        const response = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(`Received bookings data:`, response.data);
        setBookings(response.data);
        setError('');
      } catch (err) {
        console.error("Fetch bookings error:", JSON.stringify(err.response || err, null, 2));
        setError(err.response?.data?.error || 'Failed to load bookings. Please try again.');
      }
    };
    fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!user) {
      setError('Please sign in to cancel a booking.');
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      setSuccess('Booking cancelled successfully!');
    } catch (err) {
      console.error("Cancel booking error:", JSON.stringify(err.response || err, null, 2));
      setError(err.response?.data?.error || 'Error cancelling booking.');
    }
  };

  return (
    <div className="cancel-booking">
      <h2>Your Bookings</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map(booking => (
            <li key={booking._id}>
              Resource ID: {booking.resourceId}, 
              Start: {new Date(booking.start).toLocaleString()}, 
              End: {new Date(booking.end).toLocaleString()}, 
              Status: {booking.status}
              <button onClick={() => handleCancel(booking._id)} disabled={booking.status === 'cancelled'}>
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CancelBooking;