import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import maximize from '../Images/maximize-2.png';
import sound from '../Images/sound.png';
import microphone from '../Images/microphone-slash.png';
import video from '../Images/video.png';
import Avatar1 from '../Images/ava 1.png';
import Avatar2 from '../Images/ava 2.png';
import Avatar3 from '../Images/ava 3.png';
import Avatar4 from '../Images/ava 4.png';
import Avatar5 from '../Images/Icon/image.png';
import micon from "../Images/Icon/Mic-On.png";
import micoff from "../Images/Icon/mic off.png";
import von from "../Images/Icon/Video On.png";
import voff from "../Images/Icon/video-off.png";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Audio from "./AudioWebsocket";
import { useLocation } from 'react-router-dom';



let ws = null;

const Room1 = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [hostAudio, setHostAudio] = useState(false);
  const [hostVideo, setHostVideo] = useState(false);
  const videoRef = useRef(null);
  const location = useLocation();
  const [connectAudio, setConnectAudio] = useState(false);

  



  const generateRandomId = (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getAvatarForName = (name) => {
    switch (name) {
      case "Cassie Jung": return Avatar1;
      case "Alice Wong": return Avatar2;
      case "Theresa Webb": return Avatar3;
      case "Christian Wong": return Avatar4;
      case user?.name: return Avatar5;
      default: return Avatar5;
    }
  };

  const fetchUserData = async () => {
    try {
      
      const sessionToken = location.state?.meeting.data;
      const response = await axios.get(
        `https://meet.konn3ct.ng/bigbluebutton/api/enter?sessionToken=${sessionToken}`
      );

      if (response.data?.response?.returncode === "FAILED") {
        setError(response.data?.response?.message || "Failed to retrieve user session");
        return;
      }

      const userData = response.data.response;
      userData.name = userData.fullname || userData.name || "Guest";
      userData.sessionToken = sessionToken;
      setUser(userData);
    } catch (err) {
      setError(`Failed to fetch user data: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchUserData();
    initializeLocalStream();

    
  const meeting = location.state?.meeting;

    console.log("Room1 joined:", meeting)
  }, []);


  const sendWSMessage = (subMsg) => {
    if (ws != null && ws.readyState === WebSocket.OPEN) {
      ws.send(`[${JSON.stringify(subMsg)}]`);
    }
  };

  const initializeLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);
      setHostAudio(true);
      setHostVideo(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError(`Failed to access microphone or camera: ${err.message}`);
    }
  };

  const createPeerConnection = (participantId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendWSMessage({
          msg: "method",
          method: "sendIceCandidate",
          params: [participantId, JSON.stringify(event.candidate)],
        });
      }
    };

    pc.ontrack = (event) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participantId
            ? { ...p, audioStream: event.streams[0], videoStream: event.streams[0] }
            : p
        )
      );
    };

    if (localStream && hostAudio) {
      localStream.getAudioTracks().forEach((track) => pc.addTrack(track, localStream));
    }
    if (localStream && hostVideo) {
      localStream.getVideoTracks().forEach((track) => pc.addTrack(track, localStream));
    }

    return pc;
  };

  const toggleHostAudio = () => {
    if (!localStream) {
      setError("Microphone not initialized");
      return;
    }

    const audioEnabled = !hostAudio;
    setHostAudio(audioEnabled);
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = audioEnabled;
    });

    participants.forEach((p) => {
      if (p.peerConnection) {
        p.peerConnection.getSenders().forEach((sender) => {
          if (sender.track?.kind === "audio") {
            sender.track.enabled = audioEnabled;
          }
        });
      }
    });
  };

  const toggleHostVideo = () => {
    if (!localStream) {
      setError("Camera not initialized");
      return;
    }

    const videoEnabled = !hostVideo;
    setHostVideo(videoEnabled);
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = videoEnabled;
    });

    participants.forEach((p) => {
      if (p.peerConnection) {
        p.peerConnection.getSenders().forEach((sender) => {
          if (sender.track?.kind === "video") {
            sender.track.enabled = videoEnabled;
          }
        });
      }
    });
  };

  useEffect(() => {
    if (!user || !user.meetingID) return;
    ws = new WebSocket(
      "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
    );

    ws.onopen = () => {
      setSocket(ws);
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
      const subMsg7 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"voiceUsers","params":[]}`;
      sendWSMessage(subMsg7);
      const subMsg8 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"video-streams","params":[]}`;
      sendWSMessage(subMsg8);
      const subMsg9 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"presentation","params":[]}`;
      sendWSMessage(subMsg9);
      const subMsg10 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"slides","params":[]}`;
      sendWSMessage(subMsg10);
      const subMsg11 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"slide-positions","params":[]}`;
      sendWSMessage(subMsg11);
      const subMsg12 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"captions","params":[]}`;
      sendWSMessage(subMsg12);
      const subMsg13 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"voiceUsers","params":[]}`;
      sendWSMessage(subMsg13);
      const subMsg14 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"whiteboard-multi-user","params":[]}`;
      sendWSMessage(subMsg14);
      const subMsg15 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"screenshare","params":[]}`;
      sendWSMessage(subMsg15);
      const subMsg16 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"group-chat","params":[]}`;
      sendWSMessage(subMsg16);
      const subMsg17 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"group-chat-msg","params":[]}`;
      sendWSMessage(subMsg17);
      const subMsg18 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"presentation-pods","params":[]}`;
      sendWSMessage(subMsg18);
      const subMsg19 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"users-settings","params":[]}`;
      sendWSMessage(subMsg19);
      const subMsg20 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"users-infos","params":[]}`;
      sendWSMessage(subMsg20);
      const subMsg21 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"note","params":[]}`;
      sendWSMessage(subMsg21);
      const subMsg22 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"meeting-time-remaining","params":[]}`;
      sendWSMessage(subMsg22);
      const subMsg23 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"local-settings","params":[]}`;
      sendWSMessage(subMsg23);
      const subMsg24 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"users-typing","params":[]}`;
      sendWSMessage(subMsg24);
      const subMsg25 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"record-meetings","params":[]}`;
      sendWSMessage(subMsg25);
      const subMsg26 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"video-streams","params":[]}`;
      sendWSMessage(subMsg26);
      const subMsg27 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"connection-status","params":[]}`;
      sendWSMessage(subMsg27);
      const subMsg28 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"voice-call-status","params":[]}`;
      sendWSMessage(subMsg28);
      const subMsg29 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"external-video-meetings","params":[]}`;
      sendWSMessage(subMsg29);
      const subMsg30 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"meetings","params":["MODERATOR"]}`;
      sendWSMessage(subMsg30);
      const subMsg31 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"users","params":["MODERATOR"]}`;
      sendWSMessage(subMsg31);
      const subMsg32 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"breakouts","params":["MODERATOR"]}`;
      sendWSMessage(subMsg32);
      const subMsg33 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"guestUsers","params":["MODERATOR"]}`;
      sendWSMessage(subMsg33);
      const subMsg34 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"annotations","params":[]}`;
      sendWSMessage(subMsg34);
      const subMsg35 = `{"msg":"method","id":"100","method":"userShareWebcam","params":["${buildStreamName(userCamera.deviceID)}"]}`;
      sendWSMessage(subMsg35);
    };

    ws.onmessage = (event) => {
      let data = event.data;
      if (!data.includes('{')) return;
      const jsonString = data.substring(3, data.length - 2);
      data = JSON.parse(jsonString.replaceAll("\\", ""));

      if (data.msg === "error") {
        setError(`WebSocket error: ${data.reason}`);
      }
      if (data.msg === "added" && data.collection === "users") {
        setConnectAudio(true)
        setParticipants((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.fields.name,
            isCoHost: data.fields.role === "MODERATOR",
            hasAudio: false,
            hasVideo: false,
            peerConnection: createPeerConnection(data.id),
          },
        ]);
      }
      if (data.msg === "removed" && data.collection === "users") {
        setParticipants((prev) => prev.filter((p) => p.id !== data.id));
      }
      if (data.msg === "signal" && data.method) {
        const pc = participants.find((p) => p.id === data.params[0])?.peerConnection;
        if (pc) {
          if (data.method === "offer") {
            const offer = new RTCSessionDescription(data.params[1]);
            pc.setRemoteDescription(offer).then(() => {
              pc.createAnswer().then((answer) => {
                pc.setLocalDescription(answer);
                sendWSMessage({
                  msg: "method",
                  method: "answer",
                  params: [data.params[0], JSON.stringify(answer)],
                });
              });
            });
          } else if (data.method === "candidate") {
            pc.addIceCandidate(new RTCIceCandidate(JSON.parse(data.params[1])));
          }
        }
      }
    };

    ws.onerror = (err) => {
      setError(`WebSocket error: ${err.message || "Unknown error"}`);
    };
    ws.onclose = (event) => {
      setError(`WebSocket closed: Code ${event.code}, Reason: ${event.reason}`);
      setSocket(null);
    };
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
      if (localStream) localStream.getTracks().forEach((track) => track.stop());
    };
  }, [user]);

  const handleControlClick = (control) => {
    if (control === "Mic") {
      toggleHostAudio();
    } else if (control === "Video") {
      toggleHostVideo();
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col w-800">
      <Header />
      {connectAudio && <Audio sessionToken={location.state?.meeting.data}/>}
      <main className="flex-grow flex flex-col items-center justify-center p-6 h-screen">
        <div className="bg-white rounded-lg shadow-lg w-1/2 h-96">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted={true}
              className="bg-black rounded-lg w-full h-80 object-cover"
            />
            <Audio hostAudio={hostAudio} />
            {participants.map((p) =>
              p.videoStream && (
                <video
                  key={p.id}
                  autoPlay
                  className="bg-black rounded-lg w-full h-80 object-cover hidden"
                  srcObject={p.videoStream}
                />
              )
            )}
            <span className="absolute bottom-4 left-4 text-sm bg-gray-800 text-white px-2 py-1 rounded-md">
              {user?.name || "Adam Joseph"}
            </span>
            <button className="absolute top-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={maximize} alt="screen size" />
            </button>
            <button className="absolute bottom-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={sound} alt="sound" />
            </button>
          </div>
          <div className="flex items-center mt-1 space-x-4 p-4 rounded-lg bg-gray-100 justify-between w-full">
            <input
              type="range"
              className="w-24 bg-green-500 rounded-full bg-block"
            />
            <div className="items-center space-x-4 flex flex-row">
              <button
                className="bg-[#217148] text-white px-4 py-2 rounded-3xl"
                onClick={() => navigate('/EWeb')}
              >
                Join Meeting
              </button>
              <div className="relative group">
                <button
                  className={`text-white p-2 rounded-full h-8 w-8 ${hostAudio ? "bg-[#21714B]" : "bg-gray-700"} bg-opacity-70`}
                  onClick={() => handleControlClick("Mic")}
                >
                  <img src={hostAudio ? micon : microphone} alt={hostAudio ? "audio on" : "audio off"} />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:inline-block bg-gray-800 text-white text-xs px-4 py-1 rounded-full">
                  {hostAudio ? "Audio On" : "Audio Off"}
                </div>
              </div>
              <div className="relative group">
                <button
                  className={`text-white p-2 rounded-full h-8 w-8 ${hostVideo ? "bg-[#21714B]" : "bg-gray-700"} bg-opacity-70`}
                  onClick={() => handleControlClick("Video")}
                >
                  <img src={hostVideo ? von : video} alt={hostVideo ? "video on" : "video off"} />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-3 py-1 rounded">
                  {hostVideo ? "Video On" : "Video Off"}
                </div>
              </div>
            </div>
            <button className="text-gray-700 bg-gray-300 rounded-full h-8 w-8 text-lg flex justify-center text-center items-center">⋯</button>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <div className="flex -space-x-2">
            {participants.slice(0, 4).map((participant) => (
              <img
                key={participant.id}
                src={getAvatarForName(participant.name)}
                alt={participant.name}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ))}
            {participants.length > 4 && (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700 font-semibold text-sm border-2 border-white">
                +{participants.length - 4}
              </div>
            )}
          </div>
          <span className="text-gray-700 text-sm">Are in this meeting</span>
        </div>
      </main>
    </div>
  );
};

export default Room1;



// import React, { useState, useEffect, useRef } from "react";
// import Header from "./Header";
// import maximize from '../Images/maximize-2.png';
// import sound from '../Images/sound.png';
// import microphone from '../Images/microphone-slash.png';
// import video from '../Images/video.png';
// import Avatar1 from '../Images/ava 1.png';
// import Avatar2 from '../Images/ava 2.png';
// import Avatar3 from '../Images/ava 3.png';
// import Avatar4 from '../Images/ava 4.png';
// import Avatar5 from '../Images/Icon/image.png';
// import micon from "../Images/Icon/Mic-On.png";
// import micoff from "../Images/Icon/mic off.png";
// import von from "../Images/Icon/Video On.png";
// import voff from "../Images/Icon/video-off.png";
// import vector from "../Images/Icon/Vector.png";
// import hand from "../Images/Icon/hand.png";
// import recordIcon from "../Images/Icon/recordIcon.png";
// import { useNavigate } from 'react-router-dom';
// import axios from "axios";
// import Audio from "./AudioWebsocket";

// let ws = null;

// const Room1 = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [error, setError] = useState(null);
//   const [participants, setParticipants] = useState([]);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [isHandRaised, setIsHandRaised] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [localStream, setLocalStream] = useState(null);
//   const [hostAudio, setHostAudio] = useState(false);
//   const [hostVideo, setHostVideo] = useState(false);
//   const chatContainerRef = useRef(null);
//   const videoRef = useRef(null);

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
//       case "Cassie Jung": return Avatar1;
//       case "Alice Wong": return Avatar2;
//       case "Theresa Webb": return Avatar3;
//       case "Christian Wong": return Avatar4;
//       case user?.name: return Avatar5;
//       default: return Avatar5;
//     }
//   };

//   const fetchUserData = async () => {
//     try {
//       const payload = {
//         room: "standupmeet",
//         name: "Lukman",
//         email: "w.aladebowale@gmail.com",
//         access_code: "",
//       };
//       const url = "https://dev.konn3ct.ng/api/app/kv4/join-room";
//       const headers = { "Content-Type": "application/json" };
//       const res = await axios.post(url, payload, { headers });
//       const sessionToken = res.data.data;
//       const response = await axios.get(
//         `https://meet.konn3ct.ng/bigbluebutton/api/enter?sessionToken=kmisxt3vowpbidre`
//       );

