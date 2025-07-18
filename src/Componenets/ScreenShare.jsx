import React, { useState, useEffect, useRef } from "react";
import kurentoUtils from "kurento-utils";

const ScreenShare = () => {
  const ws = useRef(null);
  const webRtcPeer = useRef(null);
  const messageQueue = useRef([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [peerInitialized, setPeerInitialized] = useState(false);

  const user = {
    meetingDetails: {
      meetingID: "b2e07802a1923590b22d187f11f729b1181a3132-1752249282584",
      voiceBridge: "36155",
      fullname: "wale",
      internalUserID: "w_fswcb79bxixr",
    },
    authToken: "ac7uop03h6cf",
    sessionToken: "kmisxt3vowpbidre",
  };

  const buildStreamName = (deviceId) => {
    return `${user.meetingDetails.internalUserID}${user.authToken}${deviceId}`;
  };

  const kurentoScreenShareSend = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log("Sending screen share message:", message);
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not open, queuing screen share message");
      messageQueue.current.push(message);
    }
  };

  const sendQueuedMessages = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      while (messageQueue.current.length > 0) {
        const message = messageQueue.current.shift();
        console.log("Sending queued message:", message);
        ws.current.send(JSON.stringify(message));
      }
    } else {
      console.warn("WebSocket not open, cannot send queued messages");
    }
  };

  const startWebSocket = () => {
    console.log("Starting WebSocket connection for screen share with sessionToken:", user.sessionToken);
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
      try {
        ws.current = new WebSocket(
          `wss://meet.konn3ct.ng/bbb-webrtc-sfu?sessionToken=${user.sessionToken}`
        );
        console.log("WebSocket instance created for screen share");
      } catch (err) {
        console.error("WebSocket creation failed:", err);
        setError(`WebSocket creation failed: ${err.message || err}`);
        return;
      }

      ws.current.onopen = () => {
        console.log("WebSocket connected successfully for screen share");
        setConnected(true);
        setError(null);
        sendQueuedMessages();
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received WebSocket message for screen share:", data);

          if (!peerInitialized) {
            console.warn("WebRtcPeer not initialized, queuing message:", data);
            messageQueue.current.push(data);
            return;
          }

          if (!webRtcPeer.current || !webRtcPeer.current.peer) {
            console.warn("WebRtcPeer not initialized for screen share");
            setError("WebRtcPeer not initialized");
            return;
          }

          if (data.id === "error") {
            console.error("SFU Error:", data);
            setError(`SFU Error: ${data.message} (Code: ${data.code}, Reason: ${data.reason})`);
          } else if (data.id === "startResponse" && data.sdpAnswer) {
            console.log("Processing SDP answer for screen share:", data.sdpAnswer);
            try {
              webRtcPeer.current.peer.processAnswer(data.sdpAnswer, (error) => {
                if (error) {
                  console.error("Error processing SDP answer for screen share:", error);
                  setError(`Error processing SDP answer: ${error.message || error}`);
                } else {
                  console.log("SDP answer processed successfully for screen share");
                }
              });
            } catch (error) {
              console.error("Exception processing SDP answer for screen share:", error);
              setError(`Exception processing SDP answer: ${error.message || error}`);
            }
          } else if (data.id === "iceCandidate" && data.candidate) {
            console.log("Processing ICE candidate for screen share:", data.candidate);
            try {
              webRtcPeer.current.peer.addIceCandidate(data.candidate, (error) => {
                if (error) {
                  console.error("Error adding ICE candidate for screen share:", error);
                  setError(`Error adding ICE candidate: ${error.message || error}`);
                } else {
                  console.log("ICE candidate added successfully for screen share");
                }
              });
            } catch (error) {
              console.error("Exception adding ICE candidate for screen share:", error);
              setError(`Exception adding ICE candidate: ${error.message || error}`);
            }
          } else {
            console.warn("Unexpected message received for screen share:", data);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message for screen share:", error);
          setError(`Error parsing WebSocket message: ${error.message || error}`);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket Error for screen share:", error);
        setError(`WebSocket Error: ${error.message || "Connection failed"}`);
        setConnected(false);
        reconnect();
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected for screen share");
        setConnected(false);
        cleanupWebRtcPeer();
        reconnect();
      };
    } else {
      console.log("WebSocket already exists for screen share, state:", ws.current.readyState);
      sendQueuedMessages();
    }
  };

  const startScreenShare = async () => {
    if (!connected) {
      startWebSocket();
      return; // Wait for WebSocket to connect before proceeding
    }

    const screenInput = document.getElementById("screenInput");
    const screenOutput = document.getElementById("screenOutput");

    if (!screenInput || !screenOutput) {
      console.error("Screen share elements not found in DOM");
      setError("Screen share elements not found");
      return;
    }

    const constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
        displaySurface: "monitor",
      },
    };

    async function requestScreenPermissions() {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
        console.log("Screen sharing permissions granted:", stream);
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length > 0) {
          const screenDevice = { deviceID: videoTracks[0].getSettings().deviceId };
          screenInput.srcObject = stream;
          return screenDevice;
        } else {
          throw new Error("No video tracks available for screen share");
        }
      } catch (err) {
        console.error("Screen sharing permissions error:", err);
        setError(`Screen sharing permissions error: ${err.message || err}`);
        return null;
      }
    }

    async function initializeWebRtcPeer() {
      console.log("Initializing WebRtcPeer for screen share");
      const screenDevice = await requestScreenPermissions();
      if (!screenDevice) return;
      setSharing(true);

      function onOffer(error, sdpOffer) {
        if (error) {
          console.error("SDP Offer Error:", error);
          setError(`SDP Offer Error: ${error.message || error}`);
          return;
        }
        console.log("Generated SDP offer for screen share:", sdpOffer);

        const message = {
          id: "start",
          type: "screenshare",
          role: "send",
          internalMeetingId: user.meetingDetails.meetingID,
          voiceBridge: user.meetingDetails.voiceBridge,
          userName: user.meetingDetails.fullname,
          callerName: user.meetingDetails.internalUserID,
          sdpOffer: sdpOffer,
          hasAudio: false,
          contentType: "screenshare",
          bitrate: 1500,
        };
        kurentoScreenShareSend(message);
      }

      function onIceCandidate(candidate) {
        console.log("ICE candidate generated for screen share:", candidate);
        if (candidate && ws.current && ws.current.readyState === WebSocket.OPEN) {
          const message = {
            id: "onIceCandidate",
            candidate: candidate,
          };
          console.log("Sending ICE candidate for screen share:", message);
          ws.current.send(JSON.stringify(message));
        } else {
          console.warn("Cannot send ICE candidate for screen share, queuing or invalid");
          if (candidate) messageQueue.current.push({
            id: "onIceCandidate",
            candidate: candidate,
          });
        }
      }

      function onError(error) {
        console.error("WebRTC Error:", error);
        setError(`WebRTC Error: ${error.message || error}`);
      }

      const iceServers = [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:openrelay.metered.ca:443",
          username: "openrelay",
          credential: "openrelay",
        },
      ];

      const options = {
        localVideo: screenInput,
        remoteVideo: screenOutput,
        onicecandidate: onIceCandidate,
        mediaConstraints: constraints,
        configuration: { iceServers },
      };

      try {
        webRtcPeer.current = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(
          options,
          function (error) {
            if (error) {
              onError(error);
              return;
            }
            console.log("WebRtcPeer initialized for screen share, generating offer");
            setPeerInitialized(true); // Mark peer as initialized
            this.generateOffer(onOffer);
          }
        );

        webRtcPeer.current.peerConnection.oniceconnectionstatechange = () => {
          console.log("ICE connection state for screen share:", webRtcPeer.current.peerConnection.iceConnectionState);
          if (webRtcPeer.current.peerConnection.iceConnectionState === "failed") {
            console.error("ICE connection failed for screen share");
            setError("ICE connection failed. Check TURN server or network settings.");
          }
        };
      } catch (error) {
        console.error("Failed to create WebRtcPeer for screen share:", error);
        setError(`Failed to create WebRtcPeer: ${error.message || error}`);
      }
    }

    initializeWebRtcPeer();
  };

  const reconnect = () => {
    console.log("Attempting WebSocket reconnection for screen share in 3 seconds...");
    setTimeout(() => {
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        startWebSocket();
      }
    }, 3000);
  };

  const cleanupWebRtcPeer = () => {
    if (webRtcPeer.current && webRtcPeer.current.peer) {
      try {
        webRtcPeer.current.peer.dispose();
        console.log("WebRtcPeer disposed for screen share");
      } catch (error) {
        console.error("Error disposing WebRtcPeer for screen share:", error);
      }
      webRtcPeer.current = null;
    }
  };

  useEffect(() => {
    console.log("useEffect started for screen share");
    messageQueue.current = [];
    startWebSocket(); // Start WebSocket connection automatically

    return () => {
      console.log("Cleaning up WebSocket and WebRtcPeer for screen share");
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
      cleanupWebRtcPeer();
    };
  }, []);

  return (
    <div>
      <video id="screenInput" controls autoPlay muted style={{ width: "320px", height: "240px" }}>
        Your browser does not support the video element.
      </video>
      <video id="screenOutput" controls autoPlay style={{ width: "320px", height: "240px" }}>
        Your browser does not support the video element.
      </video>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Connected: {connected ? "Yes" : "No"}</p>
      <p>Sharing: {sharing ? "Yes" : "No"}</p>
      <p>Meeting ID: {user.meetingDetails.meetingID}</p>
      <p>Voice Bridge: {user.meetingDetails.voiceBridge}</p>
      <p>User Name: {user.meetingDetails.fullname}</p>
      <p>Caller Name: {user.meetingDetails.internalUserID}</p>
      <p>Auth Token: {user.authToken}</p>
      <p>Session Token: {user.sessionToken}</p>
      <button onClick={startScreenShare} disabled={sharing}>
        {sharing ? "Sharing..." : "Start Screen Share"}
      </button>
    </div>
  );
};

