import React, { useState } from "react";
import axios from "axios";

const CreateResource = () => {
  const [resourceName, setResourceName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/resources", {
        name: resourceName,
        type,
        location,
        requiresApproval,
      });

      // Successfully created resource
      console.log("Resource created successfully:", response.data);
    } catch (error) {
      // Log the error
      console.error("Error creating resource:", error.response?.data || error.message);

      // Show an alert to the user
      alert("Error creating resource!");
    }
  };

  return (
    <div>
      <h2>Create Resource</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Type:
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <br />
        <label>
          Requires Approval:
          <input
            type="checkbox"
            checked={requiresApproval}
            onChange={(e) => setRequiresApproval(e.target.checked)}
          />
        </label>
        <br />
        <button type="submit">Create Resource</button>
      </form>
    </div>
  );
};

export default CreateResource;
