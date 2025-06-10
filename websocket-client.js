const socket = new WebSocket('wss://meet.konn3ct.ng/html5client/sockjs/548/elzm5u2t/websocket');
socket.onopen = () => {
  console.log('WebSocket connection established.');
  const messages = [
    // '{"msg":"connect","version":"1","support":["1","pre2","pre1"]}',
    ["{\"msg\":\"connect\",\"version\":\"1\",\"support\":[\"1\",\"pre2\",\"pre1\"]}"],

    // '{"msg":"sub","id":"HPXQc9DtAAZF7KgIN","name":"meteor_autoupdate_clientVersions","params":[]}',
    ["{\"msg\":\"sub\",\"id\":\"HPXQc9DtAAZF7KgIN\",\"name\":\"meteor_autoupdate_clientVersions\",\"params\":[]}"],

    // '{"msg":"method","id":"1","method":"userChangedLocalSettings","params":[{"application":{"animations":true,"chatAudioAlerts":false,"chatPushAlerts":false,"userJoinAudioAlerts":false,"userJoinPushAlerts":false,"userLeaveAudioAlerts":false,"userLeavePushAlerts":false,"raiseHandAudioAlerts":true,"raiseHandPushAlerts":true,"guestWaitingAudioAlerts":true,"guestWaitingPushAlerts":true,"paginationEnabled":true,"pushLayoutToEveryone":false,"fallbackLocale":"en","overrideLocale":null,"locale":"en-US"},"audio":{"inputDeviceId":"undefined","outputDeviceId":"undefined"},"dataSaving":{"viewParticipantsWebcams":true,"viewScreenshare":true}}]}',
    ["{\"msg\":\"method\",\"id\":\"1\",\"method\":\"userChangedLocalSettings\",\"params\":[{\"application\":{\"animations\":true,\"chatAudioAlerts\":false,\"chatPushAlerts\":false,\"userJoinAudioAlerts\":false,\"userJoinPushAlerts\":false,\"userLeaveAudioAlerts\":false,\"userLeavePushAlerts\":false,\"raiseHandAudioAlerts\":true,\"raiseHandPushAlerts\":true,\"guestWaitingAudioAlerts\":true,\"guestWaitingPushAlerts\":true,\"paginationEnabled\":true,\"pushLayoutToEveryone\":false,\"fallbackLocale\":\"en\",\"overrideLocale\":null,\"locale\":\"en-US\"},\"audio\":{\"inputDeviceId\":\"undefined\",\"outputDeviceId\":\"undefined\"},\"dataSaving\":{\"viewParticipantsWebcams\":true,\"viewScreenshare\":true}}]}"]
  ];
  messages.forEach((message, index) => {
    setTimeout(() => {
      socket.send(message);
      console.log(`Sent message ${index + 1}:`, message);
    }, index * 1000); 
  });
};
socket.onmessage = (event) => {
  console.log('Message from server:', event.data);
};
socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};
socket.onclose = () => {
  console.log('WebSocket connection closed.');
};