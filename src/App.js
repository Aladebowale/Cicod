import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "../src/Componenets/Home";
import "./App.css";
import Room1 from "./Componenets/Room1"
import Room2 from "./Componenets/Room2"
import Waiting from "./Componenets/Waiting"
import Room3 from "./Componenets/Room3"
import Room4 from "./Componenets/Room4"
import LeftSession from "./Componenets/LeftSession";
// import VideoConference from "./Componenets/VideoR";
import VideoCallUI from "./Componenets/VideoBody";
// import VideoCallUII from "../src/Componenets/VideoCall"
// import MeetingDashboard from "../src/Componenets/Edit"

import CApp from "./Componenets/CAxios"
import AxiosCicod from "./Componenets/CicodAxios"
// import AxiosSD from "./Componenets/AxiosPreD"
import WebSocketComponent from "./Componenets/AxiosWBs"
import WebSocketIntegration from "./Componenets/check"
import EWeb from "./Componenets/Edit"


// import WebSocketComponent from "./Componenets/WBs"
import VWeb from "./Componenets/VWeb"



const App = () => {
  return (
    <div>
       <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/Room1' element={<Room1/>}/> 
          <Route path='/Room2' element={<Room2/>}/>
          <Route path='/Waiting' element={<Waiting/>}/>
          <Route path='/Room3' element={<Room3/>}/>
          <Route path='/Room4' element={<Room4/>}/>
          <Route path='/Left' element={<LeftSession/>}/>
          <Route path='/VCUI' element={<VideoCallUI />}/>

          <Route path='/Axios' element={<AxiosCicod/>}/>
          <Route path='/CApp' element={<CApp/>}/>
          {/* <Route path='/AxiosSD' element={<AxiosPreD/>}/> */}
          <Route path='/AxiosWBs' element={<WebSocketComponent/>}/>
          <Route path='/WebSocketIntegration' element={<WebSocketIntegration/>}/>

          <Route path='/WBs' element={<WebSocketComponent/>}/>
          <Route path='/VWeb' element={<VWeb/>}/>

          <Route path='/EWeb' element={<EWeb/>}/>

          {/* <Route path='/VWebinar' element={<VWebinar/>}/> */}
         </Routes>
       </Router> 

      {/* <VideoConference/>  */}
      {/* <VideoCallUI /> */}
      {/* <VideoCallUII/> */}
      {/* <MeetingDashboard/> */}
   
    </div>
  );
};

export default App;
 