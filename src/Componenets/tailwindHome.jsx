import React from "react";
import Header from "./Header";
import maximize from '../Images/maximize-2.png'
import sound from '../Images/sound.png'
import microphone from '../Images/microphone-slash.png'
import video from '../Images/video.png'
import Avatar1 from '../Images/ava 1.png'
import Avatar2 from '../Images/ava 2.png'
import Avatar3 from '../Images/ava 3.png'
import Avatar4 from '../Images/ava 4.png'


const Page2 = () => {
  return (
    <div className="h-800 bg-gray-300 flex flex-col w-800"> 
      
      < Header/>

      {/* Main Content */} 
     <main className="flex-grow flex flex-col items-center justify-center p-6 ">
        <div className="bg-white rounded-lg shadow-lg w-1/2 h-96" >
          <div className="relative">
            <div className="bg-black rounded-lg w-full h-80 mb-1.5"></div>
            <span className="absolute bottom-4 left-4 text-sm bg-gray-800 text-white px-2 py-1 rounded-md">
              Adam Joseph
            </span>
            <button className="absolute top-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={maximize} alt="screen size" />
            </button>
            <button className="absolute bottom-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={sound} alt="sound" />
            </button>
          </div>

          {/* Controls */}
          <div className="flex w-full items-center justify-between mt-4 space-x-4 flex-row ">
           
          <input
              type="range"
              className="w-24 bg-green-500 rounded-full bg-block"/>

            <div className="items-center space-x-4 flex flex-row">
              <button className="bg-[#217148] text-white px-4 py-2 rounded-3xl">
                Join Meeting 
              </button>

              {/* Audio Control */}
              <div className="relative group">
                <button className=" text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
                <img src={microphone} alt="audio off" />
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-3 py-1 rounded">Audio Off</div>
              </div>

              {/* video Control */}
              <div className="relative group">
                <button className=" text-white bg-[#21714B] bg-opacity-70 p-2 rounded-full h-8 w-8">
                <img src={video} alt="video on"/>
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-3 py-1 rounded">Video On</div>
              </div>
</div>
          </div>
          
            <button className="text-gray-700 bg-gray-300 rounded-full h-8 w-8 text-lg flex justify-center text-center items-center">
              ⋯
            </button>
          
        </div>
            {/* Participants */}
              <div className="participants">
                <div className="avatars">
                    <img src={Avatar1} alt="Participant 1" className="avatar" />
                    <img src={Avatar2} alt="Participant 2" className="avatar" />
                    <img src={Avatar3} alt="Participant 3" className="avatar" />
                    <img src={Avatar4} alt="Participant 4" className="avatar" />
                    <div className="extra">+9</div>
                    <p className="textP">Are in this meeting</p>
                </div>
              </div>
      </main>
    </div> 
  );
};

export default Page2;
