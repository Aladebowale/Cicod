import React, { useState, useEffect, useRef } from "react";
import kurentoUtils from "kurento-utils";

const Video = () => {
  const ws = useRef(null);
  const webRtcPeer = useRef(null);
  const messageQueue = useRef([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const user = {
    internalUserID: "w_fswcb79bxixr",
    authToken: "ac7uop03h6cf",
    sessionToken: `${user.sessionToken}`,
  };

  const buildStreamName = (deviceId) => {
    return `${user.internalUserID}${user.authToken}${deviceId}`;
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

  const start = async () => {
    console.log("Starting WebSocket connection for video");
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
      try {
        ws.current = new WebSocket(
          `wss://meet.konn3ct.ng/bbb-webrtc-sfu?sessionToken=${user.sessionToken}`
        );
        console.log("WebSocket instance created for video");
      } catch (err) {
        console.error("WebSocket creation failed:", err);
        setError(`WebSocket creation failed: ${err.message || err}`);
        return;
      }

      ws.current.onopen = () => {
        console.log("WebSocket connected successfully for video");
        setConnected(true);
        setError(null);
        sendQueuedMessages();

        const videoInput = document.getElementById("videoInput");
        const videoOutput = document.getElementById("videoOutput");

        if (!videoInput || !videoOutput) {
          console.error("Video elements not found in DOM");
          setError("Video elements not found");
          return;
        }

        const constraints = {
          audio: false,
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
          },
        };

        async function requestMediaPermissions() {
          try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log("Media permissions granted for video:", stream);
            const videoTracks = stream.getVideoTracks();
            if (videoTracks.length > 0) {
              const userCamera = { deviceID: videoTracks[0].getSettings().deviceId };
              videoInput.srcObject = stream;
              return userCamera;
            } else {
              throw new Error("No video tracks available");
            }
          } catch (err) {
            console.error("Media permissions error:", err);
            setError(`Media permissions error: ${err.message || err}`);
            return null;
          }
        }

        async function initializeWebRtcPeer() {
          console.log("Initializing WebRtcPeer for video");
          const userCamera = await requestMediaPermissions();
          if (!userCamera) return;

          function onOffer(error, sdpOffer) {
            if (error) {
              console.error("SDP Offer Error:", error);
              setError(`SDP Offer Error: ${error.message || error}`);
              return;
            }
            console.log("Generated SDP offer for video:", sdpOffer);
            
            const message = {
              id: "start",
              type: "video",
              cameraId: buildStreamName(userCamera.deviceID),
              role: "share",
              sdpOffer: sdpOffer,
              bitrate: 200,
              record: true,
            };

            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
              console.log("Sending start message for video:", message);
              ws.current.send(JSON.stringify(message));
            } else {
              console.warn("WebSocket not open, queuing start message for video");
              messageQueue.current.push(message);
              setError("WebSocket not open, message queued");
            }
          }

          function onIceCandidate(candidate) {
            console.log("ICE candidate generated for video:", candidate);
            if (candidate && ws.current && ws.current.readyState === WebSocket.OPEN) {
              const message = {
                id: "onIceCandidate",
                candidate: candidate,
              };
              console.log("Sending ICE candidate for video:", message);
              ws.current.send(JSON.stringify(message));
            } else {
              console.warn("Cannot send ICE candidate for video, queuing or invalid");
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
            // localVideo: videoInput,
            // remoteVideo: videoOutput,
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
                console.log("WebRtcPeer initialized for video, generating offer");
                this.generateOffer(onOffer);
              }
            );

            webRtcPeer.current.peerConnection.oniceconnectionstatechange = () => {
              console.log("ICE connection state for video:", webRtcPeer.current.peerConnection.iceConnectionState);
              if (webRtcPeer.current.peerConnection.iceConnectionState === "failed") {
                console.error("ICE connection failed for video");
                setError("ICE connection failed. Check TURN server or network settings.");
              }
            };
          } catch (error) {
            console.error("Failed to create WebRtcPeer for video:", error);
            setError(`Failed to create WebRtcPeer: ${error.message || error}`);
          }
        }

        initializeWebRtcPeer();
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received WebSocket message for video:", data);

          // if (!webRtcPeer.current || !webRtcPeer.current.peer) {
          //   console.warn("WebRtcPeer not initialized for video");
          //   setError("WebRtcPeer not initialized");
          //   return;
          // }

          if (data.id === "startResponse") {
            console.log("Processing SDP answer for video:", data.sdpAnswer);
            try {
              webRtcPeer.current.processAnswer(data.sdpAnswer, (error) => {
                if (error) {
                  console.error("Error processing SDP answer for video:", error);
                  setError(`Error processing SDP answer: ${error.message || error}`);
                } else {
                  console.log("SDP answer processed successfully for video");
                }
              });
            } catch (error) {
              console.error("Exception processing SDP answer for video:", error);
              setError(`Exception processing SDP answer: ${error.message || error}`);
            }
          } else if (data.id === "iceCandidate" && data.candidate) {
            console.log("Processing ICE candidate for video:", data.candidate);
            try {
              webRtcPeer.current.peer.addIceCandidate(data.candidate, (error) => {
                if (error) {
                  console.error("Error adding ICE candidate for video:", error);
                  setError(`Error adding ICE candidate: ${error.message || error}`);
                } else {
                  console.log("ICE candidate added successfully for video");
                }
              });
            } catch (error) {
              console.error("Exception adding ICE candidate for video:", error);
              setError(`Exception adding ICE candidate: ${error.message || error}`);
            }
          } else {
            console.warn("Unexpected message received for video:", data);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message for video:", error);
          setError(`Error parsing WebSocket message: ${error.message || error}`);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket Error for video:", error);
        setError(`WebSocket Error: ${error.message || "Connection failed"}`);
        setConnected(false);
        reconnect();
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected for video");
        setConnected(false);
        cleanupWebRtcPeer();
        reconnect();
      };
    } else {
      console.log("WebSocket already exists for video, state:", ws.current.readyState);
      sendQueuedMessages();
    }
  };

  const reconnect = () => {
    console.log("Attempting WebSocket reconnection for video in 3 seconds...");
    setTimeout(() => {
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        start();
      }
    }, 3000);
  };

  const cleanupWebRtcPeer = () => {
    if (webRtcPeer.current && webRtcPeer.current.peer) {
      try {
        webRtcPeer.current.peer.dispose();
        console.log("WebRtcPeer disposed for video");
      } catch (error) {
        console.error("Error disposing WebRtcPeer for video:", error);
      }
      webRtcPeer.current = null;
    }
  };

  useEffect(() => {
    console.log("useEffect started for video");
    messageQueue.current = [];
    start();

    return () => {
      console.log("Cleaning up WebSocket and WebRtcPeer for video");
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
      cleanupWebRtcPeer();
    };
  }, []);

  return (
    <div>
      <video id="videoInput" controls autoPlay muted style={{ width: "320px", height: "240px" }}>
        Your browser does not support the video element.
      </video>
      <video id="videoOutput" controls autoPlay style={{ width: "320px", height: "240px" }}>
        Your browser does not support the video element.
      </video>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Connected: {connected ? "Yes" : "No"}</p>
    </div>
  );
};

