import React, { useState, useEffect } from "react";
import axios from "axios";

function WebSocketComponent() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);

  const generateRandomId = (length) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const fetchUserData = async () => {
    try {
      const payload = {
        room: "standupmeet",
        name: "Samuel",
        email: "samjidiamond@gmail.com",
        access_code: "",
      };

      const url = "https://dev.konn3ct.ng/api/app/kv4/join-room";
      const headers = { "Content-Type": "application/json" };

      const res = await axios.post(url, payload, { headers });
      const sessionToken = res.data.data;

      const response = await axios.get(
        `https://meet.konn3ct.ng/bigbluebutton/api/enter?sessionToken=${sessionToken}`
      );

      if (
        response.data?.response?.returncode === "FAILED" 
       
      ) {
        setError(
          response.data?.response?.message ||
            "Failed to retrieve user session"
        );
        return;
      }

      console.log("Connect User:", response.data);
      setUser(response.data.response);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!user || !user.meetingID) return;

    const ws = new WebSocket(
      "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
      setSocket(ws);

      
  function sendWSMessage(subMsg){
    ws.send(`[${JSON.stringify(subMsg)}]`);
    setResponses((prev) => [...prev, `Sent: ${subMsg}`]);
  }


      // Log values for verification
      console.log("meetingID:", user.meetingID);
      console.log("internalUserID:", user.internalUserID);
      console.log("authToken:", user.authToken); // corrected line
      console.log("externUserID:", user.externUserID);

      // const validateMsg = 
      // JSON.stringify([{
      //   msg: "method",
      //   id: "2",
      //   method: "validateAuthToken",
      //   params: [
      //     user.meetingID,
      //     user.internalUserID,
      //     user.authToken, // ✅ Corrected this line
      //     user.externUserID,
      //   ],
      // }]);

      // ws.send(validateMsg);
      // setResponses((prev) => [...prev, `Sent: ${validateMsg}`]);

      
      const subMsg1 = '{"msg":"connect","version":"1","support":["1","pre2","pre1"]}';

      sendWSMessage(subMsg1);

      const subMsg2 = `{"msg":"method","id":"1","method":"userChangedLocalSettings",
        "params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,
        "userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,
        "userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,
        "guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,
        "pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},
        "audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},
        "dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}
        }]}`;

      sendWSMessage(subMsg2);

      const subMsg3= `{"msg":"method","id":"2","method":"validateAuthToken","params":["${user?.meetingID}","${user?.internalUserID}","${user?.authToken}","${user?.externUserID}"]}`;
      sendWSMessage(subMsg3);

      const subMsg4=`{"msg":"sub","id":"${generateRandomId(17)}","name":"auth-token-validation","params":[{"meetingId":"${user?.meetingID}","userId":"${user?.internalUserID}"}]}`;
      sendWSMessage(subMsg4);

      
const subMsg5=`{"msg":"sub","id":"${generateRandomId(17)}","name":"current-user","params":[]}`;
sendWSMessage(subMsg5);
const subMsg6=`{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":[]}`;
sendWSMessage(subMsg6);
const subMsg7=`{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":[]}`;
sendWSMessage(subMsg7);
const subMsg8=`{"msg":"sub","id":"${generateRandomId(17)}","name":"polls","params":[]}`;
sendWSMessage(subMsg8);
const subMsg9=`{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation","params":[]}`;
sendWSMessage(subMsg9);
const subMsg10=`{"msg":"sub","id":"${generateRandomId(17)}","name":"slides","params":[]}`;
sendWSMessage(subMsg10);
const subMsg11=`{"msg":"sub","id":"${generateRandomId(17)}","name":"slide-positions","params"[]}`;
sendWSMessage(subMsg11);
const subMsg12=`{"msg":"sub","id":"${generateRandomId(17)}","name":"captions","params":[]}`;
sendWSMessage(subMsg12);
const subMsg13=`{"msg":"sub","id":"${generateRandomId(17)}","name":"voiceUsers","params":[]}`;
sendWSMessage(subMsg13);
const subMsg14=`{"msg":"sub","id":"${generateRandomId(17)}","name":"whiteboard-multi-user","params":[]}`;
sendWSMessage(subMsg14);
const subMsg15=` {"msg":"sub","id":"${generateRandomId(17)}","name":"screenshare","params":[]}`;
sendWSMessage(subMsg15);
const subMsg16=` {"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat","params":[]}`;
sendWSMessage(subMsg16);
const subMsg17=` {"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat-msg","params":[]}`;
sendWSMessage(subMsg17);
const subMsg18=` {"msg":"sub","id":"${generateRandomId(17)}","name":"presentation-pods","params":[]}`;
sendWSMessage(subMsg18);
const subMsg19=` {"msg":"sub","id":"${generateRandomId(17)}","name":"users-settings","params":[]}`;
sendWSMessage(subMsg19);
const subMsg20=` {"msg":"sub","id":"${generateRandomId(17)}","name":"users-infos","params":[]}`;
sendWSMessage(subMsg20);
const subMsg21=` {"msg":"sub","id":"${generateRandomId(17)}","name":"note","params":[]}`;
sendWSMessage(subMsg21);
const subMsg22=` {"msg":"sub","id":"${generateRandomId(17)}","name":"meeting-time-remaining","params":[]}`;
sendWSMessage(subMsg22);
const subMsg23=` {"msg":"sub","id":"${generateRandomId(17)}","name":"local-settings","params":[]}`;
sendWSMessage(subMsg23);
const subMsg24=` {"msg":"sub","id":"${generateRandomId(17)}","name":"users-typing","params":[]}`;
sendWSMessage(subMsg24);
const subMsg25=` {"msg":"sub","id":"${generateRandomId(17)}","name":"record-meetings,"params":[]}`;
sendWSMessage(subMsg25);
const subMsg26=` {"msg":"sub","id":"${generateRandomId(17)}","name":"video-streams","params":[]}`;
sendWSMessage(subMsg26);
const subMsg27=` {"msg":"sub","id":"${generateRandomId(17)}","name":"connection-status","params":[]}`;
sendWSMessage(subMsg27);
const subMsg28=` {"msg":"sub","id":"${generateRandomId(17)}","name":"voice-call-status","params":[]}`;
sendWSMessage(subMsg28);
const subMsg29=` {"msg":"sub","id":"${generateRandomId(17)}","name":"external-video-meetings","params":[]}`;
sendWSMessage(subMsg29);
const subMsg30=` {"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":["MODERATOR"]}`;
sendWSMessage(subMsg30);
const subMsg31=` {"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":["MODERATOR"]}`;
sendWSMessage(subMsg31);
const subMsg32=` {"msg":"sub","id":"${generateRandomId(17)}","name":"breakouts","params":["MODERATOR"]}`;
sendWSMessage(subMsg32);
const subMsg33=` {"msg":"sub","id":"${generateRandomId(17)}","name":"guestUsers","params":["MODERATOR"]}`;
sendWSMessage(subMsg33);
const subMsg34=` {"msg":"sub","id":"${generateRandomId(17)}","name":"annotations","params":[]}`;
sendWSMessage(subMsg34);

      
    };

    ws.onmessage = (event) => {
      console.log("Raw WebSocket message:", event.data);

      let data = event.data;

      if (data.startsWith("a[")) {
        try {
          const outer = JSON.parse(data.slice(1, -1));
          data = JSON.parse(outer);
        } catch (e) {
          console.error("Failed to parse message", e);
          return;
        }
      }

      console.log("Parsed WebSocket message:", data);
      setResponses((prev) => [...prev, `Received: ${JSON.stringify(data)}`]);

      if (data.msg === "error") {
        setError(`WebSocket error: ${data.reason}`);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError(`WebSocket error: ${err.message}`);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>WebSocket Integration</h1>

      {error && (
        <div style={{ color: "red" }}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}

      {user && (
        <div>
          <h2>User Data</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}

      <div>
        <h2>WebSocket Communication</h2>
        {responses.map((msg, i) => (
          <div
            key={i}
            style={{
              margin: "5px 0",
              padding: "5px",
              border: "1px solid #ddd",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
            }}
          >
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WebSocketComponent;



// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function WebSocketComponent() {
//   const [user, setUser] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [error, setError] = useState(null);

//   // Function to generate random ID
//   const generateRandomId = (length) => {
//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let result = "";
//     for (let i = 0; i < length; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return result;
//   };

//   const fetchUserData = async () => {
//     try {
//       const payload = {
//         room: "standupmeet",
//         name: "Samuel",
//         email: "samjidiamond@gmail.com",
//         access_code: "",
//       };
    
//           const url = 'https://dev.konn3ct.ng/api/app/kv4/join-room';
//           const headers = { 'Content-Type': 'application/json' };
    
//           const res = await axios.post(url, payload, { headers });

//       const sessionToken = res.data.data;


//       const response = await axios.get(
//         `https://meet.konn3ct.ng/bigbluebutton/api/enter?sessionToken=${sessionToken}`
//       );
//       console.log("is if connected")
//       if (
//         response.data?.response?.returncode === "FAILED" ||
//         !response.data?.meetingDetails
//       )
//       //  {
//       //   setError(response.data?.response?.message || "Failed to retrieve user session");
//       //   return;
//       // }
//       console.log("Connect User:",response.data)
//       setUser(response.data);
//       console.log("User Connected:",user)
//     } catch (err) {
//       setError(err.message);
//     }
//   };


//   // Fetch user data first
//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   // Establish WebSocket connection when user data is available
//   useEffect(() => {
//     console.log("Launch websocket");
//     console.log("user meeting:",user);

//     if (!user) return;

//     console.log("user:",user);
//     console.log("user.meetingDetails:",user.meetingDetails)

    
//     console.log("I want to lauch websocket")
//     const ws = new WebSocket(
//       "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
//     );
//     console.log("I have lauched websocket")
//     ws.onopen = () => {
//       console.log("WebSocket connected");
//       setSocket(ws);

//       // Validate auth token
//       const validateMsg = JSON.stringify({
//         msg: "method",
//         id: "2",
//         method: "validateAuthToken",
//         params: [
//           user.meetingID,
//           user.internalUserID,
//           user.authToken,
//           user.externUserID,
//         ],
//       });

//       ws.send(validateMsg);
//       setResponses((prev) => [...prev, `Sent: ${validateMsg}`]);

//       // Subscribe to authentication validation
//       const subMsg = JSON.stringify({
//         msg: "sub",
//         id: generateRandomId(17),
//         name: "auth-token-validation",
//         params: [
//           {
//             meetingId: user.meetingDetails.meetingID,
//             userId: user.meetingDetails.internalUserID,
//           },
//         ],
//       });

//       ws.send(subMsg);
//       setResponses((prev) => [...prev, `Sent: ${subMsg}`]);
//     };

//     ws.onmessage = (event) => {
//       let formattedData = event.data;

//       // Handling SockJS messages properly
//       if (formattedData.startsWith("a[")) {
//         try {
//           formattedData = JSON.parse(formattedData.slice(1, -1));
//         } catch (e) {
//           console.error("Failed to parse message", e);
//         }
//       }

//       setResponses((prev) => [...prev, `Received: ${JSON.stringify(formattedData)}`]);

//       // Handle authentication failure
//       if (formattedData.msg === "error") {
//         setError(`WebSocket error: ${formattedData.reason}`);
//       }
//     };

//     ws.onerror = (err) => {
//       setError(`WebSocket error: ${err.message}`);
//     };

//     ws.onclose = () => {
//       console.log("WebSocket disconnected");
//     };

//     // return () => {
//     //   if (ws.readyState === WebSocket.OPEN) {
//     //     ws.close();
//     //   }
//     // };

//   }, [user]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>WebSocket Integration</h1>

//       {error && (
//         <div style={{ color: "red" }}>
//           <h2>Error</h2>
//           <p>{error}</p>
//         </div>
//       )}

//       {user && (
//         <div>
//           <h2>User Data</h2>
//           <pre>{JSON.stringify(user, null, 2)}</pre>
//         </div>
//       )}

//       <div>
//         <h2>WebSocket Communication</h2>
//         {responses.map((msg, i) => (
//           <div
//             key={i}
//             style={{
//               margin: "5px 0",
//               padding: "5px",
//               border: "1px solid #ddd",
//               fontFamily: "monospace",
//               whiteSpace: "pre-wrap",
//             }}
//           >
//             {msg}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default WebSocketComponent;



