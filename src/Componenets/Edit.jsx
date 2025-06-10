// import React, { useState, useEffect } from "react";
// import Header from "./Header";
// import SemiHead from "./SemiHead";
// import micon from "../Images/Icon/Mic-On.png";
// import voff from "../Images/Icon/video-off.png";
// import von from "../Images/Icon/Video On.png";
// import micoff from "../Images/Icon/mic off.png";
// import vector from "../Images/Icon/Vector.png";
// import Avatar1 from "../Images/ava 1.png";
// import Avatar2 from "../Images/ava 2.png";
// import Avatar3 from "../Images/ava 3.png";
// import Avatar4 from "../Images/ava 4.png";
// import Avatar6 from "../Images/Icon/avatar 6.png";
// import maximize from "../Images/maximize-2.png";
// import sound from "../Images/sound.png";
// import Participant1 from "../Images/participant 1.png";
// import AddUser from "../Images/user-add.png";
// import Comp2 from "../Images/Icon/Component 2.png";
// import Vect2 from "../Images/Icon/Vector (2).png";
// import Icon2 from "../Images/Icon/Icons (2).png";
// import speaker from "../Images/Speaker.png";
// import slider from "../Images/Icon/Button.png";
// import Protector from "../Images/Protect.png";
// import Icon from "../Images/Iconic 2.png";
// import Gridone from "../Images/Frame 1707480527.png";
// import Gridtwo from "../Images/Icons 3.png";
// import MIC from "../Images/Icon/microphone-slash.png";
// import axios from "axios";

// const VWeb = () => {
//   const [user, setUser] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [error, setError] = useState(null);
//   const [participants, setParticipants] = useState([]);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [message, setMessage] = useState("");

//   const generateRandomId = (length) => {
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

//       const url = "https://dev.konn3ct.ng/api/app/kv4/join-room";
//       const headers = { "Content-Type": "application/json" };

//       const res = await axios.post(url, payload, { headers });
//       const sessionToken = res.data.data;

//       const response = await axios.get(
//         `https://meet.konn3ct.ng/bigbluebutton/api/enter?sessionToken=${sessionToken}`
//       );

//       if (response.data?.response?.returncode === "FAILED") {
//         setError(response.data?.response?.message || "Failed to retrieve user session");
//         return;
//       }

//       console.log("Connect User:", response.data);
//       setUser(response.data.response);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     if (!user || !user.meetingID) return;

//     // Note: The WebSocket URL may need to be dynamically generated or verified
//     const ws = new WebSocket(
//       "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
//     );

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//       setSocket(ws);

//       const sendWSMessage = (subMsg) => {
//         ws.send(`[${subMsg}]`);
//         setResponses((prev) => [...prev, `Sent: ${subMsg}`]);
//       };

//       // Initial WebSocket messages for connection and subscriptions
//       const messages = [
//         `{"msg":"connect","version":"1","support":["1","pre2","pre1"]}`,
//         `{"msg":"method","id":"1","method":"userChangedLocalSettings","params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,"userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,"userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,"guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,"pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},"audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},"dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}}]}`,
//         `{"msg":"method","id":"2","method":"validateAuthToken","params":["${user.meetingID}","${user.internalUserID}","${user.authToken}","${user.externUserID}"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"auth-token-validation","params":[{"meetingId":"${user.meetingID}","userId":"${user.internalUserID}"}]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"current-user","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"polls","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"slides","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"slide-positions","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"captions","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"voiceUsers","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"whiteboard-multi-user","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"screenshare","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat-msg","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation-pods","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-settings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-infos","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"note","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meeting-time-remaining","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"local-settings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-typing","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"record-meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"video-streams","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"connection-status","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"voice-call-status","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"external-video-meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"breakouts","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"guestUsers","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"annotations","params":[]}`,
//       ];

//       messages.forEach(sendWSMessage);
//     };

//     ws.onmessage = (event) => {
//       console.log("Raw WebSocket message:", event.data);
//       let data = event.data;

//       // BigBlueButton WebSocket messages are wrapped in an array
//       if (data.startsWith("a[")) {
//         try {
//           const outer = JSON.parse(data.slice(1, -1));
//           data = JSON.parse(outer);
//         } catch (e) {
//           console.error("Failed to parse message", e);
//           return;
//         }
//       } else {
//         try {
//           data = JSON.parse(data);
//         } catch (e) {
//           console.error("Failed to parse message", e);
//           return;
//         }
//       }

//       console.log("Parsed WebSocket message:", data);
//       setResponses((prev) => [...prev, `Received: ${JSON.stringify(data)}`]);

//       // Handle errors
//       if (data.msg === "error") {
//         setError(`WebSocket error: ${data.reason}`);
//       }

//       // Handle user updates
//       if (data.msg === "added" && data.collection === "users") {
//         console.log("New user joined:", data.fields);
//         setParticipants((prev) => [
//           ...prev,
//           { id: data.id, name: data.fields.name, isCoHost: data.fields.role === "MODERATOR" },
//         ]);
//       }

//       if (data.msg === "removed" && data.collection === "users") {
//         console.log("User left:", data.id);
//         setParticipants((prev) => prev.filter((p) => p.id !== data.id));
//       }

//       // Handle chat messages
//       if (data.msg === "added" && data.collection === "group-chat-msg") {
//         console.log("New chat message:", data.fields);
//         setChatMessages((prev) => [
//           ...prev,
//           {
//             name: data.fields.sender.name || "Guest",
//             message: data.fields.message,
//             timestamp: new Date(data.fields.timestamp),
//           },
//         ]);
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("WebSocket error:", err);
//       setError("WebSocket error occurred");
//     };

//     ws.onclose = () => {
//       console.log("WebSocket disconnected");
//       setSocket(null);
//     };

//     return () => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//     };
//   }, [user]);

//   const sendChatMessage = () => {
//     if (!user || !message.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
//       console.error("Cannot send message: Invalid user, empty message, or WebSocket not connected");
//       return;
//     }

//     const chatId = "MAIN-PUBLIC-GROUP-CHAT";
//     const correlationId = `${user.internalUserID}-${Date.now()}`;
//     const sender = {
//       id: user.internalUserID,
//       name: user.name || "Guest",
//       role: "",
//     };

//     const chatMessage = {
//       msg: "method",
//       id: generateRandomId(10),
//       method: "sendGroupChatMsg",
//       params: [
//         chatId,
//         {
//           correlationId,
//           sender,
//           chatEmphasizedText: true,
//           message: message.trim(),
//         },
//       ],
//     };

//     try {
//       socket.send(`[${JSON.stringify(chatMessage)}]`);
//       setResponses((prev) => [...prev, `Sent: ${JSON.stringify(chatMessage)}`]);
//       console.log("Chat message sent:", chatMessage);

//       // Optimistically add the message to the UI
//       setChatMessages((prev) => [
//         ...prev,
//         {
//           name: user.name || "Guest",
//           message: message.trim(),
//           timestamp: new Date(),
//         },
//       ]);
//       setMessage("");
//     } catch (err) {
//       console.error("Failed to send chat message:", err);
//       setError("Failed to send chat message");
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen w-full bg-gray-100 p-4 md:p-8">
//       <Header />
//       <SemiHead />

//       <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 shadow-md mt-1 mb-1">
//         <div className="flex space-x-3 items-center">
//           <img src={Protector} alt="P 1" className="w-8 md:w-4 h-8 md:h-4 border-2 border-white mr-8 md:mr-4" />
//           <div className="flex items-center">
//             <img src={Icon} alt="P 2" className="w-8 md:w-4 h-8 md:h-4 border-2 border-white" />
//             <img src={Gridone} alt="P 3" className="w-6 md:w-3 h-6 md:h-3 border-2 border-white" />
//             <img src={Gridtwo} alt="P 4" className="w-8 md:w-8 h-8 md:h-4 border-2 border-white" />
//           </div>
//         </div>

//         <div className="flex items-center space-x-3">
//           <div className="flex -space-x-2">
//             {participants.slice(0, 4).map((participant, index) => {
//               let avatarSrc;
//               switch (index) {
//                 case 0:
//                   avatarSrc = Avatar1;
//                   break;
//                 case 1:
//                   avatarSrc = Avatar2;
//                   break;
//                 case 2:
//                   avatarSrc = Avatar3;
//                   break;
//                 case 3:
//                   avatarSrc = Avatar4;
//                   break;
//                 default:
//                   avatarSrc = Avatar1;
//               }
//               return (
//                 <img
//                   key={participant?.id}
//                   src={avatarSrc}
//                   alt={participant?.name}
//                   className="w-8 h-8 rounded-full border-2 border-white"
//                 />
//               );
//             })}
//             {participants.length > 4 && (
//               <div
//                 className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E8F2EE] text-[#1E6132] font-semibold text-sm border-2 border-white"
//               >
//                 +{participants.length - 4}
//               </div>
//             )}
//           </div>
//           <button className="bg-[#E8F2EE] text-[#1E6132] px-3 py-1 rounded-lg">Code: cem-jmnt-hsu</button>
//           <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-4 py-2 shadow-sm bg-white">
//             <div className="relative w-6 h-6 flex items-center justify-center">
//               <div className="absolute w-full h-full border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
//               <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//             </div>
//             <span className="text-gray-700 text-sm font-medium">13:03:34</span>
//           </div>
//         </div>
//       </div>

//       <div className="w-full h-screen bg-white flex">
//         <div className="flex-1 flex flex-col items-center justify-center p-4">
//           <div className="relative">
//             <img className="w-screen h-[400px] rounded-xl object-cover" src={speaker} alt="Active Speaker" />
//             <div className="absolute top-4 left-4 flex items-center space-x-2 border border-gray-400 rounded-lg px-4 py-2 shadow-sm bg-white">
//               <div className="w-6 h-6 flex items-center justify-center">
//                 <div className="absolute border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
//                 <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//               </div>
//               <span className="text-gray-700 text-sm font-medium">13:03:34</span>
//             </div>
//             <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md">Adam Joseph</div>
//             <button className="absolute top-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={maximize} alt="screen size" />
//             </button>
//             <button className="absolute bottom-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={sound} alt="sound" />
//             </button>
//           </div>

// {/* Participants  */}
//           <div className="w-full max-w-4xl mt-4 grid grid-cols-4 gap-2">
//             {participants.slice(0, 4).map((participant) => (
//               <div key={participant?.id} className="relative">
//                 <img className="w-full h-24 rounded-xl object-cover" src={Participant1} alt="Participant" />
//                 <span className="absolute bottom-2 left-4 text-xs bg-gray-800 text-white px-2 py-1 rounded-md">
//                   {participant?.name || "Participant"}
//                 </span>
//                 <button className="absolute bottom-2 right-4 text-white bg-[#EF4444] bg-opacity-70 p-2 rounded-full h-8 w-8">
//                   <img src={MIC} alt="sound" />
//                 </button>
//               </div>
//             ))}
//             {participants.length > 4 && (
//               <div className="bg-green-800 h-24 rounded-xl flex items-center justify-center text-white font-semibold">
//                 +{participants.length - 4} More
//               </div>
//             )}
//             {participants.length < 4 &&
//               Array(4 - participants.length)
//                 .fill(null)
//                 .map((_, index) => (
//                   <div
//                     key={`empty-${index}`}
//                     className="bg-gray-300 h-24 rounded-xl flex items-center justify-center text-gray-600 font-semibold"
//                   >
//                     Empty
//                   </div>
//                 ))}
//           </div>

// {/* Controls */}
//           <div className="w-full max-w-4xl mt-6 flex justify-between">
//             <div>
//               <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={slider} alt="slider" className="w-12 h-4" />
//               </div>
//             </div>
//             <div className="flex space-x-1">
//               <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="slider" className="min-w-min h-4" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Vect2} alt="slider" className="w-4 h-4" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Icon2} alt="slider" className="w-4 h-4" />
//               </div>
//               <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="slider" className="w-4 h-4" />
//               </div>
//               <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="slider" className="w-4 h-4" />
//               </div>
//             </div>
//             <button className="bg-[#EF4444] text-white py-2 px-4 rounded-lg">Leave Meeting</button>
//           </div>
//         </div>

// {/* Sidebar */}
//         <div className="w-80 bg-white p-4 shadow-lg h-full overflow-y-auto">
//           <div>
//             <div className="flex flex-row space-x-1 items-center">
//               <h2 className="text-sm font-semibold">Participants ({participants.length})</h2>
//               <div className="bg-green-100 text-green-700 px-4 py-1 mt-2 rounded-full space-x-2">
//                 <button className="text-xs font-semibold">Add Participant</button>
//                 <button>
//                   <img src={AddUser} alt="" width={8} />
//                 </button>
//               </div>
//             </div>
//             <div className="mt-4">
//               {participants.map((participant) => (
//                 <div key={participant?.id} className="flex items-center gap-2 p-2 border-b">
//                   <img src={Avatar6} alt={participant?.name} className="w-10 h-10 rounded-full border-2 border-white" />
//                   <div className="flex-1 flex flex-row">
//                     <p className="font-medium">{participant?.name || "Guest"}</p>
//                     {participant?.isCoHost && (
//                       <span className="text-xs bg-gray-200 px-2 py-1 rounded">Co-Host</span>
//                     )}
//                     {participant?.hasAudio ? (
//                       <img src={micon} alt="mic on" width={15} />
//                     ) : (
//                       <img src={micoff} alt="mic off" width={15} />
//                     )}
//                     {participant?.hasVideo ? (
//                       <img src={von} alt="video on" width={15} />
//                     ) : (
//                       <img src={voff} alt="video off" width={15} />
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

// {/* Chat Section */}
//           <div className="mt-6">
//             <div className="flex flex-row items-center text-center space-x-4">
//               <h2 className="text-sm font-semibold">Chats ({chatMessages.length})</h2>
//               <div className="flex gap-2 mt-2">
//                 <button className="flex-1 bg-[#1E6132] text-white text-xs px-2 py-1 rounded-full">Group</button>
//                 <button className="flex-1 bg-[#E8F2EE] text-[#1E6132] text-xs px-2 py-1 rounded-full">Personal</button>
//                 <button>
//                   <img src={vector} alt="" width={10} />
//                 </button>
//               </div>
//             </div>
//             <p className="text-xs text-gray-500 mt-4">April 12, 2024</p>
//             <div className="flex flex-col">
//               {chatMessages.map((msg, index) => (
//                 <div key={index} className="mt-2 flex flex-row items-start">
//                   <img
//                     src={Avatar1}
//                     alt={msg.name}
//                     className="w-10 h-10 rounded-full border-2 border-white mr-2"
//                   />
//                   <div className="flex flex-col">
//                     <div className="flex flex-row items-center space-x-4">
//                       <p className="font-medium">{msg.name}</p>
//                       <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</p>
//                     </div>
//                     <p className="bg-gray-100 p-2 rounded-lg">{msg.message}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") sendChatMessage();
//                 }}
//                 placeholder="Send a message"
//                 className="w-full border rounded-lg px-3 py-2 text-sm"
//               />
//               <button
//                 onClick={sendChatMessage}
//                 className="mt-2 w-full bg-[#1E6132] text-white py-2 rounded-lg"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default VWeb;



// import React, { useState, useEffect } from "react";
// import Header from "./Header";
// import SemiHead from "./SemiHead";
// import micon from "../Images/Icon/Mic-On.png";
// import voff from "../Images/Icon/video-off.png";
// import von from "../Images/Icon/Video On.png";
// import micoff from "../Images/Icon/mic off.png";
// import vector from "../Images/Icon/Vector.png";
// import Avatar1 from "../Images/ava 1.png";
// import Avatar2 from "../Images/ava 2.png";
// import Avatar3 from "../Images/ava 3.png";
// import Avatar4 from "../Images/ava 4.png";
// import Avatar6 from "../Images/Icon/avatar 6.png";
// import maximize from "../Images/maximize-2.png";
// import sound from "../Images/sound.png";
// import Participant1 from "../Images/participant 1.png";
// import AddUser from "../Images/user-add.png";
// import Comp2 from "../Images/Icon/Component 2.png";
// import Vect2 from "../Images/Icon/Vector (2).png";
// import Icon2 from "../Images/Icon/Icons (2).png";
// import speaker from "../Images/Speaker.png";
// import slider from "../Images/Icon/Button.png";
// import Protector from "../Images/Protect.png";
// import Icon from "../Images/Iconic 2.png";
// import Gridone from "../Images/Frame 1707480527.png";
// import Gridtwo from "../Images/Icons 3.png";
// import MIC from "../Images/Icon/microphone-slash.png";
// import axios from "axios";

// const VWeb = () => {
//   const [user, setUser] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [error, setError] = useState(null);
//   const [participants, setParticipants] = useState([]);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [message, setMessage] = useState("");

//   const generateRandomId = (length) => {
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

//       const url = "https://dev.konn3ct.ng/api/app/kv4/join-room";
//       const headers = { "Content-Type": "application/json" };

//       const res = await axios.post(url, payload, { headers });
//       const sessionToken = res.data.data;

//       const response = await axios.get(
//         `https://meet.konn3ct.ng/bigbluebutton/api/enter?sessionToken=${sessionToken}`
//       );

//       if (response.data?.response?.returncode === "FAILED") {
//         setError(response.data?.response?.message || "Failed to retrieve user session");
//         return;
//       }

//       console.log("Connect User:", response.data);
//       setUser(response.data.response);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     if (!user || !user.meetingID) return;

//     const ws = new WebSocket(
//       "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
//     );

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//       setSocket(ws);

//       const sendWSMessage = (subMsg) => {
//         ws.send(`[${subMsg}]`);
//         setResponses((prev) => [...prev, `Sent: ${subMsg}`]);
//       };

//       const messages = [
//         `{"msg":"connect","version":"1","support":["1","pre2","pre1"]}`,
//         `{"msg":"method","id":"1","method":"userChangedLocalSettings","params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,"userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,"userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,"guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,"pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},"audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},"dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}}]}`,
//         `{"msg":"method","id":"2","method":"validateAuthToken","params":["${user.meetingID}","${user.internalUserID}","${user.authToken}","${user.externUserID}"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"auth-token-validation","params":[{"meetingId":"${user.meetingID}","userId":"${user.internalUserID}"}]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"current-user","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"polls","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"slides","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"slide-positions","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"captions","param
// System: s":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"voiceUsers","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"whiteboard-multi-user","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"screenshare","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat-msg","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation-pods","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-settings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-infos","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"note","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meeting-time-remaining","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"local-settings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-typing","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"record-meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"video-streams","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"connection-status","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"voice-call-status","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"external-video-meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"breakouts","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"guestUsers","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"annotations","params":[]}`,
//       ];

//       messages.forEach(sendWSMessage);
//     };

//     ws.onmessage = (event) => {
//       console.log("Raw WebSocket message:", event.data);
//       let data = event.data;

//       if (data.startsWith("a[")) {
//         try {
//           const outer = JSON.parse(data.slice(1, -1));
//           data = JSON.parse(outer);
//         } catch (e) {
//           console.error("Failed to parse message", e);
//           return;
//         }
//       } else {
//         try {
//           data = JSON.parse(data);
//         } catch (e) {
//           console.error("Failed to parse message", e);
//           return;
//         }
//       }

//       console.log("Parsed WebSocket message:", data);
//       setResponses((prev) => [...prev, `Received: ${JSON.stringify(data)}`]);

//       if (data.msg === "error") {
//         setError(`WebSocket error: ${data.reason}`);
//       }

//       if (data.msg === "added" && data.collection === "users") {
//         console.log("New user joined:", data.fields);
//         setParticipants((prev) => [
//           ...prev,
//           { id: data.id, name: data.fields.name, isCoHost: data.fields.role === "MODERATOR" },
//         ]);
//       }

//       if (data.msg === "removed" && data.collection === "users") {
//         console.log("User left:", data.id);
//         setParticipants((prev) => prev.filter((p) => p.id !== data.id));
//       }

//       if (data.msg === "added" && data.collection === "group-chat-msg") {
//         console.log("New chat message:", data.fields);
//         setChatMessages((prev) => [
//           ...prev,
//           {
//             name: data.fields.sender.name || "Guest",
//             message: data.fields.message,
//             timestamp: new Date(data.fields.timestamp),
//           },
//         ]);
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("WebSocket error:", err);
//       setError("WebSocket error occurred");
//     };

//     ws.onclose = () => {
//       console.log("WebSocket disconnected");
//       setSocket(null);
//     };

//     return () => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//     };
//   }, [user]);

//   const sendChatMessage = () => {
//     if (!user || !message.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
//       console.error("Cannot send message: Invalid user, empty message, or WebSocket not connected");
//       return;
//     }

//     const chatId = "MAIN-PUBLIC-GROUP-CHAT";
//     const correlationId = `${user.internalUserID}-${Date.now()}`;
//     const sender = {
//       id: user.internalUserID,
//       name: user.name || "Guest",
//       role: "",
//     };

//     const chatMessage = {
//       msg: "method",
//       id: generateRandomId(10),
//       method: "sendGroupChatMsg",
//       params: [
//         chatId,
//         {
//           correlationId,
//           sender,
//           chatEmphasizedText: true,
//           message: message.trim(),
//         },
//       ],
//     };

//     try {
//       socket.send(`[${JSON.stringify(chatMessage)}]`);
//       setResponses((prev) => [...prev, `Sent: ${JSON.stringify(chatMessage)}`]);
//       console.log("Chat message sent:", chatMessage);

//       setChatMessages((prev) => [
//         ...prev,
//         {
//           name: user.name || "Guest",
//           message: message.trim(),
//           timestamp: new Date(),
//         },
//       ]);
//       setMessage("");
//     } catch (err) {
//       console.error("Failed to send chat message:", err);
//       setError("Failed to send chat message");
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen w-full bg-gray-100 px-4 py-6 md:px-8 md:py-8">
//       <Header />
//       <SemiHead />

