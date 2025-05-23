import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageResources.css";

const ManageResources = ({ user }) => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    location: "",
    requiresApproval: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchResources = async () => {
    if (!user) {
      console.error("User is not authenticated");
      setError("User is not authenticated");
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const res = await axios.get("http://localhost:5000/api/resources", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      setResources(res.data);
      setError("");
    } catch (err) {
      console.error("Fetch resources error:", JSON.stringify(err.response || err, null, 2));
      setError(err.response?.data?.error || "Failed to fetch resources.");
    }
  };

  useEffect(() => {
    fetchResources();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.type || !form.location) {
      setError("All fields are required.");
      return;
    }

    if (!user) {
      console.error("User is not authenticated");
      setError("User is not authenticated");
      return;
    }

    try {
      const token = await user.getIdToken();
      console.log("Sending POST to http://localhost:5000/api/resources with token:", token);
      console.log("Form data:", form);
      const response = await axios.post("http://localhost:5000/api/resources", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response:", response.data);
      setSuccess("Resource added successfully!");
      setForm({ name: "", type: "", location: "", requiresApproval: false });
      fetchResources();
    } catch (err) {
      console.error("Create resource error:", JSON.stringify(err.response || err, null, 2));
      setError(err.response?.data?.error || "Error creating resource!");
    }
  };

  const handleDelete = async (id) => {
    if (!user) {
      console.error("User is not authenticated");
      setError("User is not authenticated");
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.delete(`http://localhost:5000/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Resource deleted successfully!");
      fetchResources();
    } catch (err) {
      console.error("Delete resource error:", JSON.stringify(err.response || err, null, 2));
      setError(err.response?.data?.error || "Failed to delete resource.");
    }
  };

  return (
    <div className="manage-resources">
      <h2>Manage Resources</h2>

      <form className="resource-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Resource Name"
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="type"
          placeholder="Type (e.g. Room, Projector)"
          value={form.type}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleInputChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="requiresApproval"
            checked={form.requiresApproval}
            onChange={handleInputChange}
          />
          Requires Approval
        </label>
        <button type="submit">Add Resource</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <table className="resource-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>Requires Approval</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((res) => (
            <tr key={res._id}>
              <td>{res.name}</td>
              <td>{res.type}</td>
              <td>{res.location}</td>
              <td>{res.requiresApproval ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleDelete(res._id)} className="delete-btn">
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageResources;