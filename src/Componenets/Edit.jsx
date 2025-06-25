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
import hand from "../Images/Icon/hand.png";
import recordIcon from "../Images/Icon/recordIcon.png";
import axios from "axios";

let ws = null;

const EWeb = () => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messageQueue, setMessageQueue] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [hostAudio, setHostAudio] = useState(false); // Host microphone state
  const [hostVideo, setHostVideo] = useState(false); // Host video state
  const chatContainerRef = useRef(null);
  const videoRef = useRef(null); // Ref for local video element
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = useRef(1000); // Initial delay of 1 second

  const generateRandomId = (length) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getAvatarForName = (name) => {
    switch (name) {
      case "Cassie Jung":
        return Avatar1;
      case "Alice Wong":
        return Avatar2;
      case "Theresa Webb":
        return Avatar3;
      case "Christian Wong":
        return Avatar4;
      case "Dianne Russell":
        return Avatar6;
      case "Guy Hawkins":
        return Avatar3;
      case "Kathryn Murphy":
        return Avatar1;
      case user?.name:
        return Avatar5;
      default:
        return Avatar5;
    }
  };

  const fetchUserData = async () => {
    try {
      const payload = {
        room: "Ade1253uL",
        name: "Wale Pung",
        email: "w.aladebowale@gmail.com",
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
      const userData = response.data.response;
      userData.name = userData.fullname || userData.name || "Guest";
      setUser(userData);
      console.log("User data:", userData);
    } catch (err) {
      setError(`Failed to fetch user data: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchUserData();
    initializeLocalStream();
  }, []);

  const sendWSMessage = (subMsg) => {
    if (ws != null && ws.readyState === WebSocket.OPEN) {
      ws.send(`[${JSON.stringify(subMsg)}]`);
      setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subMsg)}`]);
    }
  };

  const initializeLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      console.log("Audio and video available:", stream);
      setLocalStream(stream);
      setHostAudio(true); // Enable audio by default
      setHostVideo(true); // Enable video by default
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

    console.log(`Host microphone ${audioEnabled ? "unmuted" : "muted"}`);
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

    console.log(`Host camera ${videoEnabled ? "on" : "off"}`);
  };

  const toggleAudio = (id) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hasAudio: !p.hasAudio } : p))
    );
  };

  useEffect(() => {
    if (!user || !user.meetingID) return;
    ws = new WebSocket(
      "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
      setSocket(ws);

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
      const subMsg4 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"auth-token-validation","params":[{"meetingId":"${
        user?.meetingID
      }","userId":"${user?.internalUserID}"}]}`;
      sendWSMessage(subMsg4);
      const subMsg5 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"current-user","params":[]}`;
      sendWSMessage(subMsg5);
      const subMsg6 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"users","params":[]}`;
      sendWSMessage(subMsg6);
      const subMsg7 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"voiceUsers","params":[]}`;
      sendWSMessage(subMsg7);
      const subMsg8 = `{"msg":"sub","id":"${generateRandomId(
        17
      )}","name":"polls","params":[]}`;
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
    };

    ws.onmessage = (event) => {
      console.log("Raw WebSocket message:", event.data);
      let data = event.data;

      if (!data.includes('{')) {
        console.log("No need to parse");
        return;
      }

      // Correctly parse the incoming data
      const jsonString = data.substring(3, data.length - 2);
      console.log("Remove part WebSocket message Tip:", jsonString);
      data = JSON.parse(jsonString.replaceAll("\\", ""));

      console.log("Parsed WebSocket message Tip:", data);
      if (data.msg === "added" && data.collection === "group-chat-msg") {
        console.log("New chat message received:", data.fields);
        setChatMessages((prev) => {
          const newMessage = {
            name: data.fields.senderName || "Guest",
            message: data.fields.message,
            timestamp: new Date(data.fields.timestamp || Date.now()),
          };
          const updatedMessages = [...prev, newMessage];
          console.log("Updated chatMessages:", updatedMessages); 
          return updatedMessages;
        });
      }
      if (data.msg === "error") {
        console.log(`No error: ${data.reason}`);
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
            raisedHand: data.fields.emojiStatus === "raiseHand",
            peerConnection: createPeerConnection(data.id),
          },
        ]);
      }
      if (data.msg === "changed" && data.collection === "users") {
        console.log("User updated:", data.fields);
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === data.id
              ? { ...p, raisedHand: data.fields.emojiStatus === "raiseHand" }
              : p
          )
        );
      }
      if (data.msg === "removed" && data.collection === "users") {
        console.log("User left:", data.id);
        setParticipants((prev) => prev.filter((p) => p.id !== data.id));
      }
      
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
      if (data.msg === "changed" && data.collection === "record-meetings") {
        console.log("Recording state updated:", data.fields);
        setIsRecording(data.fields.recording);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error occurred:", err);
      setError(
        `WebSocket error at ${new Date().toLocaleString("en-US", {
          timeZone: "Africa/Lagos",
        })}: ${err.message || "Unknown error"}`
      );
    };
    ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code, event.reason);
      if (event.code !== 1006) {
        setError(
          `WebSocket closed at ${new Date().toLocaleString("en-US", {
            timeZone: "Africa/Lagos",
          })}: Code ${event.code}, Reason: ${event.reason}`
        );
      }
      setSocket(null);
    };
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [user]);

  const toggleVideo = (id) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hasVideo: !p.hasVideo } : p))
    );
  };
  
  const sendChatMessage = () => {
    if (!user || !message.trim()) {
      console.error("Cannot send message:", {
        user: !!user,
        message: message.trim(),
      });
      setError("Cannot send message: User or message is invalid");
      return;
    }

    const subCMsg = `{"msg":"method","id":"292","method":"sendGroupChatMsg","params":["MAIN-PUBLIC-GROUP-CHAT",{"correlationId":"w_73iggoe29s2z-1748036833279","sender":{"id":"w_73iggoe29s2z","name":"","role":""},"chatEmphasizedText":true,"message":"${message.trim()}"}]}`
    sendWSMessage(subCMsg);

    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        console.log("WebSocket readyState:", socket.readyState);
        console.log("Attempting to send message:", subCMsg);
        socket.send(`[${JSON.stringify(subCMsg)}]`);
        setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subCMsg)}`]);
        console.log("Chat message sent successfully");
      } catch (err) {
        console.error("Failed to send chat message:", err);
        setError(`Failed to send chat message: ${err.message}`);
      }
    } else {
      console.warn(
        "WebSocket not connected or not authenticated, queuing message. readyState:",
        socket?.readyState,
        "Authenticated:"
      );
      setMessageQueue((prev) => [...prev, subCMsg]);
    }
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
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleControlClick = (control) => {
    if (control === "Raise Hand") {
      const newHandRaisedState = !isHandRaised;
      setIsHandRaised(newHandRaisedState);

      setParticipants((prev) =>
        prev.map((p) =>
          p.name === user?.name ? { ...p, raisedHand: newHandRaisedState } : p
        )
      );

      if (socket && socket.readyState === WebSocket.OPEN) {
        const raiseHandMessage = `{"msg":"method","id":"1003","method":"setEmojiStatus","params":["${user?.internalUserID}","${newHandRaisedState ? 'raiseHand' : 'none'}"]}`;
        sendWSMessage(raiseHandMessage);
        try {
          socket.send(`[${JSON.stringify(raiseHandMessage)}]`);
          setResponses((prev) => [
            ...prev,
            `Sent: ${JSON.stringify(raiseHandMessage)}`,
          ]);
          console.log("Raise hand message sent successfully");
        } catch (err) {
          console.error("Failed to send raise hand message:", err);
          setError(`Failed to send raise hand message: ${err.message}`);
        }
      } else {
        console.warn("WebSocket not connected, hand raise updated locally only");
      }
    } else if (control === "Record") {
      const newRecordingState = !isRecording;
      setIsRecording(newRecordingState);

      if (socket && socket.readyState === WebSocket.OPEN) {
        const toggleRecordingMessage = `{"msg":"method","id":"10005","method":"toggleRecording","params":[]}`;
        sendWSMessage(toggleRecordingMessage);
        try {
          socket.send(`[${JSON.stringify(toggleRecordingMessage)}]`);
          setResponses((prev) => [
            ...prev,
            `Sent: ${JSON.stringify(toggleRecordingMessage)}`,
          ]);
          console.log("Toggle recording message sent successfully");
        } catch (err) {
          console.error("Failed to send toggle recording message:", err);
          setError(`Failed to send toggle recording message: ${err.message}`);
        }
      } else {
        console.warn("WebSocket not connected, recording state updated locally only");
      }
    } else if (control === "Mic") {
      toggleHostAudio();
    } else if (control === "Vect2") {
      toggleHostVideo();
    }
  };

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
              const avatarSrc = getAvatarForName(participant.name);
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
            <video
              ref={videoRef}
              autoPlay
              muted={user?.id === participants.find((p) => p.name === user?.name)?.id}
              className="absolute top-0 left-0 w-full h-full rounded-xl object-cover"
            />
            <audio autoPlay muted={user?.id === participants.find((p) => p.name === user?.name)?.id}>
              {localStream && <source srcObject={localStream} type="audio/webm" />}
              {participants.map((p) => p.audioStream && (
                <source key={p.id} srcObject={p.audioStream} type="audio/webm" />
              ))}
            </audio>
            {participants.map((p) =>
              p.videoStream && (
                <video
                  key={p.id}
                  autoPlay
                  className="absolute top-0 left-0 w-full h-full rounded-xl object-cover hidden"
                  srcObject={p.videoStream}
                />
              )
            )}
            <div className="absolute top-3 left-3 flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-1 shadow-sm bg-white">
              <div className="relative w-5 h-5 flex items-center justify-center">
                <div className="absolute w-full h-full border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <span className="text-gray-700 text-sm font-medium">
                13:03:34
              </span>
            </div>
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm font-medium">
              {user?.name || "Adam Joseph"}
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
              <button
                className={`flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm ${
                  hostAudio ? "bg-[#1E6132]" : "bg-[#EF4444]"
                }`}
                onClick={() => handleControlClick("Mic")}
              >
                <img
                  src={hostAudio ? mic : MIC}
                  alt={hostAudio ? "mic on" : "mic off"}
                  className="w-5 h-5"
                />
              </button>
              <button
                className={`flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm ${
                  hostVideo ? "bg-[#1E6132]" : "bg-[#EF4444]"
                }`}
                onClick={() => handleControlClick("Vect2")}
              >
                <img src={Vect2} alt="camera" className="w-5 h-5" />
              </button>
              <button
                className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
                onClick={() => handleControlClick("Icon2")}
              >
                <img src={Icon2} alt="control" className="w-5 h-5" />
              </button>
              <button
                className={`flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm ${
                  hostAudio ? "bg-[#1E6132]" : "bg-[#EF4444]"
                }`}
                onClick={() => handleControlClick("Mic")}
              >
                <img
                  src={hostAudio ? mic : MIC}
                  alt={hostAudio ? "mic on" : "mic off"}
                  className="w-5 h-5"
                />
              </button>
              <button
                className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
                onClick={() => handleControlClick("Raise Hand")}
              >
                <img
                  src={hand}
                  alt="raise hand"
                  className={`w-5 h-5 bg-green-700 ${isHandRaised ? "hue-rotate-90" : ""}`}
                />
              </button>
              <button
                className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
                onClick={() => handleControlClick("Record")}
              >
                <img
                  src={recordIcon}
                  alt={isRecording ? "pause recording" : "record"}
                  className={`w-5 h-5 ${
                    isRecording ? "hue-rotate-0" : "hue-rotate-180"
                  }`}
                />
                <span className="text-sm text-gray-700">
                  {isRecording ? "Pause Recording" : "Record"}
                </span>
              </button>
            </div>
            <button className="bg-[#EF4444] text-white py-2 px-4 rounded-lg text-sm font-medium">
              Leave Meeting
            </button>
          </div>
        </div>

        <div className="w-full md:w-80 bg-white p-4 h-full overflow-y-auto">
          <div>
            <div className="flex flex-row items-center space-x-2">
              <h2 className="text-sm font-semibold text-gray-800">
                Participants ({participants.length})
              </h2>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1">
                <button className="text-xs font-semibold">
                  Add Participant
                </button>
                <img src={AddUser} alt="add user" className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-2 py-2 border-b border-gray-200"
                >
                  <img
                    src={getAvatarForName(participant.name)}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div className="flex-1 flex flex-row items-center gap-2">
                    <p className="font-medium text-sm text-gray-800">
                      {participant.name}
                    </p>
                    {participant.isCoHost && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        Co-Host
                      </span>
                    )}
                    {participant.raisedHand && (
                      <img
                        src={hand}
                        alt="hand raised"
                        className="w-4 h-4 hue-rotate-90"
                      />
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
              <h2 className="text-sm font-semibold text-gray-800">
                Chats ({chatMessages.length})
              </h2>
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
                    src={getAvatarForName(msg.name)}
                    alt={msg.name}
                    className="w-9 h-9 rounded-full border-2 border-white mr-2"
                  />
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center space-x-2">
                      <p className="font-medium text-sm text-gray-800">
                        {msg.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="bg-gray-100 p-2 rounded-lg text-sm text-gray-700">
                      {msg.message}
                    </p>
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
                onClick={() => sendChatMessage()}
                disabled={!message.trim() || !user}
                className={`mt-2 w-full py-2 rounded-lg text-sm font-medium ${
                  message.trim() && user
                    ? "bg-[#1E6132] text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Send
              </button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EWeb;


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
// import recordIcon from "../Images/Icon/recordIcon.png";
// import axios from "axios";

// let ws = null;

// const EWeb = () => {
//   const [user, setUser] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [error, setError] = useState(null);
//   const [participants, setParticipants] = useState([]);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [isHandRaised, setIsHandRaised] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [messageQueue, setMessageQueue] = useState([]);
//   const [localStream, setLocalStream] = useState(null);
//   const [hostAudio, setHostAudio] = useState(false); // New state for host microphone
//   const chatContainerRef = useRef(null);
//   const reconnectAttempts = useRef(0);
//   const maxReconnectAttempts = 5;
//   const reconnectDelay = useRef(1000); // Initial delay of 1 second

//   const generateRandomId = (length) => {
//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
//         room: "Ade1253uL",
//         name: "Wale Pung",
//         email: "w.aladebowale@gmail.com",
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
//         setError(
//           response.data?.response?.message || "Failed to retrieve user session"
//         );
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
//     initializeLocalStream();
//   }, []);

//   const sendWSMessage = (subMsg) => {
//     if (ws != null && ws.readyState === WebSocket.OPEN) {
//       ws.send(`[${JSON.stringify(subMsg)}]`);
//       setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subMsg)}`]);
//     }
//   };

//   const initializeLocalStream = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       console.log("Audio available:", stream);
//       setLocalStream(stream);
//       setHostAudio(true); // Enable host audio by default after initialization
//     } catch (err) {
//       setError(`Failed to access microphone: ${err.message}`);
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
//             ? { ...p, audioStream: event.streams[0] }
//             : p
//         )
//       );
//     };

//     if (localStream && hostAudio) {
//       localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
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

//     // Mute or unmute the local audio track
//     localStream.getAudioTracks().forEach((track) => {
//       track.enabled = audioEnabled;
//     });

//     // Update peer connections
//     participants.forEach((p) => {
//       if (p.peerConnection) {
//         p.peerConnection.getSenders().forEach((sender) => {
//           if (sender.track?.kind === "audio") {
//             sender.track.enabled = audioEnabled;
//           }
//         });
//       }
//     });

//     console.log(`Host microphone ${audioEnabled ? "unmuted" : "muted"}`);
//   };

//   const toggleAudio = (id) => {
//     setParticipants((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, hasAudio: !p.hasAudio } : p))
//     );
//   };

//   useEffect(() => {
//     if (!user || !user.meetingID) return;
//     ws = new WebSocket(
//       "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
//     );

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//       setSocket(ws);

//       console.log("meetingID:", user.meetingID);
//       console.log("internalUserID:", user.internalUserID);
//       console.log("authToken:", user.authToken);
//       console.log("externUserID:", user.externUserID);

//       const subMsg1 = `{"msg":"connect","version":"1","support":["1","pre2","pre1"]}`;
//       sendWSMessage(subMsg1);
//       const subMsg2 = `{"msg":"method","id":"1","method":"userChangedLocalSettings","params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,"userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,"userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,"guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,"pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},"audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},"dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}}]}`;
//       sendWSMessage(subMsg2);
//       const subMsg3 = `{"msg":"method","id":"2","method":"validateAuthToken","params":["${user?.meetingID}","${user?.internalUserID}","${user?.authToken}","${user?.externUserID}"]}`;
//       sendWSMessage(subMsg3);
//       const subMsg4 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"auth-token-validation","params":[{"meetingId":"${
//         user?.meetingID
//       }","userId":"${user?.internalUserID}"}]}`;
//       sendWSMessage(subMsg4);
//       const subMsg5 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"current-user","params":[]}`;
//       sendWSMessage(subMsg5);
//       const subMsg6 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users","params":[]}`;
//       sendWSMessage(subMsg6);
//       const subMsg7 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"voiceUsers","params":[]}`;
//       sendWSMessage(subMsg7);
//     const subMsg8 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"polls","params":[]}`;
//       sendWSMessage(subMsg8);
//       const subMsg9 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"presentation","params":[]}`;
//       sendWSMessage(subMsg9);
//       const subMsg10 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"slides","params":[]}`;
//       sendWSMessage(subMsg10);
//       const subMsg11 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"slide-positions","params":[]}`;
//       sendWSMessage(subMsg11);
//       const subMsg12 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"captions","params":[]}`;
//       sendWSMessage(subMsg12);
//       const subMsg13 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"voiceUsers","params":[]}`;
//       sendWSMessage(subMsg13);
//       const subMsg14 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"whiteboard-multi-user","params":[]}`;
//       sendWSMessage(subMsg14);
//       const subMsg15 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"screenshare","params":[]}`;
//       sendWSMessage(subMsg15);
//       const subMsg16 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"group-chat","params":[]}`;
//       sendWSMessage(subMsg16);
//       const subMsg17 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"group-chat-msg","params":[]}`;
//       sendWSMessage(subMsg17);
//       const subMsg18 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"presentation-pods","params":[]}`;
//       sendWSMessage(subMsg18);
//       const subMsg19 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users-settings","params":[]}`;
//       sendWSMessage(subMsg19);
//       const subMsg20 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users-infos","params":[]}`;
//       sendWSMessage(subMsg20);
//       const subMsg21 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"note","params":[]}`;
//       sendWSMessage(subMsg21);
//       const subMsg22 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"meeting-time-remaining","params":[]}`;
//       sendWSMessage(subMsg22);
//       const subMsg23 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"local-settings","params":[]}`;
//       sendWSMessage(subMsg23);
//       const subMsg24 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users-typing","params":[]}`;
//       sendWSMessage(subMsg24);
//       const subMsg25 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"record-meetings","params":[]}`;
//       sendWSMessage(subMsg25);
//       const subMsg26 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"video-streams","params":[]}`;
//       sendWSMessage(subMsg26);
//       const subMsg27 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"connection-status","params":[]}`;
//       sendWSMessage(subMsg27);
//       const subMsg28 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"voice-call-status","params":[]}`;
//       sendWSMessage(subMsg28);
//       const subMsg29 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"external-video-meetings","params":[]}`;
//       sendWSMessage(subMsg29);
//       const subMsg30 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"meetings","params":["MODERATOR"]}`;
//       sendWSMessage(subMsg30);
//       const subMsg31 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users","params":["MODERATOR"]}`;
//       sendWSMessage(subMsg31);
//       const subMsg32 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"breakouts","params":["MODERATOR"]}`;
//       sendWSMessage(subMsg32);
//       const subMsg33 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"guestUsers","params":["MODERATOR"]}`;
//       sendWSMessage(subMsg33);
//       const subMsg34 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"annotations","params":[]}`;
//       sendWSMessage(subMsg34);
//     };

//     ws.onmessage = (event) => {
//       console.log("Raw WebSocket message:", event.data);
//       let data = event.data;

//       if (!data.includes('{')) {
//         console.log("No need to parse");
//         return;
//       }

//       // Correctly parse the incoming data
//       const jsonString = data.substring(3, data.length - 2);
//       console.log("Remove part WebSocket message Tip:", jsonString);
//       data = JSON.parse(jsonString.replaceAll("\\", ""));

//       console.log("Parsed WebSocket message Tip:", data);
//       if (data.msg === "added" && data.collection === "group-chat-msg") {
//         console.log("New chat message received:", data.fields);
//         setChatMessages((prev) => {
//           const newMessage = {
//             name: data.fields.senderName || "Guest",
//             message: data.fields.message,
//             timestamp: new Date(data.fields.timestamp || Date.now()),
//           };
//           const updatedMessages = [...prev, newMessage];
//           console.log("Updated chatMessages:", updatedMessages); 
//           return updatedMessages;
//         });
//       }
//       if (data.msg === "error") {
//         console.log(`No error: ${data.reason}`);
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
//             raisedHand: data.fields.emojiStatus === "raiseHand",
//             peerConnection: createPeerConnection(data.id),
//           },
//         ]);
//       }
//       if (data.msg === "changed" && data.collection === "users") {
//         console.log("User updated:", data.fields);
//         setParticipants((prev) =>
//           prev.map((p) =>
//             p.id === data.id
//               ? { ...p, raisedHand: data.fields.emojiStatus === "raiseHand" }
//               : p
//           )
//         );
//       }
//       if (data.msg === "removed" && data.collection === "users") {
//         console.log("User left:", data.id);
//         setParticipants((prev) => prev.filter((p) => p.id !== data.id));
//       }
      
//       if (chatContainerRef.current) {
//         chatContainerRef.current.scrollTop =
//           chatContainerRef.current.scrollHeight;
//       }
//       if (data.msg === "changed" && data.collection === "record-meetings") {
//         console.log("Recording state updated:", data.fields);
//         setIsRecording(data.fields.recording);
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("WebSocket error occurred:", err);
//       setError(
//         `WebSocket error at ${new Date().toLocaleString("en-US", {
//           timeZone: "Africa/Lagos",
//         })}: ${err.message || "Unknown error"}`
//       );
//     };
//     ws.onclose = (event) => {
//       console.log("WebSocket disconnected:", event.code, event.reason);
//       if (event.code !== 1006) {
//         setError(
//           `WebSocket closed at ${new Date().toLocaleString("en-US", {
//             timeZone: "Africa/Lagos",
//           })}: Code ${event.code}, Reason: ${event.reason}`
//         );
//       }
//       setSocket(null);
//     };
//     return () => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//       if (localStream) {
//         localStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [user]);

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

//     const subCMsg = `{"msg":"method","id":"292","method":"sendGroupChatMsg","params":["MAIN-PUBLIC-GROUP-CHAT",{"correlationId":"w_73iggoe29s2z-1748036833279","sender":{"id":"w_73iggoe29s2z","name":"","role":""},"chatEmphasizedText":true,"message":"${message.trim()}"}]}`
//     sendWSMessage(subCMsg);

//     if (socket && socket.readyState === WebSocket.OPEN) {
//       try {
//         console.log("WebSocket readyState:", socket.readyState);
//         console.log("Attempting to send message:", subCMsg);
//         socket.send(`[${JSON.stringify(subCMsg)}]`);
//         setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subCMsg)}`]);
//         console.log("Chat message sent successfully");
//       } catch (err) {
//         console.error("Failed to send chat message:", err);
//         setError(`Failed to send chat message: ${err.message}`);
//       }
//     } else {
//       console.warn(
//         "WebSocket not connected or not authenticated, queuing message. readyState:",
//         socket?.readyState,
//         "Authenticated:"
//       );
//       setMessageQueue((prev) => [...prev, subCMsg]);
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
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   };
// //   const sendMessageFromOtherUser = () => {
// //     const otherUser = participants.find(
// //       (p) => p.name !== (user?.name || "Guest")
// //     ) || {
// //       name: "Kathryn Murphy",
// //     };
// //     const simulatedMessage = {
// //       msg: "added",
// //       collection: "group-chat-msg",
// //       id: generateRandomId(17),
// //       fields: {
// //         sender: { name: otherUser.name },
// //         message: "Testing from another user!",
// //         timestamp: Date.now(),
// //       },
// //     };

