import React, { useState, useEffect, useRef } from "react";
import kurentoUtils from "kurento-utils";

const Audio = () => {
  const ws = useRef(null);
  const webRtcPeer = useRef(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const start = () => {
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
      ws.current = new WebSocket(
        `wss://meet.konn3ct.ng/bbb-webrtc-sfu?sessionToken=${user.sessionToken}`
      );

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setConnected(true);
        setError(null);

        const audioInput = document.getElementById("audioInput");
        const audioOutput = document.getElementById("audioOutput");

        const constraints = {
          audio: true,
          video: false,
        };

        function onOffer(error, sdpOffer) {
          if (error) {
            console.error("SDP Offer Error:", error);
            setError(`SDP Offer Error: ${error.message || error}`);
            return;
          }
          console.info("Generated SDP offer:", sdpOffer);
          const message = {
            id: "start",
            type: "audio",
            role: "sendrecv",
            clientSessionNumber: 2,
            sdpOffer: sdpOffer,
            extension: null,
            transparentListenOnly: false,
          };
          if (ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
            console.log("Sent start message:", message);
          } else {
            console.warn("WebSocket not open, cannot send start message");
            setError("WebSocket not open");
          }
        }

        function onIceCandidate(candidate) {
          if (candidate && ws.current.readyState === WebSocket.OPEN) {
            const message = {
              id: "onIceCandidate",
              candidate: candidate,
            };
            ws.current.send(JSON.stringify(message));
            console.log("Sent ICE candidate:", candidate);
          }
        }

        function onError(error) {
          console.error("WebRTC Error:", error);
          setError(`WebRTC Error: ${error.message || error}`);
        }

        const options = {
          // localVideo: audioInput, // Changed to audioInput for clarity
          // remoteVideo: audioOutput, // Changed to audioOutput for clarity
          onicecandidate: onIceCandidate,
          mediaConstraints: constraints,
        };

        try {
          webRtcPeer.current = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(
            options,
            function (error) {
              if (error) {
                onError(error);
                return;
              }
              this.generateOffer(onOffer);
            }
          );
        } catch (error) {
          console.error("Failed to create WebRtcPeer:", error);
          setError(`Failed to create WebRtcPeer: ${error.message || error}`);
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received message:", data);

          // if (!webRtcPeer.current || !webRtcPeer.current.peer) {
          //   console.warn("WebRTC peer not initialized");
          //   setError("WebRTC peer not initialized");
          //   return;
          // }
          console.log("New Data:", data.id)

          if (data.id === "startResponse") {
            console.log("Processing SDP answer:", data.sdpAnswer);
            try {
              webRtcPeer.current.processAnswer(data.sdpAnswer, (error) => {
                if (error) {
                  console.error("Error processing SDP answer:", error);
                  setError(`Error processing SDP answer: ${error.message || error}`);
                } else {
                  console.log("SDP answer processed successfully");
                }
              });
            } catch (error) {
              console.error("Exception processing SDP answer:", error);
              setError(`Exception processing SDP answer: ${error.message || error}`);
            }
          } else if (data.id === "iceCandidate" && data.candidate) {
            try {
              webRtcPeer.current.peer.addIceCandidate(data.candidate, (error) => {
                if (error) {
                  console.error("Error adding ICE candidate:", error);
                  setError(`Error adding ICE candidate: ${error.message || error}`);
                } else {
                  console.log("ICE candidate added successfully");
                }
              });
            } catch (error) {
              console.error("Exception adding ICE candidate:", error);
              setError(`Exception adding ICE candidate: ${error.message || error}`);
            }
          } else {
            console.warn("Unexpected message received:", data);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          setError(`Error parsing WebSocket message: ${error.message || error}`);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
        setError(`WebSocket Error: ${error.message || "Connection failed"}`);
        setConnected(false);
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
        setConnected(false);
        cleanupWebRtcPeer();
      };
    }
  };

  const cleanupWebRtcPeer = () => {
    if (webRtcPeer.current && webRtcPeer.current.peer) {
      try {
        webRtcPeer.current.peer.dispose();
        console.log("WebRtcPeer disposed");
      } catch (error) {
        console.error("Error disposing WebRtcPeer:", error);
      }
      webRtcPeer.current = null;
    }
  };

  useEffect(() => {
    console.log("useEffect started");
    start();

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
        console.log("WebSocket closed in cleanup");
      }
      cleanupWebRtcPeer();
    };
  }, []);

  return (
    <div>
      <audio id="audioInput" controls autoPlay>
        Your browser does not support the audio element.
      </audio>
      <audio id="audioOutput" controls autoPlay>
        Your browser does not support the audio element.
      </audio>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Connected: {connected ? "Yes" : "No"}</p>
    </div>
  );
};

export default Audio;