export default Video;





// import React, { useState, useEffect, useRef } from "react";
// import kurentoUtils from "kurento-utils";

// const Video = () => {
//   const ws = useRef(null);
//   const webRtcPeer = useRef(null);
//   const messageQueue = useRef([]);
//   const [connected, setConnected] = useState(false);
//   const [error, setError] = useState(null);

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

//   const start = async () => {
//     console.log("Starting WebSocket connection for video");
//     if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
//       try {
//         ws.current = new WebSocket(
//           "wss://meet.konn3ct.ng/bbb-webrtc-sfu?sessionToken=5d5heo0vuelf0ho2"
//         );
//         console.log("WebSocket instance created for video");
//       } catch (err) {
//         console.error("WebSocket creation failed:", err);
//         setError(`WebSocket creation failed: ${err.message || err}`);
//         return;
//       }

//       ws.current.onopen = () => {
//         console.log("WebSocket connected successfully for video");
//         setConnected(true);
//         setError(null);
//         sendQueuedMessages();

//         const videoInput = document.getElementById("videoInput");
//         const videoOutput = document.getElementById("videoOutput");

//         if (!videoInput || !videoOutput) {
//           console.error("Video elements not found in DOM");
//           setError("Video elements not found");
//           return;
//         }

//         const constraints = {
//           audio: false, // Include audio for video calls
//           video: {
//             width: { ideal: 1280 },
//             height: { ideal: 720 },
//             frameRate: { ideal: 30 },
//           },
//         };