// //     console.log("Simulating message from another user:", simulatedMessage);
// //     setResponses((prev) => [
// //       ...prev,
// //       `Simulated: ${JSON.stringify(simulatedMessage)}`,
// //     ]);
// //     setChatMessages((prev) => [
// //       ...prev,
// //       {
// //         name: simulatedMessage.fields.sender.name,
// //         message: simulatedMessage.fields.message,
// //         timestamp: new Date(simulatedMessage.fields.timestamp),
// //       },
// //     ]);
// //     if (chatContainerRef.current) {
// //       chatContainerRef.current.scrollTop =
// //         chatContainerRef.current.scrollHeight;
// //     }
// //   };
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
//         try {
//           socket.send(`[${JSON.stringify(raiseHandMessage)}]`);
//           setResponses((prev) => [
//             ...prev,
//             `Sent: ${JSON.stringify(raiseHandMessage)}`,
//           ]);
//           console.log("Raise hand message sent successfully");
//         } catch (err) {
//           console.error("Failed to send raise hand message:", err);
//           setError(`Failed to send raise hand message: ${err.message}`);
//         }
//       } else {
//         console.warn("WebSocket not connected, hand raise updated locally only");
//       }
//     } else if (control === "Record") {
//       const newRecordingState = !isRecording;
//       setIsRecording(newRecordingState);

