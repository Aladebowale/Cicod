import React, { useState } from 'react';
import axios from 'axios';

function AxiosSD() {
  // State to hold the previous data
  const [previousData, setPreviousData] = useState({
    room: 'standupmeet',
    name: 'Samuel',
    email: 'samjidiamond@gmail.com',
    access_code: '',
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const constructSessionToken = (data) => {
    const sessionToken = JSON.stringify(data);

    return encodeURIComponent(sessionToken); 
  };

  const fetchData = async () => {
    try {
      const sessionToken = constructSessionToken(previousData);
      const url = `https://meet.konn3ct.ng/bigbluebutton/api/enter?sessionToken=${sessionToken}`;
      const result = await axios.get(url);

      setResponse(result.data);
      setError(null); 
    } catch (err) {
      setError(err.message);
      setResponse(null); 
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Meet Konn3ct API Integration</h1>
      <div>
        <h2>Previous Data</h2>
        <pre>{JSON.stringify(previousData, null, 2)}</pre>
      </div>

      <button onClick={fetchData}>Send Request</button>

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h2>Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default AxiosSD;