//       <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 shadow-md my-2">
//         <div className="flex space-x-3 items-center">
//           <img src={Protector} alt="Protector" className="w-6 h-6 md:w-4 md:h-4 border-2 border-white" />
//           <div className="flex items-center space-x-1">
//             <img src={Icon} alt="Icon" className="w-6 h-6 md:w-4 md:h-4 border-2 border-white" />
//             <img src={Gridone} alt="Grid 1" className="w-5 h-5 md:w-3 md:h-3 border-2 border-white" />
//             <img src={Gridtwo} alt="Grid 2" className="w-6 h-6 md:w-4 md:h-4 border-2 border-white" />
//           </div>
//         </div>
//         <div className="flex items-center space-x-3 mt-2 md:mt-0">
//           <div className="flex -space-x-2">
//             {participants.slice(0, 4).map((participant, index) => {
//               let avatarSrc;
//               switch (index) {
//                 case 0:
//                   avatarSrc = Avatar1;
//                   break;
//                 case 1:
//                   avatarSrc = Avatar2;
//                   break;
//                 case 2:
//                   avatarSrc = Avatar3;
//                   break;
//                 case 3:
//                   avatarSrc = Avatar4;
//                   break;
//                 default:
//                   avatarSrc = Avatar1;
//               }
//               return (
//                 <img
//                   key={participant?.id}
//                   src={avatarSrc}
//                   alt={participant?.name}
//                   className="w-8 h-8 rounded-full border-2 border-white"
//                 />
//               );
//             })}
//             {participants.length > 4 && (
//               <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E8F2EE] text-[#1E6132] font-semibold text-sm border-2 border-white">
//                 +{participants.length - 4}
//               </div>
//             )}
//           </div>
//           <button className="bg-[#E8F2EE] text-[#1E6132] px-3 py-1 rounded-lg text-sm">
//             Code: cem-jmnt-hsu
//           </button>
//           <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-4 py-2 shadow-sm bg-white">
//             <div className="relative w-6 h-6 flex items-center justify-center">
//               <div className="absolute w-full h-full border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
//               <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//             </div>
//             <span className="text-gray-700 text-sm font-medium">13:03:34</span>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
//         <div className="flex-1 flex flex-col p-4">
//           <div className="relative w-full aspect-video">
//             <img
//               className="w-full h-full rounded-xl object-cover"
//               src={speaker}
//               alt="Active Speaker"
//             />
//             <div className="absolute top-4 left-4 flex items-center space-x-2 border border-gray-400 rounded-lg px-4 py-2 shadow-sm bg-white">
//               <div className="w-6 h-6 flex items-center justify-center">
//                 <div className="absolute border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
//                 <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//               </div>
//               <span className="text-gray-700 text-sm font-medium">13:03:34</span>
//             </div>
//             <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-sm">
//               Adam Joseph
//             </div>
//             <button className="absolute top-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={maximize} alt="screen size" />
//             </button>
//             <button className="absolute bottom-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={sound} alt="sound" />
//             </button>
//           </div>
//           <div className="w-full mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
//             {participants.slice(0, 4).map((participant) => (
//               <div key={participant?.id} className="relative">
//                 <img
//                   className="w-full h-24 rounded-xl object-cover"
//                   src={Participant1}
//                   alt="Participant"
//                 />
//                 <span className="absolute bottom-2 left-4 text-xs bg-gray-800 text-white px-2 py-1 rounded-md">
//                   {participant?.name || "Participant"}
//                 </span>
//                 <button className="absolute bottom-2 right-4 text-white bg-[#EF4444] bg-opacity-70 p-2 rounded-full h-8 w-8">
//                   <img src={MIC} alt="sound" />
//                 </button>
//               </div>
//             ))}
//             {participants.length > 4 && (
//               <div className="bg-green-800 h-24 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
//                 +{participants.length - 4} More
//               </div>
//             )}
//             {participants.length < 4 &&
//               Array(4 - participants.length)
//                 .fill(null)
//                 .map((_, index) => (
//                   <div
//                     key={`empty-${index}`}
//                     className="bg-gray-300 h-24 rounded-xl flex items-center justify-center text-gray-600 font-semibold text-sm"
//                   >
//                     Empty
//                   </div>
//                 ))}
//           </div>
//           <div className="w-full mt-6 flex flex-col md:flex-row justify-between gap-4">
//             <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//               <img src={slider} alt="slider" className="w-12 h-4" />
//             </div>
//             <div className="flex space-x-1">
//               <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="slider" className="min-w-min h-4" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Vect2} alt="slider" className="w-4 h-4" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Icon2} alt="slider" className="w-4 h-4" />
//               </div>
//               <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="slider" className="w-4 h-4" />
//               </div>
//               <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="slider" className="w-4 h-4" />
//               </div>
//             </div>
//             <button className="bg-[#EF4444] text-white py-2 px-4 rounded-lg text-sm">
//               Leave Meeting
//             </button>
//           </div>
//         </div>
//         <div className="w-full md:w-80 bg-white p-4 shadow-lg h-auto md:h-full overflow-y-auto">
//           <div>
//             <div className="flex flex-row space-x-1 items-center">
//               <h2 className="text-sm font-semibold">Participants ({participants.length})</h2>
//               <div className="bg-green-100 text-green-700 px-4 py-1 mt-2 rounded-full space-x-2">
//                 <button className="text-xs font-semibold">Add Participant</button>
//                 <button>
//                   <img src={AddUser} alt="" width={8} />
//                 </button>
//               </div>
//             </div>
//             <div className="mt-4">
//               {participants.map((participant) => (
//                 <div key={participant?.id} className="flex items-center gap-2 p-2 border-b">
//                   <img
//                     src={Avatar6}
//                     alt={participant?.name}
//                     className="w-10 h-10 rounded-full border-2 border-white"
//                   />
//                   <div className="flex-1 flex flex-row items-center gap-2">
//                     <p className="font-medium text-sm">{participant?.name || "Guest"}</p>
//                     {participant?.isCoHost && (
//                       <span className="text-xs bg-gray-200 px-2 py-1 rounded">Co-Host</span>
//                     )}
//                     {participant?.hasAudio ? (
//                       <img src={micon} alt="mic on" width={15} />
//                     ) : (
//                       <img src={micoff} alt="mic off" width={15} />
//                     )}
//                     {participant?.hasVideo ? (
//                       <img src={von} alt="video on" width={15} />
//                     ) : (
//                       <img src={voff} alt="video off" width={15} />
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="mt-6">
//             <div className="flex flex-row items-center text-center space-x-4">
//               <h2 className="text-sm font-semibold">Chats ({chatMessages.length})</h2>
//               <div className="flex gap-2 mt-2">
//                 <button className="flex-1 bg-[#1E6132] text-white text-xs px-2 py-1 rounded-full">
//                   Group
//                 </button>
//                 <button className="flex-1 bg-[#E8F2EE] text-[#1E6132] text-xs px-2 py-1 rounded-full">
//                   Personal
//                 </button>
//                 <button>
//                   <img src={vector} alt="" width={10} />
//                 </button>
//               </div>
//             </div>
//             <p className="text-xs text-gray-500 mt-4">April 12, 2024</p>
//             <div className="flex flex-col mt-2 max-h-[50vh] overflow-y-auto">
//               {chatMessages.map((msg, index) => (
//                 <div key={index} className="mt-2 flex flex-row items-start">
//                   <img
//                     src={Avatar1}
//                     alt={msg.name}
//                     className="w-10 h-10 rounded-full border-2 border-white mr-2"
//                   />
//                   <div className="flex flex-col">
//                     <div className="flex flex-row items-center space-x-4">
//                       <p className="font-medium text-sm">{msg.name}</p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(msg.timestamp).toLocaleTimeString()}
//                       </p>
//                     </div>
//                     <p className="bg-gray-100 p-2 rounded-lg text-sm">{msg.message}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") sendChatMessage();
//                 }}
//                 placeholder="Send a message"
//                 className="w-full border rounded-lg px-3 py-2 text-sm"
//               />
//               <button
//                 onClick={sendChatMessage}
//                 className="mt-2 w-full bg-[#1E6132] text-white py-2 rounded-lg text-sm"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VWeb;


// import React, { useState, useEffect, useRef } from "react";
// import Header from "./Header";
// import SemiHead from "./SemiHead";
// import micon from "../Images/Icon/Mic-On.png";
// import voff from "../Images/Icon/video-off.png";
// import von from "../Images/Icon/Video On.png";
// import micoff from "../Images/Icon/mic off.png";
// import vector from "../Images/Icon/Vector.png";
// import Avatar1 from "../Images/ava 1.png";
// import Avatar2 from "../Images/ava 2.png";
// import Avatar3 from "../Images/ava 3.png";
// import Avatar4 from "../Images/ava 4.png";
// import Avatar6 from "../Images/Icon/avatar 6.png";
// import maximize from "../Images/maximize-2.png";
// import sound from "../Images/sound.png";
// import Participant1 from "../Images/participant 1.png";
// import AddUser from "../Images/user-add.png";
// import Comp2 from "../Images/Icon/Component 2.png";
// import Vect2 from "../Images/Icon/Vector (2).png";
// import Icon2 from "../Images/Icon/Icons (2).png";
// import speaker from "../Images/Speaker.png";
// import slider from "../Images/Icon/Button.png";
// import Protector from "../Images/Protect.png";
// import Icon from "../Images/Iconic 2.png";
// import Gridone from "../Images/Frame 1707480527.png";
// import Gridtwo from "../Images/Icons 3.png";
// import MIC from "../Images/Icon/microphone-slash.png";
// import axios from "axios";

// const VWeb = () => {
//   const [user, setUser] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [error, setError] = useState(null);
//   const [participants, setParticipants] = useState([]);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const chatContainerRef = useRef(null);

//   const generateRandomId = (length) => {
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

//       const url = "https://dev.konn3ct.ng/api/app/kv4/join-room";
//       const headers = { "Content-Type": "application/json" };

//       const res = await axios.post(url, payload, { headers });
//       const sessionToken = res.data.data;

//       const response = await axios.get(
//         `https://meet.konn3ct.ng/bigbluebutton/api/enter?sessionToken=${sessionToken}`
//       );

//       if (response.data?.response?.returncode === "FAILED") {
//         setError(response.data?.response?.message || "Failed to retrieve user session");
//         return;
//       }

//       console.log("Connect User:", response.data);
//       setUser(response.data.response);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     if (!user || !user.meetingID) return;

//     const ws = new WebSocket(
//       "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
//     );

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//       setSocket(ws);

//       const sendWSMessage = (subMsg) => {
//         ws.send(`[${subMsg}]`);
//         setResponses((prev) => [...prev, `Sent: ${subMsg}`]);
//       };

//       const messages = [
//         `{"msg":"connect","version":"1","support":["1","pre2","pre1"]}`,
//         `{"msg":"method","id":"1","method":"userChangedLocalSettings","params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,"userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,"userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,"guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,"pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},"audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},"dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}}]}`,
//         `{"msg":"method","id":"2","method":"validateAuthToken","params":["${user.meetingID}","${user.internalUserID}","${user.authToken}","${user.externUserID}"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"auth-token-validation","params":[{"meetingId":"${user.meetingID}","userId":"${user.internalUserID}"}]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"current-user","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"polls","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"slides","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"slide-positions","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"captions","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"voiceUsers","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"whiteboard-multi-user","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"screenshare","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat-msg","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation-pods","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-settings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-infos","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"note","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meeting-time-remaining","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"local-settings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-typing","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"record-meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"video-streams","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"connection-status","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"voice-call-status","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"external-video-meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"breakouts","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"guestUsers","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"annotations","params":[]}`,
//       ];

//       messages.forEach(sendWSMessage);
//     };

//     ws.onmessage = (event) => {
//       console.log("Raw WebSocket message:", event.data);
//       let data = event.data;

//       if (data.startsWith("a[")) {
//         try {
//           const outer = JSON.parse(data.slice(1, -1));
//           data = JSON.parse(outer);
//         } catch (e) {
//           console.error("Failed to parse message (array wrapper)", e);
//           return;
//         }
//       } else {
//         try {
//           data = JSON.parse(data);
//         } catch (e) {
//           console.error("Failed to parse message (plain JSON)", e);
//           return;
//         }
//       }

//       console.log("Parsed WebSocket message:", data);
//       setResponses((prev) => [...prev, `Received: ${JSON.stringify(data)}`]);

//       if (data.msg === "error") {
//         setError(`WebSocket error: ${data.reason}`);
//       }

//       if (data.msg === "added" && data.collection === "users") {
//         console.log("New user joined:", data.fields);
//         setParticipants((prev) => [
//           ...prev,
//           { id: data.id, name: data.fields.name, isCoHost: data.fields.role === "MODERATOR" },
//         ]);
//       }

//       if (data.msg === "removed" && data.collection === "users") {
//         console.log("User left:", data.id);
//         setParticipants((prev) => prev.filter((p) => p.id !== data.id));
//       }

//       if (data.msg === "added" && data.collection === "group-chat-msg") {
//         console.log("New chat message received:", data.fields);
//         setChatMessages((prev) => [
//           ...prev,
//           {
//             name: data.fields.sender.name || "Guest",
//             message: data.fields.message,
//             timestamp: new Date(data.fields.timestamp || Date.now()),
//           },
//         ]);
//         if (chatContainerRef.current) {
//           chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("WebSocket error:", err);
//       setError("WebSocket error occurred");
//     };

//     ws.onclose = () => {
//       console.log("WebSocket disconnected");
//       setSocket(null);
//     };

//     return () => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//     };
//   }, [user]);

//   const sendChatMessage = () => {
//     if (!user || !message.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
//       console.error("Cannot send message:", {
//         user: !!user,
//         message: message.trim(),
//         socket: !!socket,
//         readyState: socket?.readyState,
//       });
//       setError("Cannot send message: Check WebSocket connection or input");
//       return;
//     }

//     const chatId = "MAIN-PUBLIC-GROUP-CHAT";
//     const correlationId = `${user.internalUserID}-${Date.now()}`;
//     const sender = {
//       id: user.internalUserID,
//       name: user.name || "Guest",
//       role: "",
//     };

//     const chatMessage = {
//       msg: "method",
//       id: generateRandomId(10),
//       method: "sendGroupChatMsg",
//       params: [
//         chatId,
//         {
//           correlationId,
//           sender,
//           chatEmphasizedText: true,
//           message: message.trim(),
//         },
//       ],
//     };

//     try {
//       console.log("Attempting to send message:", chatMessage);
//       socket.send(`[${JSON.stringify(chatMessage)}]`);
//       setResponses((prev) => [...prev, `Sent: ${JSON.stringify(chatMessage)}`]);
//       console.log("Chat message sent successfully");

//       // Optimistically update UI
//       setChatMessages((prev) => [
//         ...prev,
//         {
//           name: user.name || "Guest",
//           message: message.trim(),
//           timestamp: new Date(),
//         },
//       ]);
//       setMessage("");
//       if (chatContainerRef.current) {
//         chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//       }
//     } catch (err) {
//       console.error("Failed to send chat message:", err);
//       setError(`Failed to send chat message: ${err.message}`);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen w-full bg-gray-100 px-4 py-6 md:px-8 md:py-8">
//       <Header />
//       <SemiHead />

