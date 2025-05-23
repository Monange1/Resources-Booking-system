import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResourcesList = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/resources')  // Make sure this is correct
      .then((response) => {
        setResources(response.data);
      })
      .catch((error) => {
        console.error('Error fetching resources:', error);
      });
  }, []);

  return (
    <div>
      <h2>Available Resources</h2>
      <ul>
        {resources.map((resource) => (
          <li key={resource._id}>
            <strong>{resource.name}</strong> - {resource.type} (Location: {resource.location})
            <br />
            {resource.requiresApproval ? 'Approval Required' : 'No Approval Required'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourcesList;
