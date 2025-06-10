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
//       msg: "sub",
//       id: generateRandomId(17),
//       name: "sendGroupChatMsg",
//       params: [
//         {
//           chatId,
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

//   const sendMessageFromOtherUser = (name, messageText) => {
//     const simulatedMessage = {
//       msg: "added",
//       collection: "group-chat-msg",
//       id: generateRandomId(17),
//       fields: {
//         sender: { name: name },
//         message: messageText,
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

//   useEffect(() => {
//     // Simulate a message from another user after 5 seconds as an example
//     const timer = setTimeout(() => {
//       sendMessageFromOtherUser("Kathryn Murphy", "Hello, everyone!");
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, []);

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
//               const avatarSrc = [Avatar1, Avatar2, Avatar3, Avatar4][index % 4];
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
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Vect2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Icon2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
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
//                     src={msg.name === "Kathryn Murphy" ? Avatar1 : Avatar5}
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
//                 className="mt-2 w-full bg-[#1E6132] text-white py-2 rounded-lg text-sm font-medium"
//               >
//                 Send
//               </button>
//               <button
//                 onClick={() => sendMessageFromOtherUser("Dianne Russell", "Testing from another user!")}
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
//         name: "", // Name should ideally come from user input or another source; leaving empty for now
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
//       // Extract the name from the response, typically in response.fullname or response.name
//       const userData = response.data.response;
//       userData.name = userData.fullname || userData.name || "Guest"; // Fallback to "Guest" if name isn't found
//       setUser(userData);
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
//       name: user.name || "Guest", // Name now comes from the /enter API response
//       role: "",
//     };

//     const chatMessage = {
//       msg: "sub",
//       id: generateRandomId(17),
//       name: "sendGroupChatMsg",
//       params: [
//         {
//           chatId,
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

//   const sendMessageFromOtherUser = () => {
//     // Use a name from the participants list to simulate a realistic user
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

//   useEffect(() => {
//     // Simulate a message from another user after 5 seconds as an example
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
//               const avatarSrc = [Avatar1, Avatar2, Avatar3, Avatar4][index % 4];
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
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Vect2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Icon2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
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
//                     src={msg.name === "Kathryn Murphy" ? Avatar1 : Avatar5}
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
//                 className="mt-2 w-full bg-[#1E6132] text-white py-2 rounded-lg text-sm font-medium"
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
// import hand from "../Images/hand.png"
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
//       const userData = response.data.response;
//       userData.name = userData.fullname || userData.name || "Guest";
//       setUser(userData);
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
//       console.log("WebSocket disconnected, attempting to reconnect...");
//       setSocket(null);
//       setTimeout(() => {
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
//       msg: "sub",
//       id: generateRandomId(17),
//       name: "sendGroupChatMsg",
//       params: [
//         {
//           chatId,
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
//               const avatarSrc = [Avatar1, Avatar2, Avatar3, Avatar4][index % 4];
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
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Vect2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Icon2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={hand} alt="raise hand" className="w-5 h-5" />
//               </div>
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
//                     src={msg.name === "Kathryn Murphy" ? Avatar1 : Avatar5}
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
//                 disabled={!message.trim() || !socket || socket.readyState !== WebSocket.OPEN}
//                 className={`mt-2 w-full py-2 rounded-lg text-sm font-medium ${
//                   message.trim() && socket && socket.readyState === WebSocket.OPEN
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
//       msg: "sub",
//       id: generateRandomId(17),
//       name: "sendGroupChatMsg",
//       params: [
//         {
//           chatId,
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

//   const sendMessageFromOtherUser = (name, messageText) => {
//     const simulatedMessage = {
//       msg: "added",
//       collection: "group-chat-msg",
//       id: generateRandomId(17),
//       fields: {
//         sender: { name: name },
//         message: messageText,
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