//       if (socket && socket.readyState === WebSocket.OPEN) {
//         const toggleRecordingMessage = `{"msg":"method","id":"10005","method":"toggleRecording","params":[]}`;
//         sendWSMessage(toggleRecordingMessage);
//         try {
//           socket.send(`[${JSON.stringify(toggleRecordingMessage)}]`);
//           setResponses((prev) => [
//             ...prev,
//             `Sent: ${JSON.stringify(toggleRecordingMessage)}`,
//           ]);
//           console.log("Toggle recording message sent successfully");
//         } catch (err) {
//           console.error("Failed to send toggle recording message:", err);
//           setError(`Failed to send toggle recording message: ${err.message}`);
//         }
//       } else {
//         console.warn("WebSocket not connected, recording state updated locally only");
//       }
//     } else if (control === "Mic") {
//       toggleHostAudio(); // Use the existing toggleHostAudio function
//     }
//   };
// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       sendMessageFromOtherUser();
// //     }, 5000);
// //     return () => clearTimeout(timer);
// //   }, [user]);
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
//             <audio autoPlay muted={user?.id === participants.find((p) => p.name === user?.name)?.id}>
//               {localStream && <source srcObject={localStream} type="audio/webm" />}
//               {participants.map((p) => p.audioStream && (
//                 <source key={p.id} srcObject={p.audioStream} type="audio/webm" />
//               ))}
//             </audio>
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
//               <span className="text-gray-700 text-sm font-medium">
//                 13:03:34
//               </span>
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
//                 className={`flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm ${
//                   hostAudio ? "bg-[#1E6132]" : "bg-[#EF4444]"
//                 }`}
//                 onClick={() => handleControlClick("Mic")}
//               >
//                 <img
//                   src={hostAudio ? mic : MIC}
//                   alt={hostAudio ? "mic on" : "mic off"}
//                   className="w-5 h-5"
//                 />
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
//                 className={`flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm ${
//                   hostAudio ? "bg-[#1E6132]" : "bg-[#EF4444]"
//                 }`}
//                 onClick={() => handleControlClick("Mic")}
//               >
//                 <img
//                   src={hostAudio ? mic : MIC}
//                   alt={hostAudio ? "mic on" : "mic off"}
//                   className="w-5 h-5"
//                 />
//               </button>
//               <button
//                 className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
//                 onClick={() => handleControlClick("Raise Hand")}
//               >
//                 <img
//                   src={hand}
//                   alt="raise hand"
//                   className={`w-5 h-5 bg-green-700 ${isHandRaised ? "hue-rotate-90" : ""}`}
//                 />
//               </button>
//               <button
//                 className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
//                 onClick={() => handleControlClick("Record")}
//               >
//                 <img
//                   src={recordIcon}
//                   alt={isRecording ? "pause recording" : "record"}
//                   className={`w-5 h-5 ${
//                     isRecording ? "hue-rotate-0" : "hue-rotate-180"
//                   }`}
//                 />
//                 <span className="text-sm text-gray-700">
//                   {isRecording ? "Pause Recording" : "Record"}
//                 </span>
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
//               <h2 className="text-sm font-semibold text-gray-800">
//                 Participants ({participants.length})
//               </h2>
//               <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1">
//                 <button className="text-xs font-semibold">
//                   Add Participant
//                 </button>
//                 <img src={AddUser} alt="add user" className="w-3 h-3" />
//               </div>
//             </div>
//             <div className="mt-4 space-y-2">
//               {participants.map((participant) => (
//                 <div
//                   key={participant.id}
//                   className="flex items-center gap-2 py-2 border-b border-gray-200"
//                 >
//                   <img
//                     src={getAvatarForName(participant.name)}
//                     alt={participant.name}
//                     className="w-10 h-10 rounded-full border-2 border-white"
//                   />
//                   <div className="flex-1 flex flex-row items-center gap-2">
//                     <p className="font-medium text-sm text-gray-800">
//                       {participant.name}
//                     </p>
//                     {participant.isCoHost && (
//                       <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
//                         Co-Host
//                       </span>
//                     )}
//                     {participant.raisedHand && (
//                       <img
//                         src={hand}
//                         alt="hand raised"
//                         className="w-4 h-4 hue-rotate-90"
//                       />
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
//               <h2 className="text-sm font-semibold text-gray-800">
//                 Chats ({chatMessages.length})
//               </h2>
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
//                       <p className="font-medium text-sm text-gray-800">
//                         {msg.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(msg.timestamp).toLocaleTimeString()}
//                       </p>
//                     </div>
//                     <p className="bg-gray-100 p-2 rounded-lg text-sm text-gray-700">
//                       {msg.message}
//                     </p>
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
//                 onClick={() => sendChatMessage()}
//                 disabled={!message.trim() || !user}
//                 className={`mt-2 w-full py-2 rounded-lg text-sm font-medium ${
//                   message.trim() && user
//                     ? "bg-[#1E6132] text-white"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 Send
//               </button>
//               {/* <button
//                 onClick={sendMessageFromOtherUser}
//                 className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium"
//               >
//                 Simulate Other User Message
//               </button> */}
//               {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default EWeb;
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
// import recordIcon from "../Images/Icon/recordIcon.png";
// import axios from "axios";

// let ws = null;

// const EWeb = () => {
//   const [user, setUser] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [error, setError] = useState(null);
//   const [participants, setParticipants] = useState([]);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [isHandRaised, setIsHandRaised] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [messageQueue, setMessageQueue] = useState([]);
//   const [localStream, setLocalStream] = useState(null);
//   const [hostAudio, setHostAudio] = useState(false); // New state for host microphone
//   const chatContainerRef = useRef(null);
//   const reconnectAttempts = useRef(0);
//   const maxReconnectAttempts = 5;
//   const reconnectDelay = useRef(1000); // Initial delay of 1 second

//   const generateRandomId = (length) => {
//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
//         room: "Ade1253uL",
//         name: "Lukman Chung",
//         email: "dchung.aladebowale@gmail.com",
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
//         setError(
//           response.data?.response?.message || "Failed to retrieve user session"
//         );
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
//     initializeLocalStream();
//   }, []);

//   const sendWSMessage = (subMsg) => {
//     if (ws != null && ws.readyState === WebSocket.OPEN) {
//       ws.send(`[${JSON.stringify(subMsg)}]`);
//       setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subMsg)}`]);
//     }
//   };

//   const initializeLocalStream = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       console.log("Audio available:", stream);
//       setLocalStream(stream);
//       setHostAudio(true); // Enable host audio by default after initialization
//     } catch (err) {
//       setError(`Failed to access microphone: ${err.message}`);
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
//             ? { ...p, audioStream: event.streams[0] }
//             : p
//         )
//       );
//     };

//     if (localStream && hostAudio) {
//       localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
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

//     // Mute or unmute the local audio track
//     localStream.getAudioTracks().forEach((track) => {
//       track.enabled = audioEnabled;
//     });

//     // Update peer connections
//     participants.forEach((p) => {
//       if (p.peerConnection) {
//         p.peerConnection.getSenders().forEach((sender) => {
//           if (sender.track?.kind === "audio") {
//             sender.track.enabled = audioEnabled;
//           }
//         });
//       }
//     });

//     console.log(`Host microphone ${audioEnabled ? "unmuted" : "muted"}`);
//   };

//   const toggleAudio = (id) => {
//     setParticipants((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, hasAudio: !p.hasAudio } : p))
//     );
//   };

//   useEffect(() => {
//     if (!user || !user.meetingID) return;
//     ws = new WebSocket(
//       "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
//     );

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//       setSocket(ws);

//       console.log("meetingID:", user.meetingID);
//       console.log("internalUserID:", user.internalUserID);
//       console.log("authToken:", user.authToken);
//       console.log("externUserID:", user.externUserID);

//       const subMsg1 = `{"msg":"connect","version":"1","support":["1","pre2","pre1"]}`;
//       sendWSMessage(subMsg1);
//       const subMsg2 = `{"msg":"method","id":"1","method":"userChangedLocalSettings","params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,"userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,"userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,"guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,"pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},"audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},"dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}}]}`;
//       sendWSMessage(subMsg2);
//       const subMsg3 = `{"msg":"method","id":"2","method":"validateAuthToken","params":["${user?.meetingID}","${user?.internalUserID}","${user?.authToken}","${user?.externUserID}"]}`;
//       sendWSMessage(subMsg3);
//       const subMsg4 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"auth-token-validation","params":[{"meetingId":"${
//         user?.meetingID
//       }","userId":"${user?.internalUserID}"}]}`;
//       sendWSMessage(subMsg4);
//       const subMsg5 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"current-user","params":[]}`;
//       sendWSMessage(subMsg5);
//       const subMsg6 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users","params":[]}`;
//       sendWSMessage(subMsg6);
//       const subMsg7 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"voiceUsers","params":[]}`;
//       sendWSMessage(subMsg7);
//     };