export default ScreenShare;

// import React, { useState, useEffect, useRef } from "react";
// import kurentoUtils from "kurento-utils";

// const ScreenShare = () => {
//   const ws = useRef(null);
//   const webRtcPeer = useRef(null);
//   const messageQueue = useRef([]);
//   const [connected, setConnected] = useState(false);
//   const [error, setError] = useState(null);
//   const [sharing, setSharing] = useState(false);

//   const user = {
//     meetingDetails: {
//       meetingID: "b2e07802a1923590b22d187f11f729b1181a3132-1752190599662",
//       voiceBridge: "79461",
//       fullname: "wale",
//       internalUserID: "w_ihzb8ji1ppyw",
//     },
//     authToken: "92z5yn7ls7ax",
//     sessionToken: "ovmiuyedknd84xco",
//   };

//   const buildStreamName = (deviceId) => {
//     return `${user.meetingDetails.internalUserID}${user.authToken}${deviceId}`;
//   };

//   const kurentoScreenShareSend = (message) => {
//     if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//       console.log("Sending screen share message:", message);
//       ws.current.send(JSON.stringify(message));
//     } else {
//       console.warn("WebSocket not open, queuing screen share message");
//       messageQueue.current.push(message);
//     }
//   };

//   const sendQueuedMessages = () => {
//     if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//       while (messageQueue.current.length > 0) {
//         const message = messageQueue.current.shift();
//         console.log("Sending queued message:", message);
//         ws.current.send(JSON.stringify(message));
//       }
//     } else {
//       console.warn("WebSocket not open, cannot send queued messages");
//     }
//   };