//         async function requestMediaPermissions() {
//           try {
//             const stream = await navigator.mediaDevices.getUserMedia(constraints);
//             console.log("Media permissions granted for video:", stream);
//             videoInput.srcObject = stream;
//             return true;
//           } catch (err) {
//             console.error("Media permissions error:", err);
//             setError(`Media permissions error: ${err.message || err}`);
//             return false;
//           }
//         }

//         async function initializeWebRtcPeer() {
//           console.log("Initializing WebRtcPeer for video");
//           const hasPermissions = await requestMediaPermissions();
//           if (!hasPermissions) return;

//           function onOffer(error, sdpOffer) {
//             if (error) {
//               console.error("SDP Offer Error:", error);
//               setError(`SDP Offer Error: ${error.message || error}`);
//               return;
//             }
//             console.log("Generated SDP offer for video:", sdpOffer);
            
//              const message = {
//                 id: 'start',
//                 type: 'video',
//                 cameraId: buildStreamName(userCamera.deviceID),
//                 role: 'share',
//                 sdpOffer: sdpOffer,
//                 bitrate: 200,
//                 record: true,
//               };

//             if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//               console.log("Sending start message for video:", message);
//               ws.current.send(JSON.stringify(message));
//             } else {
//               console.warn("WebSocket not open, queuing start message for video");
//               messageQueue.current.push(message);
//               setError("WebSocket not open, message queued");
//             }
//           }

// //       console.log("meetingID:", user.meetingID);
// //       console.log("internalUserID:", user.internalUserID);
// //       console.log("authToken:", user.authToken);
// //       console.log("externUserID:", user.externUserID);

// //       const buildStreamName = (deviceId) => {
// //             return `${user?.internalUserID}${user?.authToken}${deviceId}`;
// //         };
// //       const user = {
// //         meetingDetails:{
// //           internalUserID:"",
// //           authToken:"",
// //         }
// //       }

//           function onIceCandidate(candidate) {
//             console.log("ICE candidate generated for video:", candidate);
//             if (candidate && ws.current && ws.current.readyState === WebSocket.OPEN) {
//               const message = {
//                 id: "onIceCandidate",
//                 candidate: candidate,
//               };
//               console.log("Sending ICE candidate for video:", message);
//               ws.current.send(JSON.stringify(message));
//             } else {
//               console.warn("Cannot send ICE candidate for video, queuing or invalid");
//               if (candidate) messageQueue.current.push({
//                 id: "onIceCandidate",
//                 candidate: candidate,
//               });
//             }
//           }

//           function onError(error) {
//             console.error("WebRTC Error:", error);
//             setError(`WebRTC Error: ${error.message || error}`);
//           }

//           // TURN server configuration to prevent ICE failures
//           const iceServers = [
//             { urls: "stun:stun.l.google.com:19302" },
//             {
//               urls: "turn:openrelay.metered.ca:443",
//               username: "openrelay",
//               credential: "openrelay",
//             },
//           ];

//           const options = {
//             localVideo: videoInput,
//             remoteVideo: videoOutput,
//             onicecandidate: onIceCandidate,
//             mediaConstraints: constraints,
//             configuration: { iceServers },
//           };

//           try {
//             webRtcPeer.current = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(
//               options,
//               function (error) {
//                 if (error) {
//                   onError(error);
//                   return;
//                 }
//                 console.log("WebRtcPeer initialized for video, generating offer");
//                 this.generateOffer(onOffer);
//               }
//             );