//     ws.onmessage = (event) => {
//       console.log("Raw WebSocket message:", event.data);
//       let data = event.data;

//       if (!data.includes('{')) {
//         console.log("No need to parse");
//         return;
//       }

//       // Correctly parse the incoming data
//       const jsonString = data.substring(3, data.length - 2);
//       console.log("Remove part WebSocket message Tip:", jsonString);
//       data = JSON.parse(jsonString.replaceAll("\\", ""));

//       console.log("Parsed WebSocket message Tip:", data);
//       if (data.msg === "added" && data.collection === "group-chat-msg") {
//         console.log("New chat message received:", data.fields);
//         setChatMessages((prev) => {
//           const newMessage = {
//             name: data.fields.senderName || "Guest",
//             message: data.fields.message,
//             timestamp: new Date(data.fields.timestamp || Date.now()),
//           };
//           const updatedMessages = [...prev, newMessage];
//           console.log("Updated chatMessages:", updatedMessages); 
//           return updatedMessages;
//         });
//       }
//       if (data.msg === "error") {
//         console.log(`No error: ${data.reason}`);
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
//             raisedHand: data.fields.emojiStatus === "raiseHand",
//             peerConnection: createPeerConnection(data.id),
//           },
//         ]);
//       }
//       if (data.msg === "changed" && data.collection === "users") {
//         console.log("User updated:", data.fields);
//         setParticipants((prev) =>
//           prev.map((p) =>
//             p.id === data.id
//               ? { ...p, raisedHand: data.fields.emojiStatus === "raiseHand" }
//               : p
//           )
//         );
//       }
//       if (data.msg === "removed" && data.collection === "users") {
//         console.log("User left:", data.id);
//         setParticipants((prev) => prev.filter((p) => p.id !== data.id));
//       }
      
//       if (chatContainerRef.current) {
//         chatContainerRef.current.scrollTop =
//           chatContainerRef.current.scrollHeight;
//       }
//       if (data.msg === "changed" && data.collection === "record-meetings") {
//         console.log("Recording state updated:", data.fields);
//         setIsRecording(data.fields.recording);
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("WebSocket error occurred:", err);
//       setError(
//         `WebSocket error at ${new Date().toLocaleString("en-US", {
//           timeZone: "Africa/Lagos",
//         })}: ${err.message || "Unknown error"}`
//       );
//     };
//     ws.onclose = (event) => {
//       console.log("WebSocket disconnected:", event.code, event.reason);
//       if (event.code !== 1006) {
//         setError(
//           `WebSocket closed at ${new Date().toLocaleString("en-US", {
//             timeZone: "Africa/Lagos",
//           })}: Code ${event.code}, Reason: ${event.reason}`
//         );
//       }
//       setSocket(null);
//     };
//     return () => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//       if (localStream) {
//         localStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [user]);

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

//     const subCMsg = `{"msg":"method","id":"292","method":"sendGroupChatMsg","params":["MAIN-PUBLIC-GROUP-CHAT",{"correlationId":"w_73iggoe29s2z-1748036833279","sender":{"id":"w_73iggoe29s2z","name":"","role":""},"chatEmphasizedText":true,"message":"${message.trim()}"}]}`
//     sendWSMessage(subCMsg);

//     if (socket && socket.readyState === WebSocket.OPEN) {
//       try {
//         console.log("WebSocket readyState:", socket.readyState);
//         console.log("Attempting to send message:", subCMsg);
//         socket.send(`[${JSON.stringify(subCMsg)}]`);
//         setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subCMsg)}`]);
//         console.log("Chat message sent successfully");
//       } catch (err) {
//         console.error("Failed to send chat message:", err);
//         setError(`Failed to send chat message: ${err.message}`);
//       }
//     } else {
//       console.warn(
//         "WebSocket not connected or not authenticated, queuing message. readyState:",
//         socket?.readyState,
//         "Authenticated:"
//       );
//       setMessageQueue((prev) => [...prev, subCMsg]);
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
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   };
//   const sendMessageFromOtherUser = () => {
//     const otherUser = participants.find(
//       (p) => p.name !== (user?.name || "Guest")
//     ) || {
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
//     setResponses((prev) => [
//       ...prev,
//       `Simulated: ${JSON.stringify(simulatedMessage)}`,
//     ]);
//     setChatMessages((prev) => [
//       ...prev,
//       {
//         name: simulatedMessage.fields.sender.name,
//         message: simulatedMessage.fields.message,
//         timestamp: new Date(simulatedMessage.fields.timestamp),
//       },
//     ]);
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
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
//         try {
//           socket.send(`[${JSON.stringify(raiseHandMessage)}]`);
//           setResponses((prev) => [
//             ...prev,
//             `Sent: ${JSON.stringify(raiseHandMessage)}`,
//           ]);
//           console.log("Raise hand message sent successfully");
//         } catch (err) {
//           console.error("Failed to send raise hand message:", err);
//           setError(`Failed to send raise hand message: ${err.message}`);
//         }
//       } else {
//         console.warn("WebSocket not connected, hand raise updated locally only");
//       }
//     } else if (control === "Record") {
//       const newRecordingState = !isRecording;
//       setIsRecording(newRecordingState);

//       if (socket && socket.readyState === WebSocket.OPEN) {
//         const toggleRecordingMessage = `{"msg":"method","id":"10005","method":"toggleRecording","params":[]}`;
//         sendWSMessage(toggleRecordingMessage);
//         try {
//           socket.send(`[${JSON.stringify(toggleRecordingMessage)}]`);
//           setResponses((prev) => [
//             ...prev,
//             `Sent: ${JSON.stringify(toggleRecordingMessage)}`,
//           ]);
//           console.log("Toggle recording message sent successfully");
//         } catch (err) {
//           console.error("Failed to send toggle recording message:", err);
//           setError(`Failed to send toggle recording message: ${err.message}`);
//         }
//       } else {
//         console.warn("WebSocket not connected, recording state updated locally only");
//       }
//     } else if (control === "Mic") {
//       toggleHostAudio(); // Use the existing toggleHostAudio function
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
//             <audio autoPlay muted={user?.id === participants.find((p) => p.name === user?.name)?.id}>
//               {localStream && <source srcObject={localStream} type="audio/webm" />}
//               {participants.map((p) => p.audioStream && (
//                 <source key={p.id} srcObject={p.audioStream} type="audio/webm" />
//               ))}
//             </audio>
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
//               <span className="text-gray-700 text-sm font-medium">
//                 13:03:34
//               </span>
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
//                 className={`flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm ${
//                   hostAudio ? "bg-[#1E6132]" : "bg-[#EF4444]"
//                 }`}
//                 onClick={() => handleControlClick("Mic")}
//               >
//                 <img
//                   src={hostAudio ? mic : MIC}
//                   alt={hostAudio ? "mic on" : "mic off"}
//                   className="w-5 h-5"
//                 />
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
//                 className={`flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm ${
//                   hostAudio ? "bg-[#1E6132]" : "bg-[#EF4444]"
//                 }`}
//                 onClick={() => handleControlClick("Mic")}
//               >
//                 <img
//                   src={hostAudio ? mic : MIC}
//                   alt={hostAudio ? "mic on" : "mic off"}
//                   className="w-5 h-5"
//                 />
//               </button>
//               <button
//                 className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
//                 onClick={() => handleControlClick("Raise Hand")}
//               >
//                 <img
//                   src={hand}
//                   alt="raise hand"
//                   className={`w-5 h-5 bg-green-700 ${isHandRaised ? "hue-rotate-90" : ""}`}
//                 />
//               </button>
//               <button
//                 className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
//                 onClick={() => handleControlClick("Record")}
//               >
//                 <img
//                   src={recordIcon}
//                   alt={isRecording ? "pause recording" : "record"}
//                   className={`w-5 h-5 ${
//                     isRecording ? "hue-rotate-0" : "hue-rotate-180"
//                   }`}
//                 />
//                 <span className="text-sm text-gray-700">
//                   {isRecording ? "Pause Recording" : "Record"}
//                 </span>
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
//               <h2 className="text-sm font-semibold text-gray-800">
//                 Participants ({participants.length})
//               </h2>
//               <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1">
//                 <button className="text-xs font-semibold">
//                   Add Participant
//                 </button>
//                 <img src={AddUser} alt="add user" className="w-3 h-3" />
//               </div>
//             </div>
//             <div className="mt-4 space-y-2">
//               {participants.map((participant) => (
//                 <div
//                   key={participant.id}
//                   className="flex items-center gap-2 py-2 border-b border-gray-200"
//                 >
//                   <img
//                     src={getAvatarForName(participant.name)}
//                     alt={participant.name}
//                     className="w-10 h-10 rounded-full border-2 border-white"
//                   />
//                   <div className="flex-1 flex flex-row items-center gap-2">
//                     <p className="font-medium text-sm text-gray-800">
//                       {participant.name}
//                     </p>
//                     {participant.isCoHost && (
//                       <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
//                         Co-Host
//                       </span>
//                     )}
//                     {participant.raisedHand && (
//                       <img
//                         src={hand}
//                         alt="hand raised"
//                         className="w-4 h-4 hue-rotate-90"
//                       />
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
//               <h2 className="text-sm font-semibold text-gray-800">
//                 Chats ({chatMessages.length})
//               </h2>
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
//                       <p className="font-medium text-sm text-gray-800">
//                         {msg.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(msg.timestamp).toLocaleTimeString()}
//                       </p>
//                     </div>
//                     <p className="bg-gray-100 p-2 rounded-lg text-sm text-gray-700">
//                       {msg.message}
//                     </p>
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
//                 onClick={() => sendChatMessage()}
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
// export default EWeb;


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
// import recordIcon from "../Images/Icon/recordIcon.png";
// import axios from "axios";


//     var ws = null;

// const VWeb = () => {
//   const [user, setUser] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [error, setError] = useState(null);
//   const [participants, setParticipants] = useState([
//     {
//       id: "1",
//       name: "Cassie Jung",
//       hasAudio: false,
//       hasVideo: false,
//       raisedHand: false,
//     },
//     {
//       id: "2",
//       name: "Alice Wong",
//       hasAudio: true,
//       hasVideo: false,
//       raisedHand: false,
//     },
//     {
//       id: "3",
//       name: "Theresa Webb",
//       hasAudio: true,
//       hasVideo: false,
//       raisedHand: false,
//     },
//     {
//       id: "4",
//       name: "Christian Wong",
//       hasAudio: false,
//       hasVideo: false,
//       raisedHand: false,
//     },
//   ]);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [isHandRaised, setIsHandRaised] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [messageQueue, setMessageQueue] = useState([]);
//   const chatContainerRef = useRef(null);
//   const reconnectAttempts = useRef(0);
//   const maxReconnectAttempts = 5;
//   const reconnectDelay = useRef(1000); // Initial delay of 1 second


//   const generateRandomId = (length) => {
//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
//         room: "Ade1253uL",
//         name: "Lukman Chung",
//         email: "dchung.aladebowale@gmail.com",
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
//         setError(
//           response.data?.response?.message || "Failed to retrieve user session"
//         );
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


//   const sendWSMessage=(subMsg) =>{
//      if (ws != null && ws.readyState === WebSocket.OPEN) {
//         ws.send(`[${JSON.stringify(subMsg)}]`);
//         setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subMsg)}`]);
//      }
//   }