//   const startWebSocket = () => {
//     console.log("Starting WebSocket connection for screen share");
//     if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
//       try {
//         ws.current = new WebSocket(
//           `wss://meet.konn3ct.ng/bbb-webrtc-sfu?sessionToken=${user.sessionToken}`
//         );
//         console.log("WebSocket instance created for screen share");
//       } catch (err) {
//         console.error("WebSocket creation failed:", err);
//         setError(`WebSocket creation failed: ${err.message || err}`);
//         return;
//       }

//       ws.current.onopen = () => {
//         console.log("WebSocket connected successfully for screen share");
//         setConnected(true);
//         setError(null);
//         sendQueuedMessages();
//       };

//       ws.current.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           console.log("Received WebSocket message for screen share:", data);

//           if (!webRtcPeer.current || !webRtcPeer.current.peer) {
//             console.warn("WebRtcPeer not initialized for screen share");
//             setError("WebRtcPeer not initialized");
//             return;
//           }

//           if (data.id === "startResponse" && data.sdpAnswer) {
//             console.log("Processing SDP answer for screen share:", data.sdpAnswer);
//             try {
//               webRtcPeer.current.peer.processAnswer(data.sdpAnswer, (error) => {
//                 if (error) {
//                   console.error("Error processing SDP answer for screen share:", error);
//                   setError(`Error processing SDP answer: ${error.message || error}`);
//                 } else {
//                   console.log("SDP answer processed successfully for screen share");
//                 }
//               });
//             } catch (error) {
//               console.error("Exception processing SDP answer for screen share:", error);
//               setError(`Exception processing SDP answer: ${error.message || error}`);
//             }
//           } else if (data.id === "iceCandidate" && data.candidate) {
//             console.log("Processing ICE candidate for screen share:", data.candidate);
//             try {
//               webRtcPeer.current.peer.addIceCandidate(data.candidate, (error) => {
//                 if (error) {
//                   console.error("Error adding ICE candidate for screen share:", error);
//                   setError(`Error adding ICE candidate: ${error.message || error}`);
//                 } else {
//                   console.log("ICE candidate added successfully for screen share");
//                 }
//               });
//             } catch (error) {
//               console.error("Exception adding ICE candidate for screen share:", error);
//               setError(`Exception adding ICE candidate: ${error.message || error}`);
//             }
//           } else {
//             console.warn("Unexpected message received for screen share:", data);
//           }
//         } catch (error) {
//           console.error("Error parsing WebSocket message for screen share:", error);
//           setError(`Error parsing WebSocket message: ${error.message || error}`);
//         }
//       };