//             // Monitor ICE connection state
//             webRtcPeer.current.peerConnection.oniceconnectionstatechange = () => {
//               console.log("ICE connection state for video:", webRtcPeer.current.peerConnection.iceConnectionState);
//               if (webRtcPeer.current.peerConnection.iceConnectionState === "failed") {
//                 console.error("ICE connection failed for video");
//                 setError("ICE connection failed. Check TURN server or network settings.");
//               }
//             };
//           } catch (error) {
//             console.error("Failed to create WebRtcPeer for video:", error);
//             setError(`Failed to create WebRtcPeer: ${error.message || error}`);
//           }
//         }

//         initializeWebRtcPeer();
//       };

//       ws.current.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           console.log("Received WebSocket message for video:", data);

//           if (!webRtcPeer.current || !webRtcPeer.current.peer) {
//             console.warn("WebRtcPeer not initialized for video");
//             setError("WebRtcPeer not initialized");
//             return;
//           }

//           if (data.id === "startResponse" && data.sdpAnswer) {
//             console.log("Processing SDP answer for video:", data.sdpAnswer);
//             try {
//               webRtcPeer.current.peer.processAnswer(data.sdpAnswer, (error) => {
//                 if (error) {
//                   console.error("Error processing SDP answer for video:", error);
//                   setError(`Error processing SDP answer: ${error.message || error}`);
//                 } else {
//                   console.log("SDP answer processed successfully for video");
//                 }
//               });
//             } catch (error) {
//               console.error("Exception processing SDP answer for video:", error);
//               setError(`Exception processing SDP answer: ${error.message || error}`);
//             }
//           } else if (data.id === "iceCandidate" && data.candidate) {
//             console.log("Processing ICE candidate for video:", data.candidate);
//             try {
//               webRtcPeer.current.peer.addIceCandidate(data.candidate, (error) => {
//                 if (error) {
//                   console.error("Error adding ICE candidate for video:", error);
//                   setError(`Error adding ICE candidate: ${error.message || error}`);
//                 } else {
//                   console.log("ICE candidate added successfully for video");
//                 }
//               });
//             } catch (error) {
//               console.error("Exception adding ICE candidate for video:", error);
//               setError(`Exception adding ICE candidate: ${error.message || error}`);
//             }
//           } else {
//             console.warn("Unexpected message received for video:", data);
//           }
//         } catch (error) {
//           console.error("Error parsing WebSocket message for video:", error);
//           setError(`Error parsing WebSocket message: ${error.message || error}`);
//         }
//       };

//       ws.current.onerror = (error) => {
//         console.error("WebSocket Error for video:", error);
//         setError(`WebSocket Error: ${error.message || "Connection failed"}`);
//         setConnected(false);
//         reconnect();
//       };

//       ws.current.onclose = () => {
//         console.log("WebSocket disconnected for video");
//         setConnected(false);
//         cleanupWebRtcPeer();
//         reconnect();
//       };
//     } else {
//       console.log("WebSocket already exists for video, state:", ws.current.readyState);
//       sendQueuedMessages();
//     }
//   };

//   const reconnect = () => {
//     console.log("Attempting WebSocket reconnection for video in 3 seconds...");
//     setTimeout(() => {
//       if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
//         start();
//       }
//     }, 3000);
//   };

//   const cleanupWebRtcPeer = () => {
//     if (webRtcPeer.current && webRtcPeer.current.peer) {
//       try {
//         webRtcPeer.current.peer.dispose();
//         console.log("WebRtcPeer disposed for video");
//       } catch (error) {
//         console.error("Error disposing WebRtcPeer for video:", error);
//       }
//       webRtcPeer.current = null;
//     }
//   };

//   useEffect(() => {
//     console.log("useEffect started for video");
//     messageQueue.current = [];
//     start();

//     return () => {
//       console.log("Cleaning up WebSocket and WebRtcPeer for video");
//       if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//         ws.current.close();
//       }
//       cleanupWebRtcPeer();
//     };
//   }, []);

//   return (
//     <div>
//       <video id="videoInput" controls autoPlay muted style={{ width: "320px", height: "240px" }}>
//         Your browser does not support the video element.
//       </video>
//       <video id="videoOutput" controls autoPlay style={{ width: "320px", height: "240px" }}>
//         Your browser does not support the video element.
//       </video>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <p>Connected: {connected ? "Yes" : "No"}</p>
//     </div>
//   );
// };

// export default Video;