//       <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 shadow-md my-2">
//         <div className="flex space-x-3 items-center">
//           <img src={Protector} alt="Protector" className="w-6 h-6 md:w-4 md:h-4 border-2 border-white" />
//           <div className="flex items-center space-x-1">
//             <img src={Icon} alt="Icon" className="w-6 h-6 md:w-4 md:h-4 border-2 border-white" />
//             <img src={Gridone} alt="Grid 1" className="w-5 h-5 md:w-3 md:h-3 border-2 border-white" />
//             <img src={Gridtwo} alt="Grid 2" className="w-6 h-6 md:w-4 md:h-4 border-2 border-white" />
//           </div>
//         </div>
//         <div className="flex items-center space-x-3 mt-2 md:mt-0">
//           <div className="flex -space-x-2">
//             {participants.slice(0, 4).map((participant, index) => {
//               let avatarSrc;
//               switch (index) {
//                 case 0:
//                   avatarSrc = Avatar1;
//                   break;
//                 case 1:
//                   avatarSrc = Avatar2;
//                   break;
//                 case 2:
//                   avatarSrc = Avatar3;
//                   break;
//                 case 3:
//                   avatarSrc = Avatar4;
//                   break;
//                 default:
//                   avatarSrc = Avatar1;
//               }
//               return (
//                 <img
//                   key={participant?.id}
//                   src={avatarSrc}
//                   alt={participant?.name}
//                   className="w-8 h-8 rounded-full border-2 border-white"
//                 />
//               );
//             })}
//             {participants.length > 4 && (
//               <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E8F2EE] text-[#1E6132] font-semibold text-sm border-2 border-white">
//                 +{participants.length - 4}
//               </div>
//             )}
//           </div>
//           <button className="bg-[#E8F2EE] text-[#1E6132] px-3 py-1 rounded-lg text-sm">
//             Code: cem-jmnt-hsu
//           </button>
//           <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-4 py-2 shadow-sm bg-white">
//             <div className="relative w-6 h-6 flex items-center justify-center">
//               <div className="absolute w-full h-full border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
//               <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//             </div>
//             <span className="text-gray-700 text-sm font-medium">13:03:34</span>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden h-full">
//         <div className="flex-1 flex flex-col p-4">
//           <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 aspect ratio */}
//             <img
//               className="absolute top-0 left-0 w-full h-full rounded-xl object-cover"
//               src={speaker}
//               alt="Active Speaker"
//             />
//             <div className="absolute top-4 left-4 flex items-center space-x-2 border border-gray-400 rounded-lg px-4 py-2 shadow-sm bg-white">
//               <div className="w-6 h-6 flex items-center justify-center">
//                 <div className="absolute border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
//                 <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//               </div>
//               <span className="text-gray-700 text-sm font-medium">13:03:34</span>
//             </div>
//             <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-sm">
//               Adam Joseph
//             </div>
//             <button className="absolute top-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={maximize} alt="screen size" />
//             </button>
//             <button className="absolute bottom-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={sound} alt="sound" />
//             </button>
//           </div>

//           <div className="w-full mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
//             {participants.slice(0, 4).map((participant) => (
//               <div key={participant?.id} className="relative">
//                 <img
//                   className="w-full h-24 rounded-xl object-cover"
//                   src={Participant1}
//                   alt="Participant"
//                 />
//                 <span className="absolute bottom-2 left-4 text-xs bg-gray-800 text-white px-2 py-1 rounded-md">
//                   {participant?.name || "Participant"}
//                 </span>
//                 <button className="absolute bottom-2 right-4 text-white bg-[#EF4444] bg-opacity-70 p-2 rounded-full h-8 w-8">
//                   <img src={MIC} alt="sound" />
//                 </button>
//               </div>
//             ))}
//             {participants.length > 4 && (
//               <div className="bg-green-800 h-24 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
//                 +{participants.length - 4} More
//               </div>
//             )}
//             {participants.length < 4 &&
//               Array(4 - participants.length)
//                 .fill(null)
//                 .map((_, index) => (
//                   <div
//                     key={`empty-${index}`}
//                     className="bg-gray-300 h-24 rounded-xl flex items-center justify-center text-gray-600 font-semibold text-sm"
//                   >
//                     Empty
//                   </div>
//                 ))}
//           </div>
//           <div className="w-full mt-6 flex flex-col md:flex-row justify-between gap-4">
//             <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//               <img src={slider} alt="slider" className="w-12 h-4" />
//             </div>
//             <div className="flex space-x-1">
//               <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="slider" className="min-w-min h-4" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Vect2} alt="slider" className="w-4 h-4" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Icon2} alt="slider" className="w-4 h-4" />
//               </div>
//               <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="slider" className="w-4 h-4" />
//               </div>
//               <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="slider" className="w-4 h-4" />
//               </div>
//             </div>
//             <button className="bg-[#EF4444] text-white py-2 px-4 rounded-lg text-sm">
//               Leave Meeting
//             </button>
//           </div>
//         </div>
//         <div className="w-full md:w-80 bg-white p-4 shadow-lg h-auto md:h-full overflow-y-auto">
//           <div>
//             <div className="flex flex-row space-x-1 items-center">
//               <h2 className="text-sm font-semibold">Participants ({participants.length})</h2>
//               <div className="bg-green-100 text-green-700 px-4 py-1 mt-2 rounded-full space-x-2">
//                 <button className="text-xs font-semibold">Add Participant</button>
//                 <button>
//                   <img src={AddUser} alt="" width={8} />
//                 </button>
//               </div>
//             </div>
//             <div className="mt-4">
//               {participants.map((participant) => (
//                 <div key={participant?.id} className="flex items-center gap-2 p-2 border-b">
//                   <img
//                     src={Avatar6}
//                     alt={participant?.name}
//                     className="w-10 h-10 rounded-full border-2 border-white"
//                   />
//                   <div className="flex-1 flex flex-row items-center gap-2">
//                     <p className="font-medium text-sm">{participant?.name || "Guest"}</p>
//                     {participant?.isCoHost && (
//                       <span className="text-xs bg-gray-200 px-2 py-1 rounded">Co-Host</span>
//                     )}
//                     {participant?.hasAudio ? (
//                       <img src={micon} alt="mic on" width={15} />
//                     ) : (
//                       <img src={micoff} alt="mic off" width={15} />
//                     )}
//                     {participant?.hasVideo ? (
//                       <img src={von} alt="video on" width={15} />
//                     ) : (
//                       <img src={voff} alt="video off" width={15} />
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="mt-6" ref={chatContainerRef}>
//             <div className="flex flex-row items-center text-center space-x-4">
//               <h2 className="text-sm font-semibold">Chats ({chatMessages.length})</h2>
//               <div className="flex gap-2 mt-2">
//                 <button className="flex-1 bg-[#1E6132] text-white text-xs px-2 py-1 rounded-full">
//                   Group
//                 </button>
//                 <button className="flex-1 bg-[#E8F2EE] text-[#1E6132] text-xs px-2 py-1 rounded-full">
//                   Personal
//                 </button>
//                 <button>
//                   <img src={vector} alt="" width={10} />
//                 </button>
//               </div>
//             </div>
//             <p className="text-xs text-gray-500 mt-4">April 12, 2024</p>
//             <div className="flex flex-col mt-2 max-h-[50vh] overflow-y-auto">
//               {chatMessages.map((msg, index) => (
//                 <div key={index} className="mt-2 flex flex-row items-start">
//                   <img
//                     src={Avatar1}
//                     alt={msg.name}
//                     className="w-10 h-10 rounded-full border-2 border-white mr-2"
//                   />
//                   <div className="flex flex-col">
//                     <div className="flex flex-row items-center space-x-4">
//                       <p className="font-medium text-sm">{msg.name}</p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(msg.timestamp).toLocaleTimeString()}
//                       </p>
//                     </div>
//                     <p className="bg-gray-100 p-2 rounded-lg text-sm">{msg.message}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") sendChatMessage();
//                 }}
//                 placeholder="Send a message"
//                 className="w-full border rounded-lg px-3 py-2 text-sm"
//               />
//               <button
//                 onClick={sendChatMessage}
//                 className="mt-2 w-full bg-[#1E6132] text-white py-2 rounded-lg text-sm"
//               >
//                 Send
//               </button>
//               {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VWeb;


// import React, { useState, useEffect, useRef } from "react";
// import Header from "./Header";
// import SemiHead from "./SemiHead";
// import micon from "../Images/Icon/Mic-On.png";
// import voff from "../Images/Icon/video-off.png";
// import von from "../Images/Icon/Video On.png";
// import micoff from "../Images/Icon/mic off.png";
// import vector from "../Images/Icon/Vector.png";
// import Avatar1 from "../Images/ava 1.png";
// import Avatar2 from "../Images/ava 2.png";
// import Avatar3 from "../Images/ava 3.png";
// import Avatar4 from "../Images/ava 4.png";
// import Avatar5 from "../Images/Icon/image.png";
// import Avatar6 from "../Images/Icon/avatar 6.png";
// import maximize from "../Images/maximize-2.png";
// import sound from "../Images/sound.png";
// import Participant1 from "../Images/participant 1.png";
// import Participant2 from "../Images/participant 2.png";
// import Participant3 from "../Images/participant 3.png";
// import AddUser from "../Images/user-add.png";
// import Comp2 from "../Images/Icon/Component 2.png";
// import Vect2 from "../Images/Icon/Vector (2).png";
// import Icon2 from "../Images/Icon/Icons (2).png";
// import speaker from "../Images/Speaker.png";
// import slider from "../Images/Icon/Button.png";
// import Protector from "../Images/Protect.png";
// import Icon from "../Images/Iconic 2.png";
// import Gridone from "../Images/Frame 1707480527.png";
// import Gridtwo from "../Images/Icons 3.png";
// import MIC from "../Images/Icon/microphone-slash.png";
// import mic from "../Images/Icon/Mic.png";
// import axios from "axios";

// const VWeb = () => {
//   const [user, setUser] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [error, setError] = useState(null);
//   const [participants, setParticipants] = useState([
//     { id: "1", name: "Cassie Jung", hasAudio: false, hasVideo: false },
//     { id: "2", name: "Alice Wong", hasAudio: true, hasVideo: false },
//     { id: "3", name: "Theresa Webb", hasAudio: true, hasVideo: false },
//     { id: "4", name: "Christian Wong", hasAudio: false, hasVideo: false },
//   ]);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const chatContainerRef = useRef(null);

//   const generateRandomId = (length) => {
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

//       const url = "https://dev.konn3ct.ng/api/app/kv4/join-room";
//       const headers = { "Content-Type": "application/json" };
//       const res = await axios.post(url, payload, { headers });
//       const sessionToken = res.data.data;
//       const response = await axios.get(
//         `https://meet.konn3ct.ng/bigbluebutton/api/enter?sessionToken=${sessionToken}`
//       );
//       if (response.data?.response?.returncode === "FAILED") {
//         setError(response.data?.response?.message || "Failed to retrieve user session");
//         return;
//       }
//       console.log("Connect User:", response.data);
//       setUser(response.data.response);
//     } catch (err) {
//       setError(err.message);
//     }//   };
//   useEffect(() => {
//     fetchUserData();
//   }, []);
//   useEffect(() => {
//     if (!user || !user.meetingID) return;
//     const ws = new WebSocket(
//       "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"//     );

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//       setSocket(ws);

//       const sendWSMessage = (subMsg) => {
//         ws.send(`[${subMsg}]`);
//         setResponses((prev) => [...prev, `Sent: ${subMsg}`]);
//       };
       
// const messages = [
//         `{"msg":"connect","version":"1","support":["1","pre2","pre1"]}`,
//         `{"msg":"method","id":"1","method":"userChangedLocalSettings","params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,"userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,"userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,"guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,"pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},"audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},"dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}}]}`,
//         `{"msg":"method","id":"2","method":"validateAuthToken","params":["${user.meetingID}","${user.internalUserID}","${user.authToken}","${user.externUserID}"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"auth-token-validation","params":[{"meetingId":"${user.meetingID}","userId":"${user.internalUserID}"}]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"current-user","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"polls","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"slides","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"slide-positions","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"captions","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"voiceUsers","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"whiteboard-multi-user","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"screenshare","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat-msg","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation-pods","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-settings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-infos","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"note","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meeting-time-remaining","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"local-settings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-typing","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"record-meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"video-streams","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"connection-status","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"voice-call-status","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"external-video-meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"breakouts","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"guestUsers","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"annotations","params":[]}`,
//       ];

