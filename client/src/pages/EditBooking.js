import React, { useState, useEffect } from "react";
import axios from "axios";

const EditBooking = ({ bookingId }) => {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/bookings/${bookingId}`)
      .then((response) => setBooking(response.data))
      .catch((error) => console.error("Error fetching booking:", error));
  }, [bookingId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/bookings/${bookingId}`, booking)
      .then(() => alert("Booking updated!"))
      .catch((error) => console.error("Error updating booking:", error));
  };

  if (!booking) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Booking</h2>
      <label>Start Time:</label>
      <input
        type="datetime-local"
        value={booking.start}
        onChange={(e) => setBooking({ ...booking, start: e.target.value })}
      />
      <label>End Time:</label>
      <input
        type="datetime-local"
        value={booking.end}
        onChange={(e) => setBooking({ ...booking, end: e.target.value })}
      />
      <label>Room:</label>
      <input
        type="text"
        value={booking.room}
        onChange={(e) => setBooking({ ...booking, room: e.target.value })}
      />
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditBooking;