//       if (response.data?.response?.returncode === "FAILED") {
//         setError(response.data?.response?.message || "Failed to retrieve user session");
//         return;
//       }

//       const userData = response.data.response;
//       userData.name = userData.fullname || userData.name || "Guest";
//       userData.sessionToken = sessionToken;
//       setUser(userData);
//     } catch (err) {
//       setError(`Failed to fetch user data: ${err.message}`);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//     initializeLocalStream();
//   }, []);

//   const sendWSMessage = (subMsg) => {
//     if (ws != null && ws.readyState === WebSocket.OPEN) {
//       ws.send(`[${JSON.stringify(subMsg)}]`);
//     }
//   };

//   const initializeLocalStream = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setLocalStream(stream);
//       setHostAudio(true);
//       setHostVideo(true);
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (err) {
//       setError(`Failed to access microphone or camera: ${err.message}`);
//     }
//   };

//   const createPeerConnection = (participantId) => {
//     const pc = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         sendWSMessage({
//           msg: "method",
//           method: "sendIceCandidate",
//           params: [participantId, JSON.stringify(event.candidate)],
//         });
//       }
//     };

//     pc.ontrack = (event) => {
//       setParticipants((prev) =>
//         prev.map((p) =>
//           p.id === participantId
//             ? { ...p, audioStream: event.streams[0], videoStream: event.streams[0] }
//             : p
//         )
//       );
//     };

//     if (localStream && hostAudio) {
//       localStream.getAudioTracks().forEach((track) => pc.addTrack(track, localStream));
//     }
//     if (localStream && hostVideo) {
//       localStream.getVideoTracks().forEach((track) => pc.addTrack(track, localStream));
//     }

//     return pc;
//   };

//   const toggleHostAudio = () => {
//     if (!localStream) {
//       setError("Microphone not initialized");
//       return;
//     }

//     const audioEnabled = !hostAudio;
//     setHostAudio(audioEnabled);
//     localStream.getAudioTracks().forEach((track) => {
//       track.enabled = audioEnabled;
//     });

//     participants.forEach((p) => {
//       if (p.peerConnection) {
//         p.peerConnection.getSenders().forEach((sender) => {
//           if (sender.track?.kind === "audio") {
//             sender.track.enabled = audioEnabled;
//           }
//         });
//       }
//     });
//   };

//   const toggleHostVideo = () => {
//     if (!localStream) {
//       setError("Camera not initialized");
//       return;
//     }

//     const videoEnabled = !hostVideo;
//     setHostVideo(videoEnabled);
//     localStream.getVideoTracks().forEach((track) => {
//       track.enabled = videoEnabled;
//     });

//     participants.forEach((p) => {
//       if (p.peerConnection) {
//         p.peerConnection.getSenders().forEach((sender) => {
//           if (sender.track?.kind === "video") {
//             sender.track.enabled = videoEnabled;
//           }
//         });
//       }
//     });
//   };

//   useEffect(() => {
//     if (!user || !user.meetingID) return;
//     ws = new WebSocket(
//       "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
//     );

//     ws.onopen = () => {
//       setSocket(ws);
//       const subMsg1 = `{"msg":"connect","version":"1","support":["1","pre2","pre1"]}`;
//       sendWSMessage(subMsg1);
//       const subMsg2 = `{"msg":"method","id":"1","method":"userChangedLocalSettings","params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,"userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,"userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,"guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,"pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},"audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},"dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}}]}`;
//       sendWSMessage(subMsg2);
//       const subMsg3 = `{"msg":"method","id":"2","method":"validateAuthToken","params":["${user?.meetingID}","${user?.internalUserID}","${user?.authToken}","${user?.externUserID}"]}`;
//       sendWSMessage(subMsg3);
//       const subMsg4 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"auth-token-validation","params":[{"meetingId":"${user?.meetingID}","userId":"${user?.internalUserID}"}]}`;
//       sendWSMessage(subMsg4);
//       const subMsg5 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"current-user","params":[]}`;
//       sendWSMessage(subMsg5);
//       const subMsg6 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"users","params":[]}`;
//       sendWSMessage(subMsg6);
//       const subMsg7 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"voiceUsers","params":[]}`;
//       sendWSMessage(subMsg7);
//       const subMsg8 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"group-chat-msg","params":[]}`;
//       sendWSMessage(subMsg8);
//       const subMsg9 = `{"msg":"sub","id":"${generateRandomId(17)}","name":"record-meetings","params":[]}`;
//       sendWSMessage(subMsg9);
//     };

//     ws.onmessage = (event) => {
//       let data = event.data;
//       if (!data.includes('{')) return;
//       const jsonString = data.substring(3, data.length - 2);
//       data = JSON.parse(jsonString.replaceAll("\\", ""));

//       if (data.msg === "added" && data.collection === "group-chat-msg") {
//         setChatMessages((prev) => [
//           ...prev,
//           {
//             name: data.fields.senderName || "Guest",
//             message: data.fields.message,
//             timestamp: new Date(data.fields.timestamp || Date.now()),
//           },
//         ]);
//       }
//       if (data.msg === "error") {
//         setError(`WebSocket error: ${data.reason}`);
//       }
//       if (data.msg === "added" && data.collection === "users") {
//         setParticipants((prev) => [
//           ...prev,
//           {
//             id: data.id,
//             name: data.fields.name,
//             isCoHost: data.fields.role === "MODERATOR",
//             hasAudio: false,
//             hasVideo: false,
//             raisedHand: data.fields.emojiStatus === "raiseHand",
//             peerConnection: createPeerConnection(data.id),
//           },
//         ]);
//       }
//       if (data.msg === "changed" && data.collection === "users") {
//         setParticipants((prev) =>
//           prev.map((p) =>
//             p.id === data.id
//               ? { ...p, raisedHand: data.fields.emojiStatus === "raiseHand" }
//               : p
//           )
//         );
//       }
//       if (data.msg === "removed" && data.collection === "users") {
//         setParticipants((prev) => prev.filter((p) => p.id !== data.id));
//       }
//       if (data.msg === "signal" && data.method) {
//         const pc = participants.find((p) => p.id === data.params[0])?.peerConnection;
//         if (pc) {
//           if (data.method === "offer") {
//             const offer = new RTCSessionDescription(data.params[1]);
//             pc.setRemoteDescription(offer).then(() => {
//               pc.createAnswer().then((answer) => {
//                 pc.setLocalDescription(answer);
//                 sendWSMessage({
//                   msg: "method",
//                   method: "answer",
//                   params: [data.params[0], JSON.stringify(answer)],
//                 });
//               });
//             });
//           } else if (data.method === "candidate") {
//             pc.addIceCandidate(new RTCIceCandidate(JSON.parse(data.params[1])));
//           }
//         }
//       }
//       if (chatContainerRef.current) {
//         chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//       }
//       if (data.msg === "changed" && data.collection === "record-meetings") {
//         setIsRecording(data.fields.recording);
//       }
//     };

//     ws.onerror = (err) => {
//       setError(`WebSocket error: ${err.message || "Unknown error"}`);
//     };
//     ws.onclose = (event) => {
//       setError(`WebSocket closed: Code ${event.code}, Reason: ${event.reason}`);
//       setSocket(null);
//     };
//     return () => {
//       if (ws && ws.readyState === WebSocket.OPEN) ws.close();
//       if (localStream) localStream.getTracks().forEach((track) => track.stop());
//     };
//   }, [user]);

//   const sendChatMessage = () => {
//     if (!user || !message.trim()) {
//       setError("Cannot send message: User or message is invalid");
//       return;
//     }
//     const subCMsg = `{"msg":"method","id":"292","method":"sendGroupChatMsg","params":["MAIN-PUBLIC-GROUP-CHAT",{"correlationId":"w_73iggoe29s2z-1748036833279","sender":{"id":"w_73iggoe29s2z","name":"${user.name}","role":""},"chatEmphasizedText":true,"message":"${message.trim()}"}]}`;
//     sendWSMessage(subCMsg);
//     setChatMessages((prev) => [
//       ...prev,
//       { name: user.name || "Guest", message: message.trim(), timestamp: new Date() },
//     ]);
//     setMessage("");
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   };

