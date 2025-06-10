
// import React, { useState } from 'react';
// import axios from 'axios';

// function CApp() {
//   const [meetingName, setMeetingName] = useState('');
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const url = 'https://dev.konn3ct.ng/api/app/kv4/validate-meeting';
//       const payload = { name: meetingName };
//       const headers = { 'Content-Type': 'application/json' };

//       const res = await axios.post(url, payload, { headers });
//       setResponse(res.data);
//       setError(null);
//     } catch (err) {
//       setError(err.response ? err.response.data : err.message);
//       setResponse(null);
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Validate Meeting URL</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Meeting Name:
//           <input
//             type="text"
//             value={meetingName}
//             onChange={(e) => setMeetingName(e.target.value)}
//             required
//           />
//         </label>
//         <button type="submit">Validate</button>
//       </form>

//       {response && (
//         <div style={{ marginTop: '20px' }}>
//           <h2>Response</h2>
//           <pre>{JSON.stringify(response, null, 2)}</pre>
//         </div>
//       )}

//       {error && (
//         <div style={{ marginTop: '20px', color: 'red' }}>
//           <h2>Error</h2>
//           <pre>{JSON.stringify(error, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CApp;

import React, { useState } from 'react';
import axios from 'axios';

function CApp() {
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = 'https://dev.konn3ct.ng/api/app/kv4/join-room';
      const payload = { room, name, email, access_code: accessCode };
      const headers = { 'Content-Type': 'application/json' };

      const res = await axios.post(url, payload, { headers });
      setResponse(res.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
      setResponse(null);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Join Room</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Room:
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Access Code (optional):
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Join Room</button>
      </form>

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h2>Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h2>Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default CApp;