//       messages.forEach(sendWSMessage);
//     };

//     ws.onmessage = (event) => {
//       console.log("Raw WebSocket message:", event.data);
//       let data = event.data;

//       if (data.startsWith("a[")) {
//         try {
//           const outer = JSON.parse(data.slice(1, -1));
//           data = JSON.parse(outer);
//         } catch (e) {
//           console.error("Failed to parse message (array wrapper)", e);
//           return;
//         }
//       } else {
//         try {
//           data = JSON.parse(data);
//         } catch (e) {
//           console.error("Failed to parse message (plain JSON)", e);
//           return;
//         }
//       }

//       console.log("Parsed WebSocket message:", data);
//       setResponses((prev) => [...prev, `Received: ${JSON.stringify(data)}`]);

//       if (data.msg === "error") {
//         setError(`WebSocket error: ${data.reason}`);
//       }

//       if (data.msg === "added" && data.collection === "users") {
//         console.log("New user joined:", data.fields);
//         setParticipants((prev) => [
//           ...prev,
//           {
//             id: data.id,
//             name: data.fields.name,
//             isCoHost: data.fields.role === "MODERATOR",
//             hasAudio: false,
//             hasVideo: false,
//           },
//         ]);
//       }

//       if (data.msg === "removed" && data.collection === "users") {
//         console.log("User left:", data.id);
//         setParticipants((prev) => prev.filter((p) => p.id !== data.id));
//       }

//       if (data.msg === "added" && data.collection === "group-chat-msg") {
//         console.log("New chat message received:", data.fields);
//         setChatMessages((prev) => [
//           ...prev,
//           {
//             name: data.fields.sender.name || "Guest",
//             message: data.fields.message,
//             timestamp: new Date(data.fields.timestamp || Date.now()),
//           },
//         ]);
//         if (chatContainerRef.current) {
//           chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("WebSocket error:", err);
//       setError("WebSocket error occurred");
//     };

//     ws.onclose = () => {
//       console.log("WebSocket disconnected");
//       setSocket(null);
//     };

//     return () => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//     };
//   }, [user]);

//   const toggleAudio = (id) => {
//     setParticipants((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, hasAudio: !p.hasAudio } : p))
//     );
//   };

//   const toggleVideo = (id) => {
//     setParticipants((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, hasVideo: !p.hasVideo } : p))
//     );
//   };

//   const sendChatMessage = () => {
//     if (!user || !message.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
//       console.error("Cannot send message:", {
//         user: !!user,
//         message: message.trim(),
//         socket: !!socket,
//         readyState: socket?.readyState,
//       });
//       setError("Cannot send message: Check WebSocket connection or input");
//       return;
//     }

//     const chatId = "MAIN-PUBLIC-GROUP-CHAT";
//     const correlationId = `${user.internalUserID}-${Date.now()}`;
//     const sender = {
//       id: user.internalUserID,
//       name: user.name || "Guest",
//       role: "",
//     };

//     const chatMessage = {
//       msg: "method",
//       id: generateRandomId(10),
//       method: "sendGroupChatMsg",
//       params: [
//         chatId,
//         {
//           correlationId,
//           sender,
//           chatEmphasizedText: true,
//           message: message.trim(),
//         },
//       ],
//     };

//     try {
//       console.log("Attempting to send message:", chatMessage);
//       socket.send(`[${JSON.stringify(chatMessage)}]`);
//       setResponses((prev) => [...prev, `Sent: ${JSON.stringify(chatMessage)}`]);
//       console.log("Chat message sent successfully");

//       setChatMessages((prev) => [
//         ...prev,
//         {
//           name: user.name || "Guest",
//           message: message.trim(),
//           timestamp: new Date(),
//         },
//       ]);
//       setMessage("");
//       if (chatContainerRef.current) {
//         chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//       }
//     } catch (err) {
//       console.error("Failed to send chat message:", err);
//       setError(`Failed to send chat message: ${err.message}`);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen w-full bg-gray-100 p-4 md:p-8">
//       <Header />
//       <SemiHead />

//       <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 shadow-md mt-1 mb-1">
//         <div className="flex space-x-3 items-center">
//           <img
//             src={Protector}
//             alt="P 1"
//             className="w-8 md:w-4 h-8 md:h-4 border-2 border-white mr-8 md:mr-4"
//           />
//           <div className="flex items-center">
//             <img
//               src={Icon}
//               alt="P 2"
//               className="w-8 md:w-4 h-8 md:h-4 border-2 border-white"
//             />
//             <img
//               src={Gridone}
//               alt="P 3"
//               className="w-6 md:w-3 h-6 md:h-3 border-2 border-white"
//             />
//             <img
//               src={Gridtwo}
//               alt="P 4"
//               className="w-8 md:w-8 h-8 md:h-4 border-2 border-white"
//             />
//           </div>
//         </div>

//         <div className="flex items-center space-x-3">
//           <div className="flex -space-x-2">
//             <img
//               src={Avatar1}
//               alt="Participant 1"
//               className="w-8 h-8 rounded-full border-2 border-white"
//             />
//             <img
//               src={Avatar2}
//               alt="Participant 2"
//               className="w-8 h-8 rounded-full border-2 border-white"
//             />
//             <img
//               src={Avatar3}
//               alt="Participant 3"
//               className="w-8 h-8 rounded-full border-2 border-white"
//             />
//             <img
//               src={Avatar4}
//               alt="Participant 4"
//               className="w-8 h-8 rounded-full border-2 border-white"
//             />
//             <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E8F2EE] text-[#1E6132] font-semibold text-sm border-2 border-white">
//               +9
//             </div>
//           </div>
//           <button className="bg-[#E8F2EE] text-[#1E6132] px-3 py-1 rounded-lg">
//             Code: cem-jmnt-hsu
//           </button>

//           <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-4 py-2 shadow-sm bg-white">
//             <div className="relative w-6 h-6 flex items-center justify-center">
//               <div className="absolute w-full h-full border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
//               <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//             </div>
//             <span className="text-gray-700 text-sm font-medium">13:03:34</span>
//           </div>
//         </div>
//       </div>

//       <div className="w-full h-screen bg-white flex">
//         <div className="flex-1 flex flex-col items-center justify-center p-4">
//           <div className="relative">
//             <img
//               className="w-screen h-[400px] rounded-xl object-cover"
//               src={speaker}
//               alt="Active Speaker"
//             />
//             <div className="absolute top-4 left-4 flex items-center space-x-2 border border-gray-400 rounded-lg px-4 py-2 shadow-sm bg-white">
//               <div className="w-6 h-6 flex items-center justify-center">
//                 <div className="absolute border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
//                 <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//               </div>
//               <span className="text-gray-700 text-sm font-medium">13:03:34</span>
//             </div>
//             <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md">
//               Adam Joseph
//             </div>
//             <button className="absolute top-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={maximize} alt="screen size" />
//             </button>
//             <button className="absolute bottom-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={sound} alt="sound" />
//             </button>
//           </div>

//           <div className="w-full max-w-4xl mt-4 grid grid-cols-4 gap-2">
//             {participants.map((participant) => (
//               <div key={participant.id} className="relative">
//                 <img
//                   className="w-full h-24 rounded-xl object-cover"
//                   src={
//                     participant.name === "Cassie Jung"
//                       ? Participant1
//                       : participant.name === "Alice Wong"
//                       ? Participant2
//                       : participant.name === "Theresa Webb"
//                       ? Participant3
//                       : Participant1
//                   }
//                   alt={participant.name}
//                 />
//                 <span className="absolute bottom-2 left-4 text-xs bg-gray-800 text-white px-2 py-1 rounded-md">
//                   {participant.name}
//                 </span>
//                 <button
//                   className={`absolute bottom-2 right-4 text-white p-2 rounded-full h-8 w-8 ${
//                     participant.hasAudio ? "bg-[#1E6132]" : "bg-[#EF4444]"
//                   } bg-opacity-70`}
//                   onClick={() => toggleAudio(participant.id)}
//                 >
//                   <img
//                     src={participant.hasAudio ? mic : MIC}
//                     alt={participant.hasAudio ? "mic on" : "mic off"}
//                     width={15}
//                   />
//                 </button>
//               </div>
//             ))}
//           </div>

//           <div className="w-full max-w-4xl mt-6 flex justify-between">
//             <div>
//               <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={slider} alt="slider" className="w-12 h-4" />
//               </div>
//             </div>

//             <div className="flex space-x-1">
//               <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="slider" className="min-w-min h-4" />
//               </div>

//               <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Vect2} alt="slider" className="w-4 h-4" />
//               </div>

//               <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Icon2} alt="slider" className="w-4 h-4" />
//               </div>

//               <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="slider" className="w-4 h-4" />
//               </div>

//               <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="slider" className="w-4 h-4" />
//               </div>
//             </div>

//             <button className="bg-[#EF4444] text-white py-2 px-4 rounded-lg">
//               Leave Meeting
//             </button>
//           </div>
//         </div>

//         <div className="w-80 bg-white p-4 shadow-lg h-full overflow-y-auto">
//           <div>
//             <div className="flex flex-row space-x-1 items-center">
//               <h2 className="text-sm font-semibold">Participants ({participants.length})</h2>
//               <div className="bg-green-100 text-green-700 px-4 py-1 mt-2 rounded-full space-x-2">
//                 <button className="text-xs font-semibold">Add Participant</button>
//                 <button>
//                   <img src={AddUser} alt="" width={8} />
//                 </button>
//               </div>
//             </div>
//             <div className="mt-4">
//               {[
//                 { id: "5", name: "Dianne Russell", isCoHost: true, hasAudio: true, hasVideo: false },
//                 { id: "6", name: "Guy Hawkins", isCoHost: false, hasAudio: false, hasVideo: false },
//                 { id: "7", name: "Kathryn Murphy", isCoHost: false, hasAudio: false, hasVideo: true },
//               ].map((participant) => (
//                 <div key={participant.id} className="flex items-center gap-2 p-2 border-b">
//                   <img
//                     src={
//                       participant.name === "Dianne Russell"
//                         ? Avatar6
//                         : participant.name === "Guy Hawkins"
//                         ? Avatar3
//                         : Avatar1
//                     }
//                     alt={participant.name}
//                     className="w-10 h-10 rounded-full border-2 border-white"
//                   />
//                   <div className="flex-1 flex flex-row items-center gap-2">
//                     <p className="font-medium">{participant.name}</p>
//                     {participant.isCoHost && (
//                       <span className="text-xs bg-gray-200 px-2 py-1 rounded">Co-Host</span>
//                     )}
//                     <img
//                       src={participant.hasAudio ? micon : micoff}
//                       alt={participant.hasAudio ? "mic on" : "mic off"}
//                       width={15}
//                     />
//                     <img
//                       src={participant.hasVideo ? von : voff}
//                       alt={participant.hasVideo ? "video on" : "video off"}
//                       width={15}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mt-6" ref={chatContainerRef}>
//             <div className="flex flex-row items-center text-center space-x-4">
//               <h2 className="text-sm font-semibold">Chats ({chatMessages.length})</h2>
//               <div className="flex gap-2 mt-2">
//                 <button className="flex-1 bg-[#1E6132] text-white text-xs px-2 py-1 rounded-full">
//                   Group
//                 </button>
//                 <button className="flex-1 bg-[#E8F2EE] text-[#1E6132] text-xs px-2 py-1 rounded-full">
//                   Personal
//                 </button>
//                 <button>
//                   <img src={vector} alt="" width={10} />
//                 </button>
//               </div>
//             </div>
//             <p className="text-xs text-gray-500 mt-4">April 12, 2024</p>
//             <div className="flex flex-col mt-2 max-h-[50vh] overflow-y-auto">
//               {chatMessages.map((msg, index) => (
//                 <div key={index} className="mt-2 flex flex-row items-start">
//                   <img
//                     src={msg.name === "Kathryn Murphy" ? Avatar1 : Avatar5}
//                     alt={msg.name}
//                     className="w-10 h-10 rounded-full border-2 border-white mr-2"
//                   />
//                   <div className="flex flex-col">
//                     <div className="flex flex-row items-center space-x-4">
//                       <p className="font-medium">{msg.name}</p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(msg.timestamp).toLocaleTimeString()}
//                       </p>
//                     </div>
//                     <p className="bg-gray-100 p-2 rounded-lg text-sm">{msg.message}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") sendChatMessage();
//                 }}
//                 placeholder="Send a message"
//                 className="w-full border rounded-lg px-3 py-2 text-sm"
//               />
//               <button
//                 onClick={sendChatMessage}
//                 className="mt-2 w-full bg-[#1E6132] text-white py-2 rounded-lg text-sm"
//               >
//                 Send
//               </button>
//               {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VWeb;