//   const handleControlClick = (control) => {
//     if (control === "Raise Hand") {
//       const newHandRaisedState = !isHandRaised;
//       setIsHandRaised(newHandRaisedState);
//       setParticipants((prev) =>
//         prev.map((p) =>
//           p.name === user?.name ? { ...p, raisedHand: newHandRaisedState } : p
//         )
//       );
//       if (socket && socket.readyState === WebSocket.OPEN) {
//         const raiseHandMessage = `{"msg":"method","id":"1003","method":"setEmojiStatus","params":["${user?.internalUserID}","${newHandRaisedState ? 'raiseHand' : 'none'}"]}`;
//         sendWSMessage(raiseHandMessage);
//       }
//     } else if (control === "Record") {
//       const newRecordingState = !isRecording;
//       setIsRecording(newRecordingState);
//       if (socket && socket.readyState === WebSocket.OPEN) {
//         const toggleRecordingMessage = `{"msg":"method","id":"10005","method":"toggleRecording","params":[]}`;
//         sendWSMessage(toggleRecordingMessage);
//       }
//     } else if (control === "Mic") {
//       toggleHostAudio();
//     } else if (control === "Video") {
//       toggleHostVideo();
//     }
//   };

//   return (
//     <div className="h-screen bg-gray-100 flex flex-col w-800">
//       <Header />
//       <main className="flex-grow flex flex-col items-center justify-center p-6 h-screen">
//         <div className="bg-white rounded-lg shadow-lg w-1/2 h-96">
//           <div className="relative">
//             <video
//               ref={videoRef}
//               autoPlay
//               muted={true}
//               className="bg-black rounded-lg w-full h-80 object-cover"
//             />
//             <Audio hostAudio={hostAudio} />
//             {participants.map((p) =>
//               p.videoStream && (
//                 <video
//                   key={p.id}
//                   autoPlay
//                   className="bg-black rounded-lg w-full h-80 object-cover hidden"
//                   srcObject={p.videoStream}
//                 />
//               )
//             )}
//             <span className="absolute bottom-4 left-4 text-sm bg-gray-800 text-white px-2 py-1 rounded-md">
//               {user?.name || "Adam Joseph"}
//             </span>
//             <button className="absolute top-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={maximize} alt="screen size" />
//             </button>
//             <button className="absolute bottom-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={sound} alt="sound" />
//             </button>
//           </div>
//           <div className="flex items-center mt-1 space-x-4 p-4 rounded-lg bg-gray-100 justify-between w-full">
//             <input
//               type="range"
//               className="w-24 bg-green-500 rounded-full bg-block"
//             />
//             <div className="items-center space-x-4 flex flex-row">
//               <button
//                 className="bg-[#217148] text-white px-4 py-2 rounded-3xl"
//                 onClick={() => navigate('/EWeb')}
//               >
//                 Join Meeting
//               </button>
//               <div className="relative group">
//                 <button
//                   className={`text-white p-2 rounded-full h-8 w-8 ${hostAudio ? "bg-[#21714B]" : "bg-gray-700"} bg-opacity-70`}
//                   onClick={() => handleControlClick("Mic")}
//                 >
//                   <img src={hostAudio ? micon : microphone} alt={hostAudio ? "audio on" : "audio off"} />
//                 </button>
//                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:inline-block bg-gray-800 text-white text-xs px-4 py-1 rounded-full">
//                   {hostAudio ? "Audio On" : "Audio Off"}
//                 </div>
//               </div>
//               <div className="relative group">
//                 <button
//                   className={`text-white p-2 rounded-full h-8 w-8 ${hostVideo ? "bg-[#21714B]" : "bg-gray-700"} bg-opacity-70`}
//                   onClick={() => handleControlClick("Video")}
//                 >
//                   <img src={hostVideo ? von : video} alt={hostVideo ? "video on" : "video off"} />
//                 </button>
//                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-3 py-1 rounded">
//                   {hostVideo ? "Video On" : "Video Off"}
//                 </div>
//               </div>
//               <div className="relative group">
//                 <button
//                   className="text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8"
//                   onClick={() => handleControlClick("Raise Hand")}
//                 >
//                   <img src={hand} alt="raise hand" className={`w-4 h-4 ${isHandRaised ? "hue-rotate-90" : ""}`} />
//                 </button>
//                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-3 py-1 rounded">
//                   {isHandRaised ? "Lower Hand" : "Raise Hand"}
//                 </div>
//               </div>
//               <div className="relative group">
//                 <button
//                   className="text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8"
//                   onClick={() => handleControlClick("Record")}
//                 >
//                   <img src={recordIcon} alt={isRecording ? "pause recording" : "record"} className={`w-4 h-4 ${isRecording ? "hue-rotate-0" : "hue-rotate-180"}`} />
//                 </button>
//                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-3 py-1 rounded">
//                   {isRecording ? "Pause Recording" : "Record"}
//                 </div>
//               </div>
//             </div>
//             <button className="text-gray-700 bg-gray-300 rounded-full h-8 w-8 text-lg flex justify-center text-center items-center">⋯</button>
//           </div>
//         </div>
//         <div className="flex items-center space-x-2 mt-4">
//           <div className="flex -space-x-2">
//             {participants.slice(0, 4).map((participant) => (
//               <img
//                 key={participant.id}
//                 src={getAvatarForName(participant.name)}
//                 alt={participant.name}
//                 className="w-8 h-8 rounded-full border-2 border-white"
//               />
//             ))}
//             {participants.length > 4 && (
//               <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700 font-semibold text-sm border-2 border-white">
//                 +{participants.length - 4}
//               </div>
//             )}
//           </div>
//           <span className="text-gray-700 text-sm">Are in this meeting</span>
//         </div>
//         <div className="bg-white rounded-lg shadow-lg w-1/2 p-4 mt-4">
//           <div className="flex flex-row items-center space-x-2">
//             <h2 className="text-sm font-semibold text-gray-800">Chats ({chatMessages.length})</h2>
//             <div className="flex gap-2">
//               <button className="bg-[#217148] text-white text-xs px-3 py-1 rounded-full">Group</button>
//               <button className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Personal</button>
//               <img src={vector} alt="options" className="w-3 h-3" />
//             </div>
//           </div>
//           <p className="text-xs text-gray-500 mt-3">April 12, 2024</p>
//           <div className="flex flex-col mt-3 max-h-[30vh] overflow-y-auto space-y-3" ref={chatContainerRef}>
//             {chatMessages.map((msg, index) => (
//               <div key={index} className="flex flex-row items-start">
//                 <img
//                   src={getAvatarForName(msg.name)}
//                   alt={msg.name}
//                   className="w-9 h-9 rounded-full border-2 border-white mr-2"
//                 />
//                 <div className="flex flex-col">
//                   <div className="flex flex-row items-center space-x-2">
//                     <p className="font-medium text-sm text-gray-800">{msg.name}</p>
//                     <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</p>
//                   </div>
//                   <p className="bg-gray-100 p-2 rounded-lg text-sm text-gray-700">{msg.message}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="mt-4">
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => { if (e.key === "Enter") sendChatMessage(); }}
//               placeholder="Send a message"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#217148]"
//             />
//             <button
//               onClick={() => sendChatMessage()}
//               disabled={!message.trim() || !user}
//               className={`mt-2 w-full py-2 rounded-lg text-sm font-medium ${
//                 message.trim() && user ? "bg-[#217148] text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
//               }`}
//             >
//               Send
//             </button>
//             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Room1;