//   useEffect(() => {
//     if (!user || !user.meetingID) return;
//   ws = new WebSocket(
//     "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
//   );

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//       setSocket(ws);

//       console.log("meetingID:", user.meetingID);
//       console.log("internalUserID:", user.internalUserID);
//       console.log("authToken:", user.authToken);
//       console.log("externUserID:", user.externUserID);

//       const subMsg1 = `{"msg":"connect","version":"1","support":["1","pre2","pre1"]}`;
//       sendWSMessage(subMsg1);
//       const subMsg2 = `{"msg":"method","id":"1","method":"userChangedLocalSettings","params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,"userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,"userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,"guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,"pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},"audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},"dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}}]}`;
//       sendWSMessage(subMsg2);
//       const subMsg3 = `{"msg":"method","id":"2","method":"validateAuthToken","params":["${user?.meetingID}","${user?.internalUserID}","${user?.authToken}","${user?.externUserID}"]}`;
//       sendWSMessage(subMsg3);
//       const subMsg4 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"auth-token-validation","params":[{"meetingId":"${
//         user?.meetingID
//       }","userId":"${user?.internalUserID}"}]}`;
//       sendWSMessage(subMsg4);
//       const subMsg5 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"current-user","params":[]}`;
//       sendWSMessage(subMsg5);
//       const subMsg6 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users","params":[]}`;
//       sendWSMessage(subMsg6);
//       const subMsg7 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"meetings","params":[]}`;
//       sendWSMessage(subMsg7);
//       const subMsg8 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"polls","params":[]}`;
//       sendWSMessage(subMsg8);
//       const subMsg9 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"presentation","params":[]}`;
//       sendWSMessage(subMsg9);
//       const subMsg10 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"slides","params":[]}`;
//       sendWSMessage(subMsg10);
//       const subMsg11 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"slide-positions","params":[]}`;
//       sendWSMessage(subMsg11);
//       const subMsg12 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"captions","params":[]}`;
//       sendWSMessage(subMsg12);
//       const subMsg13 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"voiceUsers","params":[]}`;
//       sendWSMessage(subMsg13);
//       const subMsg14 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"whiteboard-multi-user","params":[]}`;
//       sendWSMessage(subMsg14);
//       const subMsg15 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"screenshare","params":[]}`;
//       sendWSMessage(subMsg15);
//       const subMsg16 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"group-chat","params":[]}`;
//       sendWSMessage(subMsg16);
//       const subMsg17 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"group-chat-msg","params":[]}`;
//       sendWSMessage(subMsg17);
//       const subMsg18 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"presentation-pods","params":[]}`;
//       sendWSMessage(subMsg18);
//       const subMsg19 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users-settings","params":[]}`;
//       sendWSMessage(subMsg19);
//       const subMsg20 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users-infos","params":[]}`;
//       sendWSMessage(subMsg20);
//       const subMsg21 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"note","params":[]}`;
//       sendWSMessage(subMsg21);
//       const subMsg22 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"meeting-time-remaining","params":[]}`;
//       sendWSMessage(subMsg22);
//       const subMsg23 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"local-settings","params":[]}`;
//       sendWSMessage(subMsg23);
//       const subMsg24 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users-typing","params":[]}`;
//       sendWSMessage(subMsg24);
//       const subMsg25 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"record-meetings","params":[]}`;
//       sendWSMessage(subMsg25);
//       const subMsg26 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"video-streams","params":[]}`;
//       sendWSMessage(subMsg26);
//       const subMsg27 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"connection-status","params":[]}`;
//       sendWSMessage(subMsg27);
//       const subMsg28 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"voice-call-status","params":[]}`;
//       sendWSMessage(subMsg28);
//       const subMsg29 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"external-video-meetings","params":[]}`;
//       sendWSMessage(subMsg29);
//       const subMsg30 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"meetings","params":["MODERATOR"]}`;
//       sendWSMessage(subMsg30);
//       const subMsg31 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users","params":["MODERATOR"]}`;
//       sendWSMessage(subMsg31);
//       const subMsg32 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"breakouts","params":["MODERATOR"]}`;
//       sendWSMessage(subMsg32);
//       const subMsg33 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"guestUsers","params":["MODERATOR"]}`;
//       sendWSMessage(subMsg33);
//       const subMsg34 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"annotations","params":[]}`;
//       sendWSMessage(subMsg34);
//     };
 
//     ws.onmessage = (event) => {
//       console.log("Raw WebSocket message:", event.data);
//       let data = event.data;

//       console.log("Parsed WebSocket message TIP:", data);
//       // setResponses((prev) => [...prev, `Received: ${JSON.stringify(data[0])}`]);
//       // if (data.msg === "added" && data.collection === "group-chat-msg") {
//       //   console.log("New chat message received:", data.fields);
//       //   setChatMessages((prev) => {
//       //     const newMessage = {
//       //       name: data.fields.sender.name || "Guest",
//       //       message: data.fields.message,
//       //       timestamp: new Date(data.fields.timestamp || Date.now()),
//       //     };
//       //     const updatedMessages = [...prev, newMessage];
//       //     console.log("Updated chatMessages:", updatedMessages); 
//       //     return updatedMessages;
//       //   });
//       const jsonMatch = data.match(/\["(.*)"\]/);
//       if (jsonMatch && jsonMatch[1]) {
//         try {
//           const parsedData = JSON.parse(jsonMatch[1]);
//           console.log("Parsed WebSocket message:", parsedData);
//           setResponses((prev) => [...prev, `Received: ${JSON.stringify(parsedData)}`]);

//           if (parsedData.msg === "added" && parsedData.collection === "group-chat-msg") {
//             console.log("New chat message received:", parsedData.fields);
//             setChatMessages((prev) => {
//               const newMessage = {
//                 name: parsedData.fields.senderName || "Guest", // Use senderName as per previous fix
//                 message: parsedData.fields.message,
//                 timestamp: new Date(parsedData.fields.timestamp || Date.now()),
//               };
//               const updatedMessages = [...prev, newMessage];
//               console.log("Updated chatMessages:", updatedMessages);
//               return updatedMessages;
//             });
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
//             raisedHand: data.fields.emojiStatus === "raiseHand",
//           },
//         ]);
//       }
//       if (data.msg === "changed" && data.collection === "users") {
//         console.log("User updated:", data.fields);
//         setParticipants((prev) =>
//           prev.map((p) =>
//             p.id === data.id
//               ? { ...p, raisedHand: data.fields.emojiStatus === "raiseHand" }
//               : p
//           )
//         );
//       }
//       if (data.msg === "removed" && data.collection === "users") {
//         console.log("User left:", data.id);
//         setParticipants((prev) => prev.filter((p) => p.id !== data.id));
//       }
      
//         if (chatContainerRef.current) {
//           chatContainerRef.current.scrollTop =
//             chatContainerRef.current.scrollHeight;
//         }
//       }
//       if (data.msg === "changed" && data.collection === "record-meetings") {
//         console.log("Recording state updated:", data.fields);
//         setIsRecording(data.fields.recording);
//       }
//     };


//     ws.onerror = (err) => {
//       console.error("WebSocket error occurred:", err);
//       setError(
//         `WebSocket error at ${new Date().toLocaleString("en-US", {
//           timeZone: "Africa/Lagos",
//         })}: ${err.message || "Unknown error"}`
//       );
//     };
//     ws.onclose = (event) => {
//       console.log("WebSocket disconnected:", event.code, event.reason);
//       if (event.code !== 1006) {
//         setError(
//           `WebSocket closed at ${new Date().toLocaleString("en-US", {
//             timeZone: "Africa/Lagos",
//           })}: Code ${event.code}, Reason: ${event.reason}`
//         );
//       }
//       setSocket(null);
//       // if (reconnectAttempts.current < maxReconnectAttempts) {
//       //   reconnectAttempts.current += 1;
//       //   reconnectDelay.current = Math.min(reconnectDelay.current * 2, 10000); // Exponential backoff up to 10s
//       //   console.log(`Reconnecting in ${reconnectDelay.current}ms (Attempt ${reconnectAttempts.current}/${maxReconnectAttempts})...`);
//       //   setTimeout(connectWebSocket, reconnectDelay.current);
//       // } else {
//       //   console.log("Max reconnect attempts reached. WebSocket connection failed.");
//       // }
//     };
//     return () => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//     };
//     // };
//     // connectWebSocket();
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

//     // ws.send('["{\"msg\":\"method\",\"id\":\"292\",\"method\":\"sendGroupChatMsg\",\"params\":[\"MAIN-PUBLIC-GROUP-CHAT\",{\"correlationId\":\"w_73iggoe29s2z-1748036833279\",\"sender\":{\"id\":\"w_73iggoe29s2z\",\"name\":\"\",\"role\":\"\"},\"chatEmphasizedText\":true,\"message\":\"Hello\"}]}"]');
    
//     const subCMsg = `{"msg":"method","id":"292","method":"sendGroupChatMsg","params":["MAIN-PUBLIC-GROUP-CHAT",{"correlationId":"w_73iggoe29s2z-1748036833279","sender":{"id":"w_73iggoe29s2z","name":"","role":""},"chatEmphasizedText":true,"message":"${message.trim()}"}]}`
//                  // `{"msg":"method","id":"350","method":"sendGroupChatMsg","params":[{"MAIN-PUBLIC-GROUP-CHAT",{"correlationId": "${user?.internalUserID}-${Date.now()}","sender": {"id": "${user?.internalUserID}","name": "", "role": ""},"chatEmphasizedText": true,"message": "${message.trim()}"}]}`;
//     sendWSMessage(subCMsg);

//     if (socket && socket.readyState === WebSocket.OPEN) {
//       try {
//         console.log("WebSocket readyState:", socket.readyState);
//         console.log("Attempting to send message:", subCMsg);
//         socket.send(`[${JSON.stringify(subCMsg)}]`);
//         setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subCMsg)}`]);
//         console.log("Chat message sent successfully");
//       } catch (err) {
//         console.error("Failed to send chat message:", err);
//         setError(`Failed to send chat message: ${err.message}`);
//       }
//     } else {
//       console.warn(
//         "WebSocket not connected or not authenticated, queuing message. readyState:",
//         socket?.readyState,
//         "Authenticated:"
//       );
//       setMessageQueue((prev) => [...prev, subCMsg]);
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
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   };
//   const sendMessageFromOtherUser = () => {
//     const otherUser = participants.find(
//       (p) => p.name !== (user?.name || "Guest")
//     ) || {
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
//     setResponses((prev) => [
//       ...prev,
//       `Simulated: ${JSON.stringify(simulatedMessage)}`,
//     ]);
//     setChatMessages((prev) => [
//       ...prev,
//       {
//         name: simulatedMessage.fields.sender.name,
//         message: simulatedMessage.fields.message,
//         timestamp: new Date(simulatedMessage.fields.timestamp),
//       },
//     ]);
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   };
//   const handleControlClick = (control) => {
//     // console.log(
//     //   `Clicked ${control} button at ${new Date().toLocaleString("en-US", {
//     //     timeZone: "Africa/Lagos",
//     //   })}`
//     // );
//     if (control === "Raise Hand") {
//       const newHandRaisedState = !isHandRaised;
//       setIsHandRaised(newHandRaisedState);

//       setParticipants((prev) =>
//         prev.map((p) =>
//           p.name === user?.name ? { ...p, raisedHand: newHandRaisedState } : p
//         )
//       );

