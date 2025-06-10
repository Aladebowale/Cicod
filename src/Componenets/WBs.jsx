import React, { useEffect, useState } from "react";
// import WebSocket from "ws";

const WebSocketComponent = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // To Establish WebSocket connection
    const ws = new WebSocket("wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket");

    ws.onopen = () => {
      console.log("Connected to CICOD-Konn3ct WebSocket");

      // Sending messages one after the other
      const messagesToSend = [
        `[{"msg":"connect","version":"1","support":["1","pre2","pre1"]}]`,
        ["{\"msg\":\"sub\",\"id\":\"HPXQc9DtAAZF7KgIN\",\"name\":\"meteor_autoupdate_clientVersions\",\"params\":[]}"],
        ["{\"msg\":\"method\",\"id\":\"1\",\"method\":\"userChangedLocalSettings\",\"params\":[{\"application\":{\"animations\":true,\"chatAudioAlerts\":false,\"chatPushAlerts\":false,\"userJoinAudioAlerts\":false,\"userJoinPushAlerts\":false,\"userLeaveAudioAlerts\":false,\"userLeavePushAlerts\":false,\"raiseHandAudioAlerts\":true,\"raiseHandPushAlerts\":true,\"guestWaitingAudioAlerts\":true,\"guestWaitingPushAlerts\":true,\"paginationEnabled\":true,\"pushLayoutToEveryone\":false,\"fallbackLocale\":\"en\",\"overrideLocale\":null,\"locale\":\"en-US\"},\"audio\":{\"inputDeviceId\":\"undefined\",\"outputDeviceId\":\"undefined\"},\"dataSaving\":{\"viewParticipantsWebcams\":true,\"viewScreenshare\":true}}]}"]
      
        // JSON.stringify({
        //   msg: "sub",
        //   id: "HPXQc9DtAAZF7KgIN",
        //   name: "meteor_autoupdate_clientVersions",
        //   params: [],
        // }),
        // JSON.stringify({
        //   msg: "method",
        //   id: "1",
        //   method: "userChangedLocalSettings",
        //   params: [
        //     {
        //       application: {
        //         animations: true,
        //         chatAudioAlerts: false,
        //         chatPushAlerts: false,
        //         userJoinAudioAlerts: false,
        //         userJoinPushAlerts: false,
        //         userLeaveAudioAlerts: false,
        //         userLeavePushAlerts: false,
        //         raiseHandAudioAlerts: true,
        //         raiseHandPushAlerts: true,
        //         guestWaitingAudioAlerts: true,
        //         guestWaitingPushAlerts: true,
        //         paginationEnabled: true,
        //         pushLayoutToEveryone: false,
        //         fallbackLocale: "en",
        //         overrideLocale: null,
        //         locale: "en-US",
        //       },
        //       audio: {
        //         inputDeviceId: "undefined",
        //         outputDeviceId: "undefined",
        //       },
        //       dataSaving: {
        //         viewParticipantsWebcams: true,
        //         viewScreenshare: true,
        //       },
        //     },
        //   ],
        // }),
      ];
          ws.send(JSON.stringify(
            ["{\"msg\":\"connect\",\"version\":\"1\",\"support\":[\"1\",\"pre2\",\"pre1\"]}"]
          ));
        ws.send(JSON.stringify(["{\"msg\":\"sub\",\"id\":\"HPXQc9DtAAZF7KgIN\",\"name\":\"meteor_autoupdate_clientVersions\",\"params\":[]}"]));
        ws.send(JSON.stringify(["{\"msg\":\"method\",\"id\":\"1\",\"method\":\"userChangedLocalSettings\",\"params\":[{\"application\":{\"animations\":true,\"chatAudioAlerts\":false,\"chatPushAlerts\":false,\"userJoinAudioAlerts\":false,\"userJoinPushAlerts\":false,\"userLeaveAudioAlerts\":false,\"userLeavePushAlerts\":false,\"raiseHandAudioAlerts\":true,\"raiseHandPushAlerts\":true,\"guestWaitingAudioAlerts\":true,\"guestWaitingPushAlerts\":true,\"paginationEnabled\":true,\"pushLayoutToEveryone\":false,\"fallbackLocale\":\"en\",\"overrideLocale\":null,\"locale\":\"en-US\"},\"audio\":{\"inputDeviceId\":\"undefined\",\"outputDeviceId\":\"undefined\"},\"dataSaving\":{\"viewParticipantsWebcams\":true,\"viewScreenshare\":true}}]}"]));

      // Send messages sequentially
    //   messagesToSend.forEach((msg, index) => {
    //     setTimeout(() => {
    //       ws.send(msg);
    //       console.log("Sent:", msg);
    //     }, index * 1000); // Send messages with a delay to avoid race conditions
    //   });
    };

    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="container mt-4">
      <h2>CICOD-Konn3ct WebSocket</h2>
      <ul className="list-group mt-3">
        {messages.map((msg, index) => (
          <li key={index} className="list-group-item">{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;