import React, { useState, useEffect, } from "react";
import Header from "./Header";
import SemiHead from "./SemiHead";
import micon from "../Images/Icon/Mic-On.png";
import voff from "../Images/Icon/video-off.png";
import von from "../Images/Icon/Video On.png";
import micoff from "../Images/Icon/mic off.png";
import vector from "../Images/Icon/Vector.png";
import Avatar1 from "../Images/ava 1.png";
import Avatar2 from "../Images/ava 2.png";
import Avatar3 from "../Images/ava 3.png";
import Avatar4 from "../Images/ava 4.png";
import Avatar5 from "../Images/Icon/image.png";
import Avatar6 from "../Images/Icon/avatar 6.png";
import maximize from "../Images/maximize-2.png";
import sound from "../Images/sound.png";
import Participant1 from "../Images/participant 1.png";
import Participant2 from "../Images/participant 2.png";
import Participant3 from "../Images/participant 3.png";
import AddUser from "../Images/user-add.png";
import Comp2 from "../Images/Icon/Component 2.png";
import Vect2 from "../Images/Icon/Vector (2).png";
import Icon2 from "../Images/Icon/Icons (2).png";
import speaker from "../Images/Speaker.png";
import slider from "../Images/Icon/Button.png";
import Protector from "../Images/Protect.png";
import Icon from "../Images/Iconic 2.png";
import Gridone from "../Images/Frame 1707480527.png";
import Gridtwo from "../Images/Icons 3.png";
import MIC from "../Images/Icon/microphone-slash.png";
import mic from "../Images/Icon/Mic.png";
import axios from "axios";

const VWebinar = () => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]); 
  const [chatMessages, setChatMessages] = useState([]); 
  const [message, setMessage] = useState("");
  

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
        room: "Ade1253uL",
        name: "Lukman",
        email: "d.aladebowale@gmail.com",
        access_code: "",
      };

      const url = "https://dev.konn3ct.ng/api/app/kv4/join-room";
      const headers = { "Content-Type": "application/json" };

      const res = await axios.post(url, payload, { headers });
      const sessionToken = res.data.data;

      const response = await axios.get(
        `https://meet.konn3ct.ng/bigbluebutton/api/enter?sessionToken=${sessionToken}`
      );

      if (response.data?.response?.returncode === "FAILED") {
        setError(
          response.data?.response?.message || "Failed to retrieve user session"
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

      function sendWSMessage(subMsg) {
        ws.send(`[${JSON.stringify(subMsg)}]`);
        setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subMsg)}`]);
      }

      console.log("meetingID:", user.meetingID);
      console.log("internalUserID:", user.internalUserID);
      console.log("authToken:", user.authToken);
      console.log("externUserID:", user.externUserID);

      const subMsg1 = `{"msg":"connect","version":"1","support":["1","pre2","pre1"]}`;
      sendWSMessage(subMsg1);
      const subMsg2 = `{"msg":"method","id":"1","method":"userChangedLocalSettings","params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,"userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,"userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,"guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,"pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},"audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},"dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}}]}`;
      sendWSMessage(subMsg2);
      const subMsg3 = `{"msg":"method","id":"2","method":"validateAuthToken","params":["${user?.meetingID}","${user?.internalUserID}","${user?.authToken}","${user?.externUserID}"]}`;
      sendWSMessage(subMsg3);
      const subMsg4 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"auth-token-validation","params":[{"meetingId":"${user?.meetingID}","userId":"${user?.internalUserID}"}]}`;
      sendWSMessage(subMsg4);
      const subMsg5 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"current-user","params":[]}`;
      sendWSMessage(subMsg5);
      const subMsg6 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":[]}`;
      sendWSMessage(subMsg6);
      const subMsg7 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":[]}`;
      sendWSMessage(subMsg7);
      const subMsg8 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"polls","params":[]}`;
      sendWSMessage(subMsg8);
      const subMsg9 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation","params":[]}`;
      sendWSMessage(subMsg9);
      const subMsg10 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"slides","params":[]}`;
      sendWSMessage(subMsg10);
      const subMsg11 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"slide-positions","params":[]}`;
      sendWSMessage(subMsg11);
      const subMsg12 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"captions","params":[]}`;
      sendWSMessage(subMsg12);
      const subMsg13 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"voiceUsers","params":[]}`;
      sendWSMessage(subMsg13);
      const subMsg14 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"whiteboard-multi-user","params":[]}`;
      sendWSMessage(subMsg14);
      const subMsg15 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"screenshare","params":[]}`;
      sendWSMessage(subMsg15);
      const subMsg16 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat","params":[]}`;
      sendWSMessage(subMsg16);
      const subMsg17 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat-msg","params":[]}`;
      sendWSMessage(subMsg17);
      const subMsg18 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"presentation-pods","params":[]}`;
      sendWSMessage(subMsg18);
      const subMsg19 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"users-settings","params":[]}`;
      sendWSMessage(subMsg19);
      const subMsg20 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"users-infos","params":[]}`;
      sendWSMessage(subMsg20);
      const subMsg21 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"note","params":[]}`;
      sendWSMessage(subMsg21);
      const subMsg22 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"meeting-time-remaining","params":[]}`;
      sendWSMessage(subMsg22);
      const subMsg23 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"local-settings","params":[]}`;
      sendWSMessage(subMsg23);
      const subMsg24 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"users-typing","params":[]}`;
      sendWSMessage(subMsg24);
      const subMsg25 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"record-meetings","params":[]}`;
      sendWSMessage(subMsg25);
      const subMsg26 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"video-streams","params":[]}`;
      sendWSMessage(subMsg26);
      const subMsg27 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"connection-status","params":[]}`;
      sendWSMessage(subMsg27);
      const subMsg28 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"voice-call-status","params":[]}`;
      sendWSMessage(subMsg28);
      const subMsg29 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"external-video-meetings","params":[]}`;
      sendWSMessage(subMsg29);
      const subMsg30 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":["MODERATOR"]}`;
      sendWSMessage(subMsg30);
      const subMsg31 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":["MODERATOR"]}`;
      sendWSMessage(subMsg31);
      const subMsg32 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"breakouts","params":["MODERATOR"]}`;
      sendWSMessage(subMsg32);
      const subMsg33 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"guestUsers","params":["MODERATOR"]}`;
      sendWSMessage(subMsg33);
      const subMsg34 = ` {"msg":"sub","id":"${generateRandomId(17)}","name":"annotations","params":[]}`;
      sendWSMessage(subMsg34);
    };

    // ws.onmessage = (event) => {
    //   console.log("Raw WebSocket message:", event.data);
    //   let data = event.data;
    //   if (data.startsWith("a[")) {
    //     try {
    //       const outer = JSON.parse(data.slice(1, -1));
    //       data = JSON.parse(outer);
    //     } catch (e) {
    //       console.error("Failed to parse message", e);
    //       return;
    //     }
    //   }
    //   console.log("Parsed WebSocket message:", data);
    //   setResponses((prev) => [...prev, `Received: ${JSON.stringify(data)}`]);

      // Handle WebSocket Messages to Update UI ---
      // if (data.msg === "error") {
      //   setError(`WebSocket error: ${data.reason}`);
      // }

      // handling user updates 
      // if (data?.msg === "method" && data?.method === "userJoined") {
      //   console.log("New user joined:", data.params);
      //   setParticipants((prev) => [...prev, data.params[0]]); 
      // }

      // if (data?.msg === "method" && data?.method === "userLeft") {
      //   console.log("User left:", data.params);
      //   setParticipants((prev) => prev.filter(p => p.id !== data.params[0])); 
      // }

      // handling chat messages

      // if (data?.msg === "method" && data?.method === "sendPublicMessage") {
      //   console.log("New chat message:", data.params);
      //   setChatMessages((prev) => [...prev, {
      //     name: data.params[1].name, 
      //     message: data.params[2], 
      //     timestamp: new Date()
      //   }]);
      // }

      
    // };
    // ws.onerror = (err) => {
    //   console.error("WebSocket error:", err);
    //   setError(`WebSocket error: ${err.message}`);
    // };
    // ws.onclose = () => {
    //   console.log("WebSocket disconnected");
    // };

  //   return () => {
  //     if (ws.readyState === WebSocket.OPEN) {
  //       ws.close();
  //     }
  //   };
  // }, [user]);
});
  function sendChatMessage () {
    if (!user || !message.trim()) return;
    
    // const subCMsg = `{msg: "method",id: generateRandomId(10),method: "sendGroupChatMsg",params: ["MAIN-PUBLIC-GROUP-CHAT",{correlationId: `${user.internalUserID}-${Date.now()}`,sender: {id: user.internalUserID,name: user.name || "Guest",role: "",},chatEmphasizedText: true,message: message.trim(),},],}`;
    const subCMsg = `{"msg": "method","id": "${generateRandomId(10)}","method": "sendGroupChatMsg","params": [{"MAIN-PUBLIC-GROUP-CHAT",{"correlationId": "${user?.internalUserID}-${Date.now()}","sender": {"id": "${user?.internalUserID}","name": "", "role": "",},"chatEmphasizedText": true,"message": "${message.trim()}"},},],}`;
    sendChatMessage(subCMsg);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(`[${JSON.stringify(subCMsg)}]`);
      setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subCMsg)}`]);
      console.log("WebSocket message sent:", subCMsg);
    } else {
      console.error("WebSocket not connected.");
    }
    setMessage("");
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100 p-4 md:p-8 ">
      <Header />
      <SemiHead />

      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 shadow-md mt-1 mb-1">
        <div className="flex space-x-3 items-center">
          <img src={Protector} alt="P 1" className="w-8 md:w-4 h-8 md:-4 border-2 border-white mr-8 md:mr-4" />
          <div className="flex items-center">
            <img src={Icon} alt="P 2" className="w-8 md:w-4 h-8 md:h-4 border-2 border-white" />
            <img src={Gridone} alt="P 3" className="w-6 md:w-3 h-6 md:h-3 border-2 border-white" />
            <img src={Gridtwo} alt="P 4" className="w-8 md:w-8 h-8 md:h-4 border-2 border-white" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {participants.slice(0, 4).map((participant, index) => {
              let avatarSrc;
              switch (index) {
                case 0:
                  avatarSrc = Avatar1;
                  break;
                case 1:
                  avatarSrc = Avatar2;
                  break;
                case 2:
                  avatarSrc = Avatar3;
                  break;
                case 3:
                  avatarSrc = Avatar4;
                  break;
                // case 4:
                  // avatarSrc= Avatar5;
                  // break;
                default:
                  avatarSrc = Avatar1; // Fallback
              }
              return (
                <img
                  key={participant?.id}
                  src={avatarSrc}
                  alt={participant?.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              );
            })}
            {participants.length > 4 && (
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E8F2EE] text-[#1E6132]
                  font-semibold text-sm border-2 border-white">+{(participants.length - 4)}</div>
            )}
          </div>
          <button className="bg-[#E8F2EE] text-[#1E6132] px-3 py-1 rounded-lg">Code: cem-jmnt-hsu</button>
          <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-4 py-2 shadow-sm bg-white">
            {/* Recording Icon */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              {/* Outer Circle */}
              <div className="absolute w-full h-full border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
              {/* Inner Circle */}
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
            {/* Timer */}
            <span className="text-gray-700 text-sm font-medium">13:03:34</span>
          </div>
        </div>
      </div>
      {/* <Header /> */}
      {/* Main Content */}
      <div className="w-full h-screen bg-white flex">
        {/* Main Speaker View */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="relative">
            <img className="w-screen h-[400px] rounded-xl object-cover" src={speaker} alt="Active Speaker" />
            <div className=" absolute top-4 left-4 flex items-center space-x-2 border border-gray-400 rounded-lg px-4 py-2 shadow-sm bg-white">
              {/* Recording Icon */}
              <div className=" w-6 h-6 flex items-center justify-center">
                {/* Outer Circle (Pulsating Effect) */}
                <div className="absolute  border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
                {/* Inner Circle */}
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              </div>
              {/* Timer */}
              <span className="text-gray-700 text-sm font-medium">13:03:34</span>
            </div>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md">Adam Joseph</div>
            <button className="absolute top-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={maximize} alt="screen size" />
            </button>
            <button className="absolute bottom-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={sound} alt="sound" />
            </button>
          </div>
          {/* Participants */}
          <div className="w-full max-w-4xl mt-4 grid grid-cols-4 gap-2">
            {participants.slice(0, 4).map((participant) => (
              <div key={participant?.id} className="relative">
                <img className="w-full h-24 rounded-xl object-cover " src={Participant1} alt="Participant" />
                <span className="absolute bottom-2 left-4 text-xs bg-gray-800 text-white px-2 py-1 rounded-md">
                  {participant?.name || 'Participant'}
                </span>
                <button className="absolute bottom-2 right-4 text-white bg-[#EF4444] bg-opacity-70 p-2 rounded-full h-8 w-8">
                  <img src={MIC} alt="sound" />
                </button>
              </div>
            ))}
            {participants.length > 4 && (
              <div className="bg-green-800 h-24 rounded-xl flex items-center justify-center text-white font-semibold">
                +{participants.length - 4} More
              </div>
            )}
            {/* Static participant slots */}
            {participants.length < 4 && Array(4 - participants.length).fill(null).map((_, index) => (
              <div key={`empty-${index}`} className="bg-gray-300 h-24 rounded-xl flex items-center justify-center text-gray-600 font-semibold">
                Empty
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="w-full max-w-4xl mt-6 flex justify-between">

            <div>
              <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={slider} alt="slider" className="w-12 h-4" />
              </div>
            </div>

            <div className="flex space-x-1">
              <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Comp2} alt="slider" className="min-w-min h-4" />
              </div>

              <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Vect2} alt="slider" className="w-4 h-4" />
              </div>

              <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Icon2} alt="slider" className="w-4 h-4" />
              </div>

              <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Comp2} alt="slider" className="w-4 h-4" />
              </div>

              <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Comp2} alt="slider" className="w-4 h-4" />
              </div>
            </div>


            <button className="bg-[#EF4444] text-white py-2 px-4 rounded-lg">Leave Meeting</button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white p-4 shadow-lg h-full overflow-y-auto">
          {/* Participants Section */}
          <div>
            <div className="flex flex-row space-x-1 items-center">
              <h2 className="text-sm font-semibold">Participants ({participants.length})</h2>
              <div className="bg-green-100 text-green-700 px-4 py-1 mt-2 rounded-full space-x-2">
                <button className=" text-xs font-semibold">Add Participant</button>
                <button><img src={AddUser} alt="" width={8} /></button>
              </div>
            </div>
            <div className="mt-4">
              {participants.map((participant) => (
                <div key={participant?.id} className="flex items-center gap-2 p-2 border-b">
                  <img src={Avatar6} alt={participant?.name} className="w-10 h-10 rounded-full border-2 border-white" />
                  <div className="flex-1 flex flex-row">
                    <p className="font-medium">{participant?.name || 'Guest'}</p>
                    {participant?.isCoHost && <span className="text-xs bg-gray-200 px-2 py-1 rounded">Co-Host</span>}
                    {participant?.hasAudio ? <img src={micon} alt="mic on" width={15} /> : <img src={micoff} alt="mic off" width={15} />}
                    {participant?.hasVideo ? <img src={von} alt="video on" width={15} /> : <img src={voff} alt="video off" width={15} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Section */}
          <div className="mt-6 ">
            <div className="flex flex-row items-center text-center space-x-4">
              <h2 className="text-sm font-semibold">Chats ({chatMessages.length})</h2>
              <div className="flex gap-2 mt-2">
                <button className="flex-1 bg-[#1E6132] text-white text-xs px-2 py-1 rounded-full">Group</button>
                <button className="flex-1 bg-[#E8F2EE] text-[#1E6132] text-xs px-2 py-1 rounded-full">Personal</button>
                <button><img src={vector} alt="" width={10} /></button>
              </div>
            </div>


            <p className="text-xs text-gray-500 mt-4">April 12, 2024</p>

            <div className="flex flex-col">
              {chatMessages.map((msg, index) => (
                <div key={index} className="mt-2 flex flex-row items-start">
                  <img src={Avatar1} alt={msg.name} className="w-10 h-10 rounded-full border-2 border-white mr-2" />
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center space-x-4">
                      <p className="font-medium">{msg.name}</p>
                      <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <p className="bg-gray-100 p-2 rounded-lg">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "20px" }}>
      <h2>Chat</h2>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendChatMessage();
        }}
        placeholder="Send a message"
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />

      <button onClick={sendChatMessage}>Send</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VWebinar;


// import React, { useState, useEffect, useRef } from "react";
// import Header from "./Header";
// import SemiHead from "./SemiHead";
// import micon from "../Images/Icon/Mic-On.png";
// import voff from "../Images/Icon/video-off.png";
// import von from "../Images/Icon/Video On.png";
// import micoff from "../Images/Icon/mic off.png";
// import vector from "../Images/Icon/Vector.png";
// import Avatar1 from "../Images/ava 1.png";
// import Avatar2 from "../Images/ava 2.png";
// import Avatar3 from "../Images/ava 3.png";
// import Avatar4 from "../Images/ava 4.png";
// import Avatar5 from "../Images/Icon/image.png";
// import Avatar6 from "../Images/Icon/avatar 6.png";
// import maximize from "../Images/maximize-2.png";
// import sound from "../Images/sound.png";
// import Participant1 from "../Images/participant 1.png";
// import Participant2 from "../Images/participant 2.png";
// import Participant3 from "../Images/participant 3.png";
// import AddUser from "../Images/user-add.png";
// import Comp2 from "../Images/Icon/Component 2.png";
// import Vect2 from "../Images/Icon/Vector (2).png";
// import Icon2 from "../Images/Icon/Icons (2).png";
// import speaker from "../Images/Speaker.png";
// import slider from "../Images/Icon/Button.png";
// import Protector from "../Images/Protect.png";
// import Icon from "../Images/Iconic 2.png";
// import Gridone from "../Images/Frame 1707480527.png";
// import Gridtwo from "../Images/Icons 3.png";
// import MIC from "../Images/Icon/microphone-slash.png";
// import mic from "../Images/Icon/Mic.png";
// import hand from "../Images/Icon/hand.png";
// import axios from "axios";

// const VWeb = () => {
//   const [user, setUser] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [error, setError] = useState(null);
//   const [participants, setParticipants] = useState([
//     { id: "1", name: "Cassie Jung", hasAudio: false, hasVideo: false },
//     { id: "2", name: "Alice Wong", hasAudio: true, hasVideo: false },
//     { id: "3", name: "Theresa Webb", hasAudio: true, hasVideo: false },
//     { id: "4", name: "Christian Wong", hasAudio: false, hasVideo: false },
//   ]);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const chatContainerRef = useRef(null);

//   const generateRandomId = (length) => {
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let result = "";
//     for (let i = 0; i < length; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return result;
//   };

//   const getAvatarForName = (name) => {
//     switch (name) {
//       case "Cassie Jung":
//         return Avatar1;
//       case "Alice Wong":
//         return Avatar2;
//       case "Theresa Webb":
//         return Avatar3;
//       case "Christian Wong":
//         return Avatar4;
//       case "Dianne Russell":
//         return Avatar6;
//       case "Guy Hawkins":
//         return Avatar3;
//       case "Kathryn Murphy":
//         return Avatar1;
//       case user?.name:
//         return Avatar5;
//       default:
//         return Avatar5;
//     }
//   };

//   const fetchUserData = async () => {
//     try {
//       const payload = {
//         room: "standupmeet",
//         name: "Samuel",
//         email: "samjidiamond@gmail.com",
//         access_code: "",
//       };

//       const url = "https://dev.konn3ct.ng/api/app/kv4/join-room";
//       const headers = { "Content-Type": "application/json" };

//       const res = await axios.post(url, payload, { headers });
//       const sessionToken = res.data.data;

//       const response = await axios.get(
//         `https://meet.konn3ct.ng/bigbluebutton/api/enter?sessionToken=${sessionToken}`
//       );