//       if (socket && socket.readyState === WebSocket.OPEN) {
       

//         const raiseHandMessage = `{"msg":"method","id":"1003","method":"setEmojiStatus","params":["gF_73iggoe29s2z-1748036833999","raiseHand"]}`
//         sendWSMessage(raiseHandMessage);
//         try {
//           socket.send(`[${JSON.stringify(raiseHandMessage)}]`);
//           setResponses((prev) => [
//             ...prev,
//             `Sent: ${JSON.stringify(raiseHandMessage)}`,
//           ]);
//           console.log("Raise hand message sent successfully");
//         } catch (err) {
//           console.error("Failed to send raise hand message:", err);
//           setError(`Failed to send raise hand message: ${err.message}`);
//         }
//       } else {
//         console.warn(
//           "WebSocket not connected, hand raise updated locally only"
//         );
//       }
//     } else if (control === "Record") {
//       const newRecordingState = !isRecording;
//       setIsRecording(newRecordingState);

//       if (socket && socket.readyState === WebSocket.OPEN) {
//         const toggleRecordingMessage = `{"msg":"method","id":"10005","method":"toggleRecording","params":[]}`
//         sendWSMessage(toggleRecordingMessage)
//         try {
//           socket.send(`[${JSON.stringify(toggleRecordingMessage)}]`);
//           setResponses((prev) => [
//             ...prev,
//             `Sent: ${JSON.stringify(toggleRecordingMessage)}`,
//           ]);
//           console.log("Toggle recording message sent successfully");
//         } catch (err) {
//           console.error("Failed to send toggle recording message:", err);
//           setError(`Failed to send toggle recording message: ${err.message}`);
//         }
//       } else {
//         console.warn(
//           "WebSocket not connected, recording state updated locally only"
//         );
//       }
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
//               <span className="text-gray-700 text-sm font-medium">
//                 13:03:34
//               </span>
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
//                 <img
//                   src={hand}
//                   alt="raise hand"
//                   className={`w-5 h-5 bg-green-700 ${isHandRaised ? "hue-rotate-90" : ""}`}
//                 />
//               </button>
//               <button
//                 className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
//                 onClick={() => handleControlClick("Record")}
//               >
//                 <img
//                   src={recordIcon}
//                   alt={isRecording ? "pause recording" : "record"}
//                   className={`w-5 h-5 ${
//                     isRecording ? "hue-rotate-0" : "hue-rotate-180"
//                   }`}
//                 />
//                 <span className="text-sm text-gray-700">
//                   {isRecording ? "Pause Recording" : "Record"}
//                 </span>
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
//               <h2 className="text-sm font-semibold text-gray-800">
//                 Participants ({participants.length})
//               </h2>
//               <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1">
//                 <button className="text-xs font-semibold">
//                   Add Participant
//                 </button>
//                 <img src={AddUser} alt="add user" className="w-3 h-3" />
//               </div>
//             </div>
//             <div className="mt-4 space-y-2">
//               {[
//                 {
//                   id: "5",
//                   name: "Dianne Russell",
//                   isCoHost: true,
//                   hasAudio: true,
//                   hasVideo: false,
//                   raisedHand: false,
//                 },
//                 {
//                   id: "6",
//                   name: "Guy Hawkins",
//                   isCoHost: false,
//                   hasAudio: false,
//                   hasVideo: false,
//                   raisedHand: false,
//                 },
//                 {
//                   id: "7",
//                   name: "Kathryn Murphy",
//                   isCoHost: false,
//                   hasAudio: false,
//                   hasVideo: true,
//                   raisedHand: false,
//                 },
//               ].map((participant) => (
//                 <div
//                   key={participant.id}
//                   className="flex items-center gap-2 py-2 border-b border-gray-200"
//                 >
//                   <img
//                     src={getAvatarForName(participant.name)}
//                     alt={participant.name}
//                     className="w-10 h-10 rounded-full border-2 border-white"
//                   />
//                   <div className="flex-1 flex flex-row items-center gap-2">
//                     <p className="font-medium text-sm text-gray-800">
//                       {participant.name}
//                     </p>
//                     {participant.isCoHost && (
//                       <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
//                         Co-Host
//                       </span>
//                     )}
//                     {participant.raisedHand && (
//                       <img
//                         src={hand}
//                         alt="hand raised"
//                         className="w-4 h-4 hue-rotate-90"
//                       />
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
//               <h2 className="text-sm font-semibold text-gray-800">
//                 Chats ({chatMessages.length})
//               </h2>
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
//                       <p className="font-medium text-sm text-gray-800">
//                         {msg.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(msg.timestamp).toLocaleTimeString()}
//                       </p>
//                     </div>
//                     <p className="bg-gray-100 p-2 rounded-lg text-sm text-gray-700">
//                       {msg.message}
//                     </p>
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
//                 onClick={() => sendChatMessage()}
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
// import recordIcon from "../Images/Icon/recordIcon.png";
// import axios from "axios";

// var ws = null;

// const VWeb = () => {
//   const [user, setUser] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [error, setError] = useState(null);
//   const [participants, setParticipants] = useState([
//     {
//       id: "1",
//       name: "Cassie Jung",
//       hasAudio: false,
//       hasVideo: false,
//       raisedHand: false,
//     },
//     {
//       id: "2",
//       name: "Alice Wong",
//       hasAudio: true,
//       hasVideo: false,
//       raisedHand: false,
//     },
//     {
//       id: "3",
//       name: "Theresa Webb",
//       hasAudio: true,
//       hasVideo: false,
//       raisedHand: false,
//     },
//     {
//       id: "4",
//       name: "Christian Wong",
//       hasAudio: false,
//       hasVideo: false,
//       raisedHand: false,
//     },
//   ]);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [isHandRaised, setIsHandRaised] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [messageQueue, setMessageQueue] = useState([]);
//   const chatContainerRef = useRef(null);
//   const reconnectAttempts = useRef(0);
//   const maxReconnectAttempts = 5;
//   const reconnectDelay = useRef(1000); // Initial delay of 1 second

//   const generateRandomId = (length) => {
//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
//         room: "Ade1253uL",
//         name: "Lukman Chung",
//         email: "dchung.aladebowale@gmail.com",
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
//         setError(
//           response.data?.response?.message || "Failed to retrieve user session"
//         );
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

//   const sendWSMessage = (subMsg) => {
//     if (ws != null && ws.readyState === WebSocket.OPEN) {
//       ws.send(`[${JSON.stringify(subMsg)}]`);
//       setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subMsg)}`]);
//     }
//   };

//   useEffect(() => {
//     if (!user || !user.meetingID) return;
//     ws = new WebSocket(
//       "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
//     );

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//       setSocket(ws);

//       console.log("meetingID:", user.meetingID);
//       console.log("internalUserID:", user.internalUserID);
//       console.log("authToken:", user.authToken);
//       console.log("externUserID:", user.externUserID);

//       const subMsg1 = `{"msg":"connect","version":"1","support":["1","pre2","pre1"]}`;
//       sendWSMessage(subMsg1);
//       const subMsg2 = `{"msg":"method","id":"1","method":"userChangedLocalSettings","params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,"userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,"userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,"guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,"pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},"audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},"dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}}]}`;
//       sendWSMessage(subMsg2);
//       const subMsg3 = `{"msg":"method","id":"2","method":"validateAuthToken","params":["${user?.meetingID}","${user?.internalUserID}","${user?.authToken}","${user?.externUserID}"]}`;
//       sendWSMessage(subMsg3);
//       const subMsg4 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"auth-token-validation","params":[{"meetingId":"${
//         user?.meetingID
//       }","userId":"${user?.internalUserID}"}]}`;
//       sendWSMessage(subMsg4);
//       const subMsg5 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"current-user","params":[]}`;
//       sendWSMessage(subMsg5);
//       const subMsg6 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users","params":[]}`;
//       sendWSMessage(subMsg6);
//       const subMsg7 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"meetings","params":[]}`;
//       sendWSMessage(subMsg7);
//       const subMsg8 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"polls","params":[]}`;
//       sendWSMessage(subMsg8);
//       const subMsg9 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"presentation","params":[]}`;
//       sendWSMessage(subMsg9);
//       const subMsg10 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"slides","params":[]}`;
//       sendWSMessage(subMsg10);
//       const subMsg11 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"slide-positions","params":[]}`;
//       sendWSMessage(subMsg11);
//       const subMsg12 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"captions","params":[]}`;
//       sendWSMessage(subMsg12);
//       const subMsg13 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"voiceUsers","params":[]}`;
//       sendWSMessage(subMsg13);
//       const subMsg14 = `{"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"whiteboard-multi-user","params":[]}`;
//       sendWSMessage(subMsg14);
//       const subMsg15 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"screenshare","params":[]}`;
//       sendWSMessage(subMsg15);
//       const subMsg16 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"group-chat","params":[]}`;
//       sendWSMessage(subMsg16);
//       const subMsg17 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"group-chat-msg","params":[]}`;
//       sendWSMessage(subMsg17);
//       const subMsg18 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"presentation-pods","params":[]}`;
//       sendWSMessage(subMsg18);
//       const subMsg19 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users-settings","params":[]}`;
//       sendWSMessage(subMsg19);
//       const subMsg20 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users-infos","params":[]}`;
//       sendWSMessage(subMsg20);
//       const subMsg21 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"note","params":[]}`;
//       sendWSMessage(subMsg21);
//       const subMsg22 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"meeting-time-remaining","params":[]}`;
//       sendWSMessage(subMsg22);
//       const subMsg23 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"local-settings","params":[]}`;
//       sendWSMessage(subMsg23);
//       const subMsg24 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users-typing","params":[]}`;
//       sendWSMessage(subMsg24);
//       const subMsg25 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"record-meetings","params":[]}`;
//       sendWSMessage(subMsg25);
//       const subMsg26 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"video-streams","params":[]}`;
//       sendWSMessage(subMsg26);
//       const subMsg27 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"connection-status","params":[]}`;
//       sendWSMessage(subMsg27);
//       const subMsg28 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"voice-call-status","params":[]}`;
//       sendWSMessage(subMsg28);
//       const subMsg29 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"external-video-meetings","params":[]}`;
//       sendWSMessage(subMsg29);
//       const subMsg30 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"meetings","params":["MODERATOR"]}`;
//       sendWSMessage(subMsg30);
//       const subMsg31 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"users","params":["MODERATOR"]}`;
//       sendWSMessage(subMsg31);
//       const subMsg32 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"breakouts","params":["MODERATOR"]}`;
//       sendWSMessage(subMsg32);
//       const subMsg33 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"guestUsers","params":["MODERATOR"]}`;
//       sendWSMessage(subMsg33);
//       const subMsg34 = ` {"msg":"sub","id":"${generateRandomId(
//         17
//       )}","name":"annotations","params":[]}`;
//       sendWSMessage(subMsg34);
//     };

//     ws.onmessage = (event) => {
//       console.log("Raw WebSocket message:", event.data);
//       let data = event.data;

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
//             raisedHand: data.fields.emojiStatus === "raiseHand",
//           },
//         ]);
//       }