//   useEffect(() => {
//     // Simulate a message from another user after 5 seconds as an example
//     const timer = setTimeout(() => {
//       sendMessageFromOtherUser("Kathryn Murphy", "Hello, everyone!");
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, []);

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
//               const avatarSrc = [Avatar1, Avatar2, Avatar3, Avatar4][index % 4];
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
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Vect2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Icon2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
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
//                     src={msg.name === "Kathryn Murphy" ? Avatar1 : Avatar5}
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
//                 className="mt-2 w-full bg-[#1E6132] text-white py-2 rounded-lg text-sm font-medium"
//               >
//                 Send
//               </button>
//               <button
//                 onClick={() => sendMessageFromOtherUser("Dianne Russell", "Testing from another user!")}
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
//         name: "", // Name should ideally come from user input or another source; leaving empty for now
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
//       // Extract the name from the response, typically in response.fullname or response.name
//       const userData = response.data.response;
//       userData.name = userData.fullname || userData.name || "Guest"; // Fallback to "Guest" if name isn't found
//       setUser(userData);
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
//       name: user.name || "Guest", // Name now comes from the /enter API response
//       role: "",
//     };

//     const chatMessage = {
//       msg: "sub",
//       id: generateRandomId(17),
//       name: "sendGroupChatMsg",
//       params: [
//         {
//           chatId,
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

//   const sendMessageFromOtherUser = () => {
//     // Use a name from the participants list to simulate a realistic user
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

//   useEffect(() => {
//     // Simulate a message from another user after 5 seconds as an example
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
//               const avatarSrc = [Avatar1, Avatar2, Avatar3, Avatar4][index % 4];
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
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Vect2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Icon2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
//               <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
//                 <img src={Comp2} alt="control" className="w-5 h-5" />
//               </div>
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
//                     src={msg.name === "Kathryn Murphy" ? Avatar1 : Avatar5}
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
//                 className="mt-2 w-full bg-[#1E6132] text-white py-2 rounded-lg text-sm font-medium"
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

import React, { useState, useEffect, useRef } from "react";
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