//       ws.current.onerror = (error) => {
//         console.error("WebSocket Error for screen share:", error);
//         setError(`WebSocket Error: ${error.message || "Connection failed"}`);
//         setConnected(false);
//         reconnect();
//       };

//       ws.current.onclose = () => {
//         console.log("WebSocket disconnected for screen share");
//         setConnected(false);
//         cleanupWebRtcPeer();
//         reconnect();
//       };
//     } else {
//       console.log("WebSocket already exists for screen share, state:", ws.current.readyState);
//       sendQueuedMessages();
//     }
//   };

//   const startScreenShare = async () => {
//     if (!connected) {
//       startWebSocket();
//       return; // Wait for WebSocket to connect before proceeding
//     }

//     const screenInput = document.getElementById("screenInput");
//     const screenOutput = document.getElementById("screenOutput");

//     if (!screenInput || !screenOutput) {
//       console.error("Screen share elements not found in DOM");
//       setError("Screen share elements not found");
//       return;
//     }

//     const constraints = {
//       video: {
//         width: { ideal: 1280 },
//         height: { ideal: 720 },
//         frameRate: { ideal: 30 },
//         displaySurface: "monitor",
//       },
//     };

//     async function requestScreenPermissions() {
//       try {
//         const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
//         console.log("Screen sharing permissions granted:", stream);
//         const videoTracks = stream.getVideoTracks();
//         if (videoTracks.length > 0) {
//           const screenDevice = { deviceID: videoTracks[0].getSettings().deviceId };
//           screenInput.srcObject = stream;
//           return screenDevice;
//         } else {
//           throw new Error("No video tracks available for screen share");
//         }
//       } catch (err) {
//         console.error("Screen sharing permissions error:", err);
//         setError(`Screen sharing permissions error: ${err.message || err}`);
//         return null;
//       }
//     }

//     async function initializeWebRtcPeer() {
//       console.log("Initializing WebRtcPeer for screen share");
//       const screenDevice = await requestScreenPermissions();
//       if (!screenDevice) return;
//       setSharing(true);

//       function onOffer(error, sdpOffer) {
//         if (error) {
//           console.error("SDP Offer Error:", error);
//           setError(`SDP Offer Error: ${error.message || error}`);
//           return;
//         }
//         console.log("Generated SDP offer for screen share:", sdpOffer);

//         const message = {
//           id: "start",
//           type: "screenshare",
//           role: "send",
//           internalMeetingId: user.meetingDetails.meetingID,
//           voiceBridge: user.meetingDetails.voiceBridge,
//           userName: user.meetingDetails.fullname,
//           callerName: user.meetingDetails.internalUserID,
//           sdpOffer: sdpOffer,
//           hasAudio: false,
//           contentType: "screenshare",
//           bitrate: 1500,
//         };
//         kurentoScreenShareSend(message);
//       }