//       if (data.msg === "changed" && data.collection === "users") {
//         console.log("User updated:", data.fields);
//         setParticipants((prev) =>
//           prev.map((p) =>
//             p.id === data.id
//               ? { ...p, raisedHand: data.fields.emojiStatus === "raiseHand" }
//               : p
//           )
//         );
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
//           chatContainerRef.current.scrollTop =
//             chatContainerRef.current.scrollHeight;
//         }
//       }
//       if (data.msg === "changed" && data.collection === "record-meetings") {
//         console.log("Recording state updated:", data.fields);
//         setIsRecording(data.fields.recording);
//       }
//     };
//     ws.onerror = (err) => {
//       console.error("WebSocket error occurred:", err);
//       setError(
//         `WebSocket error at ${new Date().toLocaleString("en-US", {
//           timeZone: "Africa/Lagos",
//         })}: ${err.message || "Unknown error"}`
//       );
//     };
//     ws.onclose = (event) => {
//       console.log("WebSocket disconnected:", event.code, event.reason);
//       if (event.code !== 1006) {
//         setError(
//           `WebSocket closed at ${new Date().toLocaleString("en-US", {
//             timeZone: "Africa/Lagos",
//           })}: Code ${event.code}, Reason: ${event.reason}`
//         );
//       }
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
//     if (!user || !message.trim()) {
//       console.error("Cannot send message:", {
//         user: !!user,
//         message: message.trim(),
//       });
//       setError("Cannot send message: User or message is invalid");
//       return;
//     }

//     const subCMsg = `{"msg":"method","id":"292","method":"sendGroupChatMsg","params":["MAIN-PUBLIC-GROUP-CHAT",{"correlationId":"w_73iggoe29s2z-1748036833279","sender":{"id":"w_73iggoe29s2z","name":"","role":""},"chatEmphasizedText":true,"message":"${message.trim()}"}]}`
//     sendWSMessage(subCMsg);

//     if (socket && socket.readyState === WebSocket.OPEN) {
//       try {
//         console.log("WebSocket readyState:", socket.readyState);
//         console.log("Attempting to send message:", subCMsg);
//         socket.send(`[${JSON.stringify(subCMsg)}]`);
//         setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subCMsg)}`]);
//         console.log("Chat message sent successfully");
//       } catch (err) {
//         console.error("Failed to send chat message:", err);
//         setError(`Failed to send chat message: ${err.message}`);
//       }
//     } else {
//       console.warn(
//         "WebSocket not connected or not authenticated, queuing message. readyState:",
//         socket?.readyState,
//         "Authenticated:"
//       );
//       setMessageQueue((prev) => [...prev, subCMsg]);
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
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   };
//   const sendMessageFromOtherUser = () => {
//     const otherUser = participants.find(
//       (p) => p.name !== (user?.name || "Guest")
//     ) || {
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
//     setResponses((prev) => [
//       ...prev,
//       `Simulated: ${JSON.stringify(simulatedMessage)}`,
//     ]);
//     setChatMessages((prev) => [
//       ...prev,
//       {
//         name: simulatedMessage.fields.sender.name,
//         message: simulatedMessage.fields.message,
//         timestamp: new Date(simulatedMessage.fields.timestamp),
//       },
//     ]);
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
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
//         const raiseHandMessage = {
//           msg: "method",
//           id: generateRandomId(17),
//           method: "setEmojiStatus",
//           params: [
//             {
//               userId: user?.internalUserID,
//               meetingId: user?.meetingID,
//               emoji: newHandRaisedState ? "raiseHand" : "none",
//             },
//           ],
//         };
//         sendWSMessage(raiseHandMessage);
//         try {
//           console.log("Sending raise hand message:", raiseHandMessage);
//           socket.send(`[${JSON.stringify(raiseHandMessage)}]`);
//           setResponses((prev) => [
//             ...prev,
//             `Sent: ${JSON.stringify(raiseHandMessage)}`,
//           ]);
//           console.log("Raise hand message sent successfully");
//         } catch (err) {
//           console.error("Failed to send raise hand message:", err);
//           setError(`Failed to send raise hand message: ${err.message}`);
//         }
//       } else {
//         console.warn(
//           "WebSocket not connected, hand raise updated locally only"
//         );
//       }
//     } else if (control === "Record") {
//       const newRecordingState = !isRecording;
//       setIsRecording(newRecordingState);

//       if (socket && socket.readyState === WebSocket.OPEN) {
//         const toggleRecordingMessage = {
//           msg: "method",
//           id: generateRandomId(17),
//           method: "toggleRecording",
//           params: [],
//         };
//         try {
//           socket.send(`[${JSON.stringify(toggleRecordingMessage)}]`);
//           setResponses((prev) => [
//             ...prev,
//             `Sent: ${JSON.stringify(toggleRecordingMessage)}`,
//           ]);
//           console.log("Toggle recording message sent successfully");
//         } catch (err) {
//           console.error("Failed to send toggle recording message:", err);
//           setError(`Failed to send toggle recording message: ${err.message}`);
//         }
//       } else {
//         console.warn(
//           "WebSocket not connected, recording state updated locally only"
//         );
//       }
//     } else if (control === "Leave Meeting") {
//       if (socket && socket.readyState === WebSocket.OPEN) {
//         const endMeetingMessage = {
//           msg: "method",
//           id: generateRandomId(17),
//           method: "endMeeting",
//           params: [
//             {
//               meetingId: user?.meetingID,
//               userId: user?.internalUserID,
//             },
//           ],
//         };
//         sendWSMessage(endMeetingMessage);
//         try {
//           console.log("Sending end meeting message:", endMeetingMessage);
//           socket.send(`[${JSON.stringify(endMeetingMessage)}]`);
//           setResponses((prev) => [
//             ...prev,
//             `Sent: ${JSON.stringify(endMeetingMessage)}`,
//           ]);
//           console.log("End meeting message sent successfully");
//           // Clean up and reset state
//           setParticipants([]);
//           setChatMessages([]);
//           setMessage("");
//           setIsHandRaised(false);
//           setIsRecording(false);
//           setError(null);
//           if (ws.readyState === WebSocket.OPEN) {
//             ws.close();
//           }
//           setSocket(null);
//         } catch (err) {
//           console.error("Failed to end meeting:", err);
//           setError(`Failed to end meeting: ${err.message}`);
//         }
//       } else {
//         console.warn("WebSocket not connected, closing locally");
//         setParticipants([]);
//         setChatMessages([]);
//         setMessage("");
//         setIsHandRaised(false);
//         setIsRecording(false);
//         setError(null);
//         if (ws) {
//           ws.close();
//         }
//         setSocket(null);
//       }
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
//               <span className="text-gray-700 text-sm font-medium">
//                 13:03:34
//               </span>
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
//                 <img
//                   src={hand}
//                   alt="raise hand"
//                   className={`w-5 h-5 bg-green-700 ${isHandRaised ? "hue-rotate-90" : ""}`}
//                 />
//               </button>
//               <button
//                 className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
//                 onClick={() => handleControlClick("Record")}
//               >
//                 <img
//                   src={recordIcon}
//                   alt={isRecording ? "pause recording" : "record"}
//                   className={`w-5 h-5 ${
//                     isRecording ? "hue-rotate-0" : "hue-rotate-180"
//                   }`}
//                 />
//                 <span className="text-sm text-gray-700">
//                   {isRecording ? "Pause Recording" : "Record"}
//                 </span>
//               </button>
//             </div>
//             <button
//               onClick={() => handleControlClick("Leave Meeting")}
//               className="bg-[#EF4444] text-white py-2 px-4 rounded-lg text-sm font-medium"
//             >
//               Leave Meeting
//             </button>
//           </div>
//         </div>

//         <div className="w-full md:w-80 bg-white p-4 h-full overflow-y-auto">
//           <div>
//             <div className="flex flex-row items-center space-x-2">
//               <h2 className="text-sm font-semibold text-gray-800">
//                 Participants ({participants.length})
//               </h2>
//               <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1">
//                 <button className="text-xs font-semibold">
//                   Add Participant
//                 </button>
//                 <img src={AddUser} alt="add user" className="w-3 h-3" />
//               </div>
//             </div>
//             <div className="mt-4 space-y-2">
//               {[
//                 {
//                   id: "5",
//                   name: "Dianne Russell",
//                   isCoHost: true,
//                   hasAudio: true,
//                   hasVideo: false,
//                   raisedHand: false,
//                 },
//                 {
//                   id: "6",
//                   name: "Guy Hawkins",
//                   isCoHost: false,
//                   hasAudio: false,
//                   hasVideo: false,
//                   raisedHand: false,
//                 },
//                 {
//                   id: "7",
//                   name: "Kathryn Murphy",
//                   isCoHost: false,
//                   hasAudio: false,
//                   hasVideo: true,
//                   raisedHand: false,
//                 },
//               ].map((participant) => (
//                 <div
//                   key={participant.id}
//                   className="flex items-center gap-2 py-2 border-b border-gray-200"
//                 >
//                   <img
//                     src={getAvatarForName(participant.name)}
//                     alt={participant.name}
//                     className="w-10 h-10 rounded-full border-2 border-white"
//                   />
//                   <div className="flex-1 flex flex-row items-center gap-2">
//                     <p className="font-medium text-sm text-gray-800">
//                       {participant.name}
//                     </p>
//                     {participant.isCoHost && (
//                       <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
//                         Co-Host
//                       </span>
//                     )}
//                     {participant.raisedHand && (
//                       <img
//                         src={hand}
//                         alt="hand raised"
//                         className="w-4 h-4 hue-rotate-90"
//                       />
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
//               <h2 className="text-sm font-semibold text-gray-800">
//                 Chats ({chatMessages.length})
//               </h2>
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
//                       <p className="font-medium text-sm text-gray-800">
//                         {msg.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(msg.timestamp).toLocaleTimeString()}
//                       </p>
//                     </div>
//                     <p className="bg-gray-100 p-2 rounded-lg text-sm text-gray-700">
//                       {msg.message}
//                     </p>
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
//                 onClick={() => sendChatMessage()}
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
// import recordIcon from "../Images/Icon/recordIcon.png";
// import axios from "axios";

// let ws = null;

// const VWeb = () => {
//   const [user, setUser] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [error, setError] = useState(null);
//   const [participants, setParticipants] = useState([
//     {
//       id: "1",
//       name: "Cassie Jung",
//       hasAudio: false,
//       hasVideo: false,
//       raisedHand: false,
//       peerConnection: null,
//     },
//     {
//       id: "2",
//       name: "Alice Wong",
//       hasAudio: true,
//       hasVideo: false,
//       raisedHand: false,
//       peerConnection: null,
//     },
//     {
//       id: "3",
//       name: "Theresa Webb",
//       hasAudio: true,
//       hasVideo: false,
//       raisedHand: false,
//       peerConnection: null,
//     },
//     {
//       id: "4",
//       name: "Christian Wong",
//       hasAudio: false,
//       hasVideo: false,
//       raisedHand: false,
//       peerConnection: null,
//     },
//   ]);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [isHandRaised, setIsHandRaised] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [messageQueue, setMessageQueue] = useState([]);
//   const [localStream, setLocalStream] = useState(null);
//   const chatContainerRef = useRef(null);
//   const reconnectAttempts = useRef(0);
//   const maxReconnectAttempts = 5;
//   const reconnectDelay = useRef(1000); // Initial delay of 1 second

//   const generateRandomId = (length) => {
//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
//         room: "Ade1253uL",
//         name: "Lukman Chung",
//         email: "dchung.aladebowale@gmail.com",
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
//         setError(
//           response.data?.response?.message || "Failed to retrieve user session"
//         );
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

//   const sendWSMessage = (subMsg) => {
//     if (ws != null && ws.readyState === WebSocket.OPEN) {
//       ws.send(`[${JSON.stringify(subMsg)}]`);
//       setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subMsg)}`]);
//     }
//   };