//       if (response.data?.response?.returncode === "FAILED") {
//         setError(response.data?.response?.message || "Failed to retrieve user session");
//         return;
//       }

//       console.log("Connect User:", response.data);
//       const userData = response.data.response;
//       userData.name = userData.fullname || userData.name || "Guest";
//       setUser(userData);
//       console.log("User data:", userData);
//     } catch (err) {
//       setError(`Failed to fetch user data: ${err.message}`);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     if (!user || !user.meetingID) return;

//     const ws = new WebSocket(
//       "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
//     );

//     ws.onopen = () => {
//       console.log("WebSocket connected at", new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
//       setSocket(ws);

//       const sendWSMessage = (subMsg) => {
//         ws.send(`[${subMsg}]`);
//         setResponses((prev) => [...prev, `Sent: ${subMsg}`]);
//       };

//       const messages = [
//         `{"msg":"connect","version":"1","support":["1","pre2","pre1"]}`,
//         `{"msg":"method","id":"1","method":"userChangedLocalSettings","params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,"userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,"userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,"guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,"pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},"audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},"dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}}]}`,
//         `{"msg":"method","id":"2","method":"validateAuthToken","params":["${user.meetingID}","${user.internalUserID}","${user.authToken}","${user.externUserID}"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"auth-token-validation","params":[{"meetingId":"${user.meetingID}","userId":"${user.internalUserID}"}]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"current-user","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"polls","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"slides","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"slide-positions","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"captions","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"voiceUsers","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"whiteboard-multi-user","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"screenshare","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat-msg","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation-pods","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-settings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-infos","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"note","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meeting-time-remaining","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"local-settings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-typing","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"record-meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"video-streams","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"connection-status","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"voice-call-status","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"external-video-meetings","params":[]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"breakouts","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"guestUsers","params":["MODERATOR"]}`,
//         `{"msg":"sub","id":"${generateRandomId(17)}","name":"annotations","params":[]}`,
//       ];

//       messages.forEach(sendWSMessage);
//     };

//     ws.onmessage = (event) => {
//       console.log("Raw WebSocket message:", event.data);
//       let data = event.data;

//       if (data.startsWith("a[")) {
//         try {
//           const outer = JSON.parse(data.slice(1, -1));
//           data = JSON.parse(outer);
//         } catch (e) {
//           console.error("Failed to parse message (array wrapper)", e);
//           return;
//         }
//       } else {
//         try {
//           data = JSON.parse(data);
//         } catch (e) {
//           console.error("Failed to parse message (plain JSON)", e);
//           return;
//         }
//       }

//       console.log("Parsed WebSocket message:", data);
//       setResponses((prev) => [...prev, `Received: ${JSON.stringify(data)}`]);

//       if (data.msg === "error") {
//         setError(`WebSocket error: ${data.reason}`);
//       }

//       if (data.msg === "added" && data.collection === "users") {
//         console.log("New user joined:", data.fields);
//         setParticipants((prev) => [
//           ...prev,
//           {
//             id: data.id,
//             name: data.fields.name,
//             isCoHost: data.fields.role === "MODERATOR",
//             hasAudio: false,
//             hasVideo: false,
//           },
//         ]);
//       }

//       if (data.msg === "removed" && data.collection === "users") {
//         console.log("User left:", data.id);
//         setParticipants((prev) => prev.filter((p) => p.id !== data.id));
//       }

//       if (data.msg === "added" && data.collection === "group-chat-msg") {
//         console.log("New chat message received:", data.fields);
//         setChatMessages((prev) => [
//           ...prev,
//           {
//             name: data.fields.sender.name || "Guest",
//             message: data.fields.message,
//             timestamp: new Date(data.fields.timestamp || Date.now()),
//           },
//         ]);
//         if (chatContainerRef.current) {
//           chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("WebSocket error occurred:", err);
//       setError(`WebSocket error at ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}: ${err.message || 'Unknown error'}`);
//     };