//       function onIceCandidate(candidate) {
//         console.log("ICE candidate generated for screen share:", candidate);
//         if (candidate && ws.current && ws.current.readyState === WebSocket.OPEN) {
//           const message = {
//             id: "onIceCandidate",
//             candidate: candidate,
//           };
//           console.log("Sending ICE candidate for screen share:", message);
//           ws.current.send(JSON.stringify(message));
//         } else {
//           console.warn("Cannot send ICE candidate for screen share, queuing or invalid");
//           if (candidate) messageQueue.current.push({
//             id: "onIceCandidate",
//             candidate: candidate,
//           });
//         }
//       }

//       function onError(error) {
//         console.error("WebRTC Error:", error);
//         setError(`WebRTC Error: ${error.message || error}`);
//       }

//       const iceServers = [
//         { urls: "stun:stun.l.google.com:19302" },
//         {
//           urls: "turn:openrelay.metered.ca:443",
//           username: "openrelay",
//           credential: "openrelay",
//         },
//       ];

//       const options = {
//         localVideo: screenInput,
//         remoteVideo: screenOutput,
//         onicecandidate: onIceCandidate,
//         mediaConstraints: constraints,
//         configuration: { iceServers },
//       };

//       try {
//         webRtcPeer.current = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(
//           options,
//           function (error) {
//             if (error) {
//               onError(error);
//               return;
//             }
//             console.log("WebRtcPeer initialized for screen share, generating offer");
//             this.generateOffer(onOffer);
//           }
//         );

//         webRtcPeer.current.peerConnection.oniceconnectionstatechange = () => {
//           console.log("ICE connection state for screen share:", webRtcPeer.current.peerConnection.iceConnectionState);
//           if (webRtcPeer.current.peerConnection.iceConnectionState === "failed") {
//             console.error("ICE connection failed for screen share");
//             setError("ICE connection failed. Check TURN server or network settings.");
//           }
//         };
//       } catch (error) {
//         console.error("Failed to create WebRtcPeer for screen share:", error);
//         setError(`Failed to create WebRtcPeer: ${error.message || error}`);
//       }
//     }

//     initializeWebRtcPeer();
//   };

//   const reconnect = () => {
//     console.log("Attempting WebSocket reconnection for screen share in 3 seconds...");
//     setTimeout(() => {
//       if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
//         startWebSocket();
//       }
//     }, 3000);
//   };

//   const cleanupWebRtcPeer = () => {
//     if (webRtcPeer.current && webRtcPeer.current.peer) {
//       try {
//         webRtcPeer.current.peer.dispose();
//         console.log("WebRtcPeer disposed for screen share");
//       } catch (error) {
//         console.error("Error disposing WebRtcPeer for screen share:", error);
//       }
//       webRtcPeer.current = null;
//     }
//   };

//   useEffect(() => {
//     console.log("useEffect started for screen share");
//     messageQueue.current = [];
//     startWebSocket(); // Start WebSocket connection automatically

//     return () => {
//       console.log("Cleaning up WebSocket and WebRtcPeer for screen share");
//       if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//         ws.current.close();
//       }
//       cleanupWebRtcPeer();
//     };
//   }, []);

//   return (
//     <div>
//       <video id="screenInput" controls autoPlay muted style={{ width: "320px", height: "240px" }}>
//         Your browser does not support the video element.
//       </video>
//       <video id="screenOutput" controls autoPlay style={{ width: "320px", height: "240px" }}>
//         Your browser does not support the video element.
//       </video>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <p>Connected: {connected ? "Yes" : "No"}</p>
//       <p>Sharing: {sharing ? "Yes" : "No"}</p>
//       <p>Meeting ID: {user.meetingDetails.meetingID}</p>
//       <p>Voice Bridge: {user.meetingDetails.voiceBridge}</p>
//       <p>User Name: {user.meetingDetails.fullname}</p>
//       <p>Caller Name: {user.meetingDetails.internalUserID}</p>
//       <p>Auth Token: {user.authToken}</p>
//       <p>Session Token: {user.sessionToken}</p>
//       <button onClick={startScreenShare} disabled={sharing}>
//         {sharing ? "Sharing..." : "Start Screen Share"}
//       </button>
//     </div>
//   );
// };

// export default ScreenShare;