//   const initializeLocalStream = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       setLocalStream(stream);
//       participants.forEach((p) => {
//         if (p.peerConnection) {
//           p.peerConnection.getSenders().forEach((sender) => {
//             if (sender.track?.kind === "audio") {
//               sender.replaceTrack(stream.getAudioTracks()[0]);
//             }
//           });
//         }
//       });
//     } catch (err) {
//       setError(`Failed to access microphone: ${err.message}`);
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
//             ? { ...p, audioStream: event.streams[0] }
//             : p
//         )
//       );
//     };

//     if (localStream) {
//       localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
//     }

//     return pc;
//   };

//   useEffect(() => {
//     if (!user || !user.meetingID) return;
//     ws = new WebSocket(
//       "wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket"
//     );

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//       setSocket(ws);

//       console.log("meetingID:", user.meetingID);
//       console.log("internalUserID:", user.internalUserID);
//       console.log("authToken:", user.authToken);
//       console.log("externUserID:", user.externUserID);

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
//       sendWSMessage(subMsg7); // Added for voice signaling
//     };

//     ws.onmessage = (event) => {
//       console.log("Raw WebSocket message:", event.data);
//       const jsonMatch = event.data.match(/\["(.*)"\]/);
//       if (jsonMatch && jsonMatch[1]) {
//         try {
//           const parsedData = JSON.parse(jsonMatch[1]);
//           console.log("Parsed WebSocket message:", parsedData);
//           setResponses((prev) => [...prev, `Received: ${JSON.stringify(parsedData)}`]);

//           if (parsedData.msg === "added" && parsedData.collection === "group-chat-msg") {
//             console.log("New chat message received:", parsedData.fields);
//             setChatMessages((prev) => {
//               const newMessage = {
//                 name: parsedData.fields.senderName || "Guest",
//                 message: parsedData.fields.message,
//                 timestamp: new Date(parsedData.fields.timestamp || Date.now()),
//               };
//               const updatedMessages = [...prev, newMessage];
//               console.log("Updated chatMessages:", updatedMessages);
//               return updatedMessages;
//             });
//             if (chatContainerRef.current) {
//               chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//             }
//           }
//           if (parsedData.msg === "added" && parsedData.collection === "users") {
//             console.log("New user joined:", parsedData.fields);
//             setParticipants((prev) => [
//               ...prev,
//               {
//                 id: parsedData.id,
//                 name: parsedData.fields.name,
//                 isCoHost: parsedData.fields.role === "MODERATOR",
//                 hasAudio: false,
//                 hasVideo: false,
//                 raisedHand: parsedData.fields.emojiStatus === "raiseHand",
//                 peerConnection: createPeerConnection(parsedData.id),
//               },
//             ]);
//           }
//           if (parsedData.msg === "method" && parsedData.method === "offer") {
//             const pc = participants.find((p) => p.id === parsedData.params[0])?.peerConnection;
//             if (pc) {
//               pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(parsedData.params[1])))
//                 .then(() => pc.createAnswer())
//                 .then((answer) => pc.setLocalDescription(answer))
//                 .then(() => {
//                   sendWSMessage({
//                     msg: "method",
//                     method: "answer",
//                     params: [parsedData.params[0], JSON.stringify(pc.localDescription)],
//                   });
//                 });
//             }
//           }
//           if (parsedData.msg === "method" && parsedData.method === "iceCandidate") {
//             const pc = participants.find((p) => p.id === parsedData.params[0])?.peerConnection;
//             if (pc) {
//               pc.addIceCandidate(new RTCIceCandidate(JSON.parse(parsedData.params[1])));
//             }
//           }
//           if (parsedData.msg === "error") {
//             setError(`WebSocket error: ${parsedData.reason}`);
//           }
//         } catch (error) {
//           console.error("Failed to parse WebSocket message:", error);
//           setError(`Parsing error: ${error.message}`);
//         }
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("WebSocket error occurred:", err);
//       setError(
//         `WebSocket error at ${new Date().toLocaleString("en-US", {
//           timeZone: "Africa/Lagos",
//         })}: ${err.message || "Unknown error"}`
//       );
//     };

//     ws.onclose = (event) => {
//       console.log("WebSocket disconnected:", event.code, event.reason);
//       if (event.code !== 1006) {
//         setError(
//           `WebSocket closed at ${new Date().toLocaleString("en-US", {
//             timeZone: "Africa/Lagos",
//           })}: Code ${event.code}, Reason: ${event.reason}`
//         );
//       }
//       setSocket(null);
//     };

//     return () => {
//       if (ws && ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//       if (localStream) {
//         localStream.getTracks().forEach((track) => track.stop());
//       }
//       participants.forEach((p) => p.peerConnection?.close());
//     };
//   }, [user]);

//   const toggleAudio = (id) => {
//     setParticipants((prev) =>
//       prev.map((p) => {
//         if (p.id === id) {
//           const newHasAudio = !p.hasAudio;
//           if (newHasAudio && !localStream) {
//             initializeLocalStream();
//           }
//           return { ...p, hasAudio: newHasAudio };
//         }
//         return p;
//       })
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

//     const subCMsg = `{"msg":"method","id":"292","method":"sendGroupChatMsg","params":["MAIN-PUBLIC-GROUP-CHAT",{"correlationId":"w_73iggoe29s2z-1748036833279","sender":{"id":"w_73iggoe29s2z","name":"","role":""},"chatEmphasizedText":true,"message":"${message.trim()}"}]}`;
//     sendWSMessage(subCMsg);

//     if (socket && socket.readyState === WebSocket.OPEN) {
//       try {
//         console.log("WebSocket readyState:", socket.readyState);
//         console.log("Attempting to send message:", subCMsg);
//         socket.send(`[${JSON.stringify(subCMsg)}]`);
//         setResponses((prev) => [...prev, `Sent: ${JSON.stringify(subCMsg)}`]);
//         console.log("Chat message sent successfully");
//       } catch (err) {
//         console.error("Failed to send chat message:", err);
//         setError(`Failed to send chat message: ${err.message}`);
//       }
//     } else {
//       console.warn(
//         "WebSocket not connected or not authenticated, queuing message. readyState:",
//         socket?.readyState,
//         "Authenticated:"
//       );
//       setMessageQueue((prev) => [...prev, subCMsg]);
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
//     const otherUser =
//       participants.find((p) => p.name !== (user?.name || "Guest")) || {
//         name: "Kathryn Murphy",
//       };
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
//     setResponses((prev) => [
//       ...prev,
//       `Simulated: ${JSON.stringify(simulatedMessage)}`,
//     ]);
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
//         try {
//           socket.send(`[${JSON.stringify(raiseHandMessage)}]`);
//           setResponses((prev) => [
//             ...prev,
//             `Sent: ${JSON.stringify(raiseHandMessage)}`,
//           ]);
//           console.log("Raise hand message sent successfully");
//         } catch (err) {
//           console.error("Failed to send raise hand message:", err);
//           setError(`Failed to send raise hand message: ${err.message}`);
//         }
//       } else {
//         console.warn("WebSocket not connected, hand raise updated locally only");
//       }
//     } else if (control === "Record") {
//       const newRecordingState = !isRecording;
//       setIsRecording(newRecordingState);

//       if (socket && socket.readyState === WebSocket.OPEN) {
//         const toggleRecordingMessage = `{"msg":"method","id":"10005","method":"toggleRecording","params":[]}`;
//         sendWSMessage(toggleRecordingMessage);
//         try {
//           socket.send(`[${JSON.stringify(toggleRecordingMessage)}]`);
//           setResponses((prev) => [
//             ...prev,
//             `Sent: ${JSON.stringify(toggleRecordingMessage)}`,
//           ]);
//           console.log("Toggle recording message sent successfully");
//         } catch (err) {
//           console.error("Failed to send toggle recording message:", err);
//           setError(`Failed to send toggle recording message: ${err.message}`);
//         }
//       } else {
//         console.warn("WebSocket not connected, recording state updated locally only");
//       }
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
//             <audio autoPlay muted={user?.id === participants.find((p) => p.name === user?.name)?.id}>
//               {localStream && <source srcObject={localStream} type="audio/webm" />}
//               {participants.map((p) => p.audioStream && (
//                 <source key={p.id} srcObject={p.audioStream} type="audio/webm" />
//               ))}
//             </audio>
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
//               <span className="text-gray-700 text-sm font-medium">
//                 13:03:34
//               </span>
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
//                 <img
//                   src={hand}
//                   alt="raise hand"
//                   className={`w-5 h-5 bg-green-700 ${isHandRaised ? "hue-rotate-90" : ""}`}
//                 />
//               </button>
//               <button
//                 className="flex items-center space-x-1 border border-gray-300 rounded-lg px-2 py-1 shadow-sm bg-white"
//                 onClick={() => handleControlClick("Record")}
//               >
//                 <img
//                   src={recordIcon}
//                   alt={isRecording ? "pause recording" : "record"}
//                   className={`w-5 h-5 ${
//                     isRecording ? "hue-rotate-0" : "hue-rotate-180"
//                   }`}
//                 />
//                 <span className="text-sm text-gray-700">
//                   {isRecording ? "Pause Recording" : "Record"}
//                 </span>
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
//               <h2 className="text-sm font-semibold text-gray-800">
//                 Participants ({participants.length})
//               </h2>
//               <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1">
//                 <button className="text-xs font-semibold">
//                   Add Participant
//                 </button>
//                 <img src={AddUser} alt="add user" className="w-3 h-3" />
//               </div>
//             </div>
//             <div className="mt-4 space-y-2">
//               {[
//                 {
//                   id: "5",
//                   name: "Dianne Russell",
//                   isCoHost: true,
//                   hasAudio: true,
//                   hasVideo: false,
//                   raisedHand: false,
//                   peerConnection: null,
//                 },
//                 {
//                   id: "6",
//                   name: "Guy Hawkins",
//                   isCoHost: false,
//                   hasAudio: false,
//                   hasVideo: false,
//                   raisedHand: false,
//                   peerConnection: null,
//                 },
//                 {
//                   id: "7",
//                   name: "Kathryn Murphy",
//                   isCoHost: false,
//                   hasAudio: false,
//                   hasVideo: true,
//                   raisedHand: false,
//                   peerConnection: null,
//                 },
//               ].map((participant) => (
//                 <div
//                   key={participant.id}
//                   className="flex items-center gap-2 py-2 border-b border-gray-200"
//                 >
//                   <img
//                     src={getAvatarForName(participant.name)}
//                     alt={participant.name}
//                     className="w-10 h-10 rounded-full border-2 border-white"
//                   />
//                   <div className="flex-1 flex flex-row items-center gap-2">
//                     <p className="font-medium text-sm text-gray-800">
//                       {participant.name}
//                     </p>
//                     {participant.isCoHost && (
//                       <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
//                         Co-Host
//                       </span>
//                     )}
//                     {participant.raisedHand && (
//                       <img
//                         src={hand}
//                         alt="hand raised"
//                         className="w-4 h-4 hue-rotate-90"
//                       />
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
//               <h2 className="text-sm font-semibold text-gray-800">
//                 Chats ({chatMessages.length})
//               </h2>
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
//                       <p className="font-medium text-sm text-gray-800">
//                         {msg.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(msg.timestamp).toLocaleTimeString()}
//                       </p>
//                     </div>
//                     <p className="bg-gray-100 p-2 rounded-lg text-sm text-gray-700">
//                       {msg.message}
//                     </p>
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
//                 onClick={() => sendChatMessage()}
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