//     ws.onclose = (event) => {
//       console.log("WebSocket disconnected:", event.code, event.reason);
//       setError(`WebSocket closed at ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}: Code ${event.code}, Reason: ${event.reason}`);
//       setSocket(null);
//       setTimeout(() => {
//         console.log("Attempting to reconnect WebSocket...");
//         const newWs = new WebSocket(
//           "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
//         );
//         setSocket(newWs);
//       }, 5000);
//     };

//     return () => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//     };
//   }, [user]);

//   const toggleAudio = (id) => {
//     setParticipants((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, hasAudio: !p.hasAudio } : p))
//     );
//   };

//   const toggleVideo = (id) => {
//     setParticipants((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, hasVideo: !p.hasVideo } : p))
//     );
//   };

//   const sendChatMessage = () => {
//     if (!user || !message.trim()) {
//       console.error("Cannot send message:", {
//         user: !!user,
//         message: message.trim(),
//       });
//       setError("Cannot send message: User or message is invalid");
//       return;
//     }

//     if (socket && socket.readyState === WebSocket.OPEN) {
//       const chatId = "MAIN-PUBLIC-GROUP-CHAT";
//       const correlationId = `${user.internalUserID}-${Date.now()}`;
//       const sender = {
//         id: user.internalUserID,
//         name: user.name || "Guest",
//         role: "",
//       };

//       const chatMessage = {
//         msg: "sub",
//         id: generateRandomId(17),
//         name: "sendGroupChatMsg",
//         params: [
//           {
//             chatId,
//             correlationId,
//             sender,
//             chatEmphasizedText: true,
//             message: message.trim(),
//           },
//         ],
//       };

//       try {
//         console.log("Attempting to send message:", chatMessage);
//         socket.send(`[${JSON.stringify(chatMessage)}]`);
//         setResponses((prev) => [...prev, `Sent: ${JSON.stringify(chatMessage)}`]);
//         console.log("Chat message sent successfully");
//       } catch (err) {
//         console.error("Failed to send chat message:", err);
//         setError(`Failed to send chat message: ${err.message}`);
//       }
//     } else {
//       console.warn("WebSocket not connected, adding message locally");
//     }

//     setChatMessages((prev) => [
//       ...prev,
//       {
//         name: user.name || "Guest",
//         message: message.trim(),
//         timestamp: new Date(),
//       },
//     ]);
//     setMessage("");
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   };

//   const sendMessageFromOtherUser = () => {
//     const otherUser = participants.find((p) => p.name !== (user?.name || "Guest")) || {
//       name: "Kathryn Murphy",
//     };
//     const simulatedMessage = {
//       msg: "added",
//       collection: "group-chat-msg",
//       id: generateRandomId(17),
//       fields: {
//         sender: { name: otherUser.name },
//         message: "Testing from another user!",
//         timestamp: Date.now(),
//       },
//     };

//     console.log("Simulating message from another user:", simulatedMessage);
//     setResponses((prev) => [...prev, `Simulated: ${JSON.stringify(simulatedMessage)}`]);
//     setChatMessages((prev) => [
//       ...prev,
//       {
//         name: simulatedMessage.fields.sender.name,
//         message: simulatedMessage.fields.message,
//         timestamp: new Date(simulatedMessage.fields.timestamp),
//       },
//     ]);
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   };

//   const handleControlClick = (control) => {
//     console.log(`Clicked ${control} button`);
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       sendMessageFromOtherUser();
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, [user]);

//   return (
//     <div className="flex flex-col min-h-screen w-full bg-gray-100">
//       <Header />
//       <SemiHead />

//       <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 shadow-md mx-4 mt-2 rounded-lg">
//         <div className="flex space-x-3 items-center">
//           <img
//             src={Protector}
//             alt="P 1"
//             className="w-6 h-6 border-2 border-white"
//           />
//           <div className="flex items-center space-x-2">
//             <img
//               src={Icon}
//               alt="P 2"
//               className="w-6 h-6 border-2 border-white"
//             />
//             <img
//               src={Gridone}
//               alt="P 3"
//               className="w-5 h-5 border-2 border-white"
//             />
//             <img
//               src={Gridtwo}
//               alt="P 4"
//               className="w-6 h-6 border-2 border-white"
//             />
//           </div>
//         </div>

//         <div className="flex items-center space-x-3 mt-2 md:mt-0">
//           <div className="flex -space-x-2">
//             {participants.slice(0, 4).map((participant, index) => {
//               const avatarSrc = getAvatarForName(participant.name);
//               return (
//                 <img
//                   key={participant.id}
//                   src={avatarSrc}
//                   alt={participant.name}
//                   className="w-8 h-8 rounded-full border-2 border-white"
//                 />
//               );
//             })}
//             {participants.length > 4 && (
//               <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E8F2EE] text-[#1E6132] font-semibold text-sm border-2 border-white">
//                 +{participants.length - 4}
//               </div>
//             )}
//           </div>
//           <button className="bg-[#E8F2EE] text-[#1E6132] px-3 py-1 rounded-lg text-sm font-medium">
//             Code: cem-jmnt-hsu
//           </button>
//           <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-1 shadow-sm bg-white">
//             <div className="relative w-5 h-5 flex items-center justify-center">
//               <div className="absolute w-full h-full border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
//               <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//             </div>
//             <span className="text-gray-700 text-sm font-medium">13:03:34</span>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col md:flex-row mx-4 mt-2 mb-4 bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="flex-1 flex flex-col p-4">
//           <div className="relative w-full h-0 pb-[56.25%]">
//             <img
//               className="absolute top-0 left-0 w-full h-full rounded-xl object-cover"
//               src={speaker}
//               alt="Active Speaker"
//             />
//             <div className="absolute top-3 left-3 flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-1 shadow-sm bg-white">
//               <div className="relative w-5 h-5 flex items-center justify-center">
//                 <div className="absolute w-full h-full border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
//                 <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//               </div>
//               <span className="text-gray-700 text-sm font-medium">13:03:34</span>
//             </div>
//             <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm font-medium">
//               Adam Joseph
//             </div>
//             <button className="absolute top-3 right-3 bg-gray-800 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={maximize} alt="screen size" className="w-4 h-4" />
//             </button>
//             <button className="absolute bottom-3 right-3 bg-gray-800 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={sound} alt="sound" className="w-4 h-4" />
//             </button>
//           </div>

//           <div className="w-full mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
//             {participants.map((participant) => (
//               <div key={participant.id} className="relative">
//                 <img
//                   className="w-full h-28 rounded-xl object-cover"
//                   src={
//                     participant.name === "Cassie Jung"
//                       ? Participant1
//                       : participant.name === "Alice Wong"
//                       ? Participant2
//                       : participant.name === "Theresa Webb"
//                       ? Participant3
//                       : Participant1
//                   }
//                   alt={participant.name}
//                 />
//                 <span className="absolute bottom-2 left-2 text-xs bg-gray-800 text-white px-2 py-1 rounded-md">
//                   {participant.name}
//                 </span>
//                 <button
//                   className={`absolute bottom-2 right-2 text-white p-2 rounded-full h-8 w-8 ${
//                     participant.hasAudio ? "bg-[#1E6132]" : "bg-[#EF4444]"
//                   } bg-opacity-70`}
//                   onClick={() => toggleAudio(participant.id)}
//                 >
//                   <img
//                     src={participant.hasAudio ? mic : MIC}
//                     alt={participant.hasAudio ? "mic on" : "mic off"}
//                     className="w-4 h-4"
//                   />
//                 </button>
//               </div>
//             ))}
//           </div>

//           <div className="w-full mt-6 flex flex-col md:flex-row justify-between gap-3">
//             <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-1 shadow-sm bg-white">
//               <img src={slider} alt="slider" className="w-10 h-3" />
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
//                 onClick={() => handleControlClick("Comp2")}
//               >
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </button>
//               <button
//                 className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
//                 onClick={() => handleControlClick("Vect2")}
//               >
//                 <img src={Vect2} alt="control" className="w-5 h-5" />
//               </button>
//               <button
//                 className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
//                 onClick={() => handleControlClick("Icon2")}
//               >
//                 <img src={Icon2} alt="control" className="w-5 h-5" />
//               </button>
//               <button
//                 className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
//                 onClick={() => handleControlClick("Comp2")}
//               >
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </button>
//               <button
//                 className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
//                 onClick={() => handleControlClick("Raise Hand")}
//               >
//                 <img src={hand} alt="raise hand" className="w-5 h-5" />
//               </button>
//             </div>
//             <button className="bg-[#EF4444] text-white py-2 px-4 rounded-lg text-sm font-medium">
//               Leave Meeting
//             </button>
//           </div>
//         </div>

//         <div className="w-full md:w-80 bg-white p-4 h-full overflow-y-auto">
//           <div>
//             <div className="flex flex-row items-center space-x-2">
//               <h2 className="text-sm font-semibold text-gray-800">Participants ({participants.length})</h2>
//               <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1">
//                 <button className="text-xs font-semibold">Add Participant</button>
//                 <img src={AddUser} alt="add user" className="w-3 h-3" />
//               </div>
//             </div>
//             <div className="mt-4 space-y-2">
//               {[
//                 { id: "5", name: "Dianne Russell", isCoHost: true, hasAudio: true, hasVideo: false },
//                 { id: "6", name: "Guy Hawkins", isCoHost: false, hasAudio: false, hasVideo: false },
//                 { id: "7", name: "Kathryn Murphy", isCoHost: false, hasAudio: false, hasVideo: true },
//               ].map((participant) => (
//                 <div key={participant.id} className="flex items-center gap-2 py-2 border-b border-gray-200">
//                   <img
//                     src={getAvatarForName(participant.name)}
//                     alt={participant.name}
//                     className="w-10 h-10 rounded-full border-2 border-white"
//                   />
//                   <div className="flex-1 flex flex-row items-center gap-2">
//                     <p className="font-medium text-sm text-gray-800">{participant.name}</p>
//                     {participant.isCoHost && (
//                       <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
//                         Co-Host
//                       </span>
//                     )}
//                     <img
//                       src={participant.hasAudio ? micon : micoff}
//                       alt={participant.hasAudio ? "mic on" : "mic off"}
//                       className="w-4 h-4"
//                     />
//                     <img
//                       src={participant.hasVideo ? von : voff}
//                       alt={participant.hasVideo ? "video on" : "video off"}
//                       className="w-4 h-4"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mt-6" ref={chatContainerRef}>
//             <div className="flex flex-row items-center space-x-2">
//               <h2 className="text-sm font-semibold text-gray-800">Chats ({chatMessages.length})</h2>
//               <div className="flex gap-2">
//                 <button className="bg-[#1E6132] text-white text-xs px-3 py-1 rounded-full">
//                   Group
//                 </button>
//                 <button className="bg-[#E8F2EE] text-[#1E6132] text-xs px-3 py-1 rounded-full">
//                   Personal
//                 </button>
//                 <img src={vector} alt="options" className="w-3 h-3" />
//               </div>
//             </div>
//             <p className="text-xs text-gray-500 mt-3">April 12, 2024</p>
//             <div className="flex flex-col mt-3 max-h-[50vh] overflow-y-auto space-y-3">
//               {chatMessages.map((msg, index) => (
//                 <div key={index} className="flex flex-row items-start">
//                   <img
//                     src={getAvatarForName(msg.name)}
//                     alt={msg.name}
//                     className="w-9 h-9 rounded-full border-2 border-white mr-2"
//                   />
//                   <div className="flex flex-col">
//                     <div className="flex flex-row items-center space-x-2">
//                       <p className="font-medium text-sm text-gray-800">{msg.name}</p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(msg.timestamp).toLocaleTimeString()}
//                       </p>
//                     </div>
//                     <p className="bg-gray-100 p-2 rounded-lg text-sm text-gray-700">{msg.message}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") sendChatMessage();
//                 }}
//                 placeholder="Send a message"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1E6132]"
//               />
//               <button
//                 onClick={sendChatMessage}
//                 disabled={!message.trim() || !user}
//                 className={`mt-2 w-full py-2 rounded-lg text-sm font-medium ${
//                   message.trim() && user
//                     ? "bg-[#1E6132] text-white"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 Send
//               </button>
//               <button
//                 onClick={sendMessageFromOtherUser}
//                 className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium"
//               >
//                 Simulate Other User Message
//               </button>
//               {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VWeb;