const Webb = () => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([
    { id: "1", name: "Cassie Jung", hasAudio: false, hasVideo: false },
    { id: "2", name: "Alice Wong", hasAudio: true, hasVideo: false },
    { id: "3", name: "Theresa Webb", hasAudio: true, hasVideo: false },
    { id: "4", name: "Christian Wong", hasAudio: false, hasVideo: false },
  ]);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef(null);

  const generateRandomId = (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
        setError(response.data?.response?.message || "Failed to retrieve user session");
        return;
      }

      console.log("Connect User:", response.data);
      const userData = response.data.response;
      userData.name = userData.fullname || userData.name || "Guest";
      setUser(userData);
    } catch (err) {
      setError(`Failed to fetch user data: ${err.message}`);
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

      const sendWSMessage = (subMsg) => {
        ws.send(`[${subMsg}]`);
        setResponses((prev) => [...prev, `Sent: ${subMsg}`]);
      };

      const messages = [
        `{"msg":"connect","version":"1","support":["1","pre2","pre1"]}`,
        `{"msg":"method","id":"1","method":"userChangedLocalSettings","params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,"userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,"userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,"guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,"pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},"audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},"dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}}]}`,
        `{"msg":"method","id":"2","method":"validateAuthToken","params":["${user.meetingID}","${user.internalUserID}","${user.authToken}","${user.externUserID}"]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"auth-token-validation","params":[{"meetingId":"${user.meetingID}","userId":"${user.internalUserID}"}]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"current-user","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"polls","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"slides","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"slide-positions","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"captions","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"voiceUsers","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"whiteboard-multi-user","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"screenshare","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat-msg","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"presentation-pods","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-settings","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-infos","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"note","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"meeting-time-remaining","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"local-settings","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"users-typing","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"record-meetings","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"video-streams","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"connection-status","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"voice-call-status","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"external-video-meetings","params":[]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"meetings","params":["MODERATOR"]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":["MODERATOR"]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"breakouts","params":["MODERATOR"]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"guestUsers","params":["MODERATOR"]}`,
        `{"msg":"sub","id":"${generateRandomId(17)}","name":"annotations","params":[]}`,
      ];

      messages.forEach(sendWSMessage);
    };

    ws.onmessage = (event) => {
      console.log("Raw WebSocket message:", event.data);
      let data = event.data;

      if (data.startsWith("a[")) {
        try {
          const outer = JSON.parse(data.slice(1, -1));
          data = JSON.parse(outer);
        } catch (e) {
          console.error("Failed to parse message (array wrapper)", e);
          return;
        }
      } else {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error("Failed to parse message (plain JSON)", e);
          return;
        }
      }

      console.log("Parsed WebSocket message:", data);
      setResponses((prev) => [...prev, `Received: ${JSON.stringify(data)}`]);

      if (data.msg === "error") {
        setError(`WebSocket error: ${data.reason}`);
      }

      if (data.msg === "added" && data.collection === "users") {
        console.log("New user joined:", data.fields);
        setParticipants((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.fields.name,
            isCoHost: data.fields.role === "MODERATOR",
            hasAudio: false,
            hasVideo: false,
          },
        ]);
      }

      if (data.msg === "removed" && data.collection === "users") {
        console.log("User left:", data.id);
        setParticipants((prev) => prev.filter((p) => p.id !== data.id));
      }

      if (data.msg === "added" && data.collection === "group-chat-msg") {
        console.log("New chat message received:", data.fields);
        setChatMessages((prev) => [
          ...prev,
          {
            name: data.fields.sender.name || "Guest",
            message: data.fields.message,
            timestamp: new Date(data.fields.timestamp || Date.now()),
          },
        ]);
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("WebSocket error occurred");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected, attempting to reconnect...");
      setSocket(null);
      setTimeout(() => {
        const newWs = new WebSocket(
          "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
        );
        setSocket(newWs);
      }, 5000);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user]);

  const toggleAudio = (id) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hasAudio: !p.hasAudio } : p))
    );
  };

  const toggleVideo = (id) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hasVideo: !p.hasVideo } : p))
    );
  };

  const sendChatMessage = () => {
    if (!user || !message.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
      console.error("Cannot send message:", {
        user: !!user,
        message: message.trim(),
        socket: !!socket,
        readyState: socket?.readyState,
      });
      setError("Cannot send message: Check WebSocket connection or input");
      return;
    }

    const chatId = "MAIN-PUBLIC-GROUP-CHAT";
    const correlationId = `${user.internalUserID}-${Date.now()}`;
    const sender = {
      id: user.internalUserID,
      name: user.name || "Guest",
      role: "",
    };

    const chatMessage = {
      msg: "sub",
      id: generateRandomId(17),
      name: "sendGroupChatMsg",
      params: [
        {
          chatId,
          correlationId,
          sender,
          chatEmphasizedText: true,
          message: message.trim(),
        },
      ],
    };

    try {
      console.log("Attempting to send message:", chatMessage);
      socket.send(`[${JSON.stringify(chatMessage)}]`);
      setResponses((prev) => [...prev, `Sent: ${JSON.stringify(chatMessage)}`]);
      console.log("Chat message sent successfully");

      setChatMessages((prev) => [
        ...prev,
        {
          name: user.name || "Guest",
          message: message.trim(),
          timestamp: new Date(),
        },
      ]);
      setMessage("");
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    } catch (err) {
      console.error("Failed to send chat message:", err);
      setError(`Failed to send chat message: ${err.message}`);
    }
  };

  const sendMessageFromOtherUser = () => {
    const otherUser = participants.find((p) => p.name !== (user?.name || "Guest")) || {
      name: "Kathryn Murphy",
    };
    const simulatedMessage = {
      msg: "added",
      collection: "group-chat-msg",
      id: generateRandomId(17),
      fields: {
        sender: { name: otherUser.name },
        message: "Testing from another user!",
        timestamp: Date.now(),
      },
    };

    console.log("Simulating message from another user:", simulatedMessage);
    setResponses((prev) => [...prev, `Simulated: ${JSON.stringify(simulatedMessage)}`]);
    setChatMessages((prev) => [
      ...prev,
      {
        name: simulatedMessage.fields.sender.name,
        message: simulatedMessage.fields.message,
        timestamp: new Date(simulatedMessage.fields.timestamp),
      },
    ]);
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      sendMessageFromOtherUser();
    }, 5000);
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100">
      <Header />
      <SemiHead />

      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 shadow-md mx-4 mt-2 rounded-lg">
        <div className="flex space-x-3 items-center">
          <img
            src={Protector}
            alt="P 1"
            className="w-6 h-6 border-2 border-white"
          />
          <div className="flex items-center space-x-2">
            <img
              src={Icon}
              alt="P 2"
              className="w-6 h-6 border-2 border-white"
            />
            <img
              src={Gridone}
              alt="P 3"
              className="w-5 h-5 border-2 border-white"
            />
            <img
              src={Gridtwo}
              alt="P 4"
              className="w-6 h-6 border-2 border-white"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-2 md:mt-0">
          <div className="flex -space-x-2">
            {participants.slice(0, 4).map((participant, index) => {
              const avatarSrc = [Avatar1, Avatar2, Avatar3, Avatar4][index % 4];
              return (
                <img
                  key={participant.id}
                  src={avatarSrc}
                  alt={participant.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              );
            })}
            {participants.length > 4 && (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E8F2EE] text-[#1E6132] font-semibold text-sm border-2 border-white">
                +{participants.length - 4}
              </div>
            )}
          </div>
          <button className="bg-[#E8F2EE] text-[#1E6132] px-3 py-1 rounded-lg text-sm font-medium">
            Code: cem-jmnt-hsu
          </button>
          <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-1 shadow-sm bg-white">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <div className="absolute w-full h-full border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <span className="text-gray-700 text-sm font-medium">13:03:34</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row mx-4 mt-2 mb-4 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex-1 flex flex-col p-4">
          <div className="relative w-full h-0 pb-[56.25%]">
            <img
              className="absolute top-0 left-0 w-full h-full rounded-xl object-cover"
              src={speaker}
              alt="Active Speaker"
            />
            <div className="absolute top-3 left-3 flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-1 shadow-sm bg-white">
              <div className="relative w-5 h-5 flex items-center justify-center">
                <div className="absolute w-full h-full border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <span className="text-gray-700 text-sm font-medium">13:03:34</span>
            </div>
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm font-medium">
              Adam Joseph
            </div>
            <button className="absolute top-3 right-3 bg-gray-800 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={maximize} alt="screen size" className="w-4 h-4" />
            </button>
            <button className="absolute bottom-3 right-3 bg-gray-800 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={sound} alt="sound" className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {participants.map((participant) => (
              <div key={participant.id} className="relative">
                <img
                  className="w-full h-28 rounded-xl object-cover"
                  src={
                    participant.name === "Cassie Jung"
                      ? Participant1
                      : participant.name === "Alice Wong"
                      ? Participant2
                      : participant.name === "Theresa Webb"
                      ? Participant3
                      : Participant1
                  }
                  alt={participant.name}
                />
                <span className="absolute bottom-2 left-2 text-xs bg-gray-800 text-white px-2 py-1 rounded-md">
                  {participant.name}
                </span>
                <button
                  className={`absolute bottom-2 right-2 text-white p-2 rounded-full h-8 w-8 ${
                    participant.hasAudio ? "bg-[#1E6132]" : "bg-[#EF4444]"
                  } bg-opacity-70`}
                  onClick={() => toggleAudio(participant.id)}
                >
                  <img
                    src={participant.hasAudio ? mic : MIC}
                    alt={participant.hasAudio ? "mic on" : "mic off"}
                    className="w-4 h-4"
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="w-full mt-6 flex flex-col md:flex-row justify-between gap-3">
            <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-1 shadow-sm bg-white">
              <img src={slider} alt="slider" className="w-10 h-3" />
            </div>
            <div className="flex space-x-2">
              <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Comp2} alt="control" className="w-5 h-5" />
              </div>
              <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Vect2} alt="control" className="w-5 h-5" />
              </div>
              <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Icon2} alt="control" className="w-5 h-5" />
              </div>
              <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Comp2} alt="control" className="w-5 h-5" />
              </div>
              <div className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Comp2} alt="control" className="w-5 h-5" />
              </div>
            </div>
            <button className="bg-[#EF4444] text-white py-2 px-4 rounded-lg text-sm font-medium">
              Leave Meeting
            </button>
          </div>
        </div>

        <div className="w-full md:w-80 bg-white p-4 h-full overflow-y-auto">
          <div>
            <div className="flex flex-row items-center space-x-2">
              <h2 className="text-sm font-semibold text-gray-800">Participants ({participants.length})</h2>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1">
                <button className="text-xs font-semibold">Add Participant</button>
                <img src={AddUser} alt="add user" className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { id: "5", name: "Dianne Russell", isCoHost: true, hasAudio: true, hasVideo: false },
                { id: "6", name: "Guy Hawkins", isCoHost: false, hasAudio: false, hasVideo: false },
                { id: "7", name: "Kathryn Murphy", isCoHost: false, hasAudio: false, hasVideo: true },
              ].map((participant) => (
                <div key={participant.id} className="flex items-center gap-2 py-2 border-b border-gray-200">
                  <img
                    src={
                      participant.name === "Dianne Russell"
                        ? Avatar6
                        : participant.name === "Guy Hawkins"
                        ? Avatar3
                        : Avatar1
                    }
                    alt={participant.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div className="flex-1 flex flex-row items-center gap-2">
                    <p className="font-medium text-sm text-gray-800">{participant.name}</p>
                    {participant.isCoHost && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        Co-Host
                      </span>
                    )}
                    <img
                      src={participant.hasAudio ? micon : micoff}
                      alt={participant.hasAudio ? "mic on" : "mic off"}
                      className="w-4 h-4"
                    />
                    <img
                      src={participant.hasVideo ? von : voff}
                      alt={participant.hasVideo ? "video on" : "video off"}
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6" ref={chatContainerRef}>
            <div className="flex flex-row items-center space-x-2">
              <h2 className="text-sm font-semibold text-gray-800">Chats ({chatMessages.length})</h2>
              <div className="flex gap-2">
                <button className="bg-[#1E6132] text-white text-xs px-3 py-1 rounded-full">
                  Group
                </button>
                <button className="bg-[#E8F2EE] text-[#1E6132] text-xs px-3 py-1 rounded-full">
                  Personal
                </button>
                <img src={vector} alt="options" className="w-3 h-3" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">April 12, 2024</p>
            <div className="flex flex-col mt-3 max-h-[50vh] overflow-y-auto space-y-3">
              {chatMessages.map((msg, index) => (
                <div key={index} className="flex flex-row items-start">
                  <img
                    src={msg.name === "Kathryn Murphy" ? Avatar1 : Avatar5}
                    alt={msg.name}
                    className="w-9 h-9 rounded-full border-2 border-white mr-2"
                  />
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center space-x-2">
                      <p className="font-medium text-sm text-gray-800">{msg.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="bg-gray-100 p-2 rounded-lg text-sm text-gray-700">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendChatMessage();
                }}
                placeholder="Send a message"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1E6132]"
              />
              <button
                onClick={sendChatMessage}
                disabled={!message.trim() || !socket || socket.readyState !== WebSocket.OPEN}
                className={`mt-2 w-full py-2 rounded-lg text-sm font-medium ${
                  message.trim() && socket && socket.readyState === WebSocket.OPEN
                    ? "bg-[#1E6132] text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Send
              </button>
              <button
                onClick={sendMessageFromOtherUser}
                className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium"
              >
                Simulate Other User Message
              </button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Webb;