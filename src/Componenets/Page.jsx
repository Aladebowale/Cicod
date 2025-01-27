import React from "react";
// import "./App.css";
// import Participant from "../Images/Paticipant Names.png"
import reader from '../Images/Group 23.png'
import microphone from '../Images/microphone-slash.png'
import video from '../Images/video.png'
import Avatar1 from '../Images/ava 1.png'
import Avatar2 from '../Images/ava 2.png'
import Avatar3 from '../Images/ava 3.png'
import Avatar4 from '../Images/ava 4.png'
// import Avatar5 from '../Images/avater +9.png'



const HomePage = () => {
  return (
    <div className="meeting-container">
         {/* Video Section */}
        <div className="video-section">
            <div className="video-placeholder">
                    {/* <p className="username">Adam Joseph</p> */}
                    <input
                    type="text"
                    placeholder="Adam Joseph" 
                    className="username"/> 

                    <div>
                        <button className="Audio-btn">
                        <img src={reader} alt="reader" className="reader_icon"/>
                        </button>
                        {/* className="extra">+9 */}
                    </div>

                    {/* <img src={reader} alt="reader"
                    className="reader_icon" /> */}

                {/* <div className="Audio_Video">
                    <input 
                    type="text"
                    placeholder="Audio Off"
                    className="Audio_icon"/>

                    <input 
                    type="text"
                    placeholder="Video On"
                    className="Video_icon" />
                </div> */}
            </div>




         {/* Controls */}
                <div className="controls">
                    <button className="control-btn">Audio Off</button>
                    <button className="control-btn">Video On</button>
                </div>
        </div>

        <div>
            {/* For Join Section and audio&video */}
            <div className="join-section">
                <button className="join-btn">Join Meeting</button>
                {/* </div> */}
                <div className="Display-icons">
                    <button className="DAudio">
                        <img src="" alt="" />
                    </button>
                    <div className="DVideo"><img src="" alt="" /></div>
                    <div className=""></div>
                </div>

                {/* <div className="Audio_Video"> */}
                <button className="Audio-btn"><img src={microphone} alt="mic" /></button>
                <button className="Video-btn"><img src={video} alt="video_icon" /></button> 
                {/* </div> */}
            </div>

         

         {/* Participants */}
            <div className="participants">
                <div className="avatars">
                    <img src={Avatar1} alt="Participant 1" className="avatar" />
                    <img src={Avatar2} alt="Participant 2" className="avatar" />
                    <img src={Avatar3} alt="Participant 3" className="avatar" />
                    <img src={Avatar4} alt="Participant 4" className="avatar" />
                    <div className="extra">+9</div>
                    <p>Are in this meeting</p>
                </div>
            </div>
        </div>
    </div>
  ); 
};

export default HomePage;