// import React from "react";
// import Header from "./Header";
// import maximize from '../Images/maximize-2.png';
// import sound from '../Images/sound.png';
// import microphone from '../Images/microphone-slash.png';
// import video from '../Images/video.png';
// import Avatar1 from '../Images/ava 1.png';
// import Avatar2 from '../Images/ava 2.png';
// import Avatar3 from '../Images/ava 3.png';
// import Avatar4 from '../Images/ava 4.png';
// import { useNavigate } from 'react-router-dom';

// const Room1 = () => {
//     const navigate = useNavigate();
//     //  const [localStream, setLocalStream] = useState(null);
//     //   const [hostAudio, setHostAudio] = useState(false); 
//     //   const [hostVideo, setHostVideo] = useState(false);
//     //   const videoRef = useRef(null); 
//     //     const reconnectAttempts = useRef(0);
//     //     const maxReconnectAttempts = 5;
//     //     const reconnectDelay = useRef(1000); 
  
//   return (
// <div className="h-screen bg-gray-100 flex flex-col w-800"> 
      
//       < Header/>

//       {/* Main Content */} 
//     <main className="flex-grow flex flex-col items-center justify-center p-6 h-screen">
//         <div className="bg-white rounded-lg shadow-lg w-1/2 h-96" >
//           <div className="relative">
//             <div className="bg-black rounded-lg w-full h-80"></div>
//             <span className="absolute bottom-4 left-4 text-sm bg-gray-800 text-white px-2 py-1 rounded-md">
//               Adam Joseph
//             </span>
//             <button className="absolute top-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={maximize} alt="screen size" />
//             </button>
//             <button className="absolute bottom-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
//               <img src={sound} alt="sound" />
//             </button>
//           </div>

//           {/* Controls */}
//           <div className="flex items-center mt-1 space-x-4 p-4 rounded-lg bg-gray-100 justify-between w-full">
              
//               {/* Volume Slider */}
//             <input
//               type="range"
//               className="w-24 bg-green-500 rounded-full bg-block"/>
              
//               {/* Join Meeting Button */}
//             <div className="items-center space-x-4 flex flex-row">
//                 <button className="bg-[#217148] text-white px-4 py-2 rounded-3xl" onClick={() => navigate('/EWeb')}>
//                   Join Meeting 
//                 </button>

//               {/* Audio Control */}
//               <div className="relative group">
//                 <button className=" text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
//                 <img src={microphone} alt="audio off" />
//                 </button>
//                 {/* Tooltip */}
//                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:inline-block
//                 bg-gray-800 text-white text-xs px-4 py-1 rounded-full">Audio Off
//                 </div>
//               </div>

//               {/* video Control */}
//               <div className="relative group">
//                 <button className=" text-white bg-[#21714B] bg-opacity-70 p-2 rounded-full h-8 w-8">
//                 <img src={video} alt="video on"/>
//                 </button>
//                 {/* Tooltip */}
//                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden 
//                 group-hover:block bg-gray-800 text-white text-sm px-3 py-1 rounded">Video On
//                 </div>
//               </div>


//             </div>
//             <button className="text-gray-700 bg-gray-300 rounded-full h-8 w-8 text-lg flex justify-center 
//             text-center items-center">⋯</button>

//         </div>
          
          
//       </div>
//             {/* Participants */}
//               <div className="flex items-center space-x-2 mt-4">
//                 <div className="flex -space-x-2">
//                     <img src={Avatar1} alt="Participant 1" className="w-8 h-8 rounded-full border-2 border-white" />
//                     <img src={Avatar2} alt="Participant 2" className="w-8 h-8 rounded-full border-2 border-white" />
//                     <img src={Avatar3} alt="Participant 3" className="w-8 h-8 rounded-full border-2 border-white" />
//                     <img src={Avatar4} alt="Participant 4" className="w-8 h-8 rounded-full border-2 border-white" />
//                     <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700 
//                       font-semibold text-sm border-2 border-white">+9
//                     </div>
//                   </div>
//                 <span className="text-gray-700 text-sm">Are in this meeting</span>
//               </div>
    
//     </main>
// </div> 

//   );
// };

// export default Room1;
