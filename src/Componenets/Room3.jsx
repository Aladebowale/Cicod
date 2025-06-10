import React from "react";
import Header from "./Header";
import maximize from '../Images/maximize-2.png'
import sound from '../Images/sounder.png'
import microphone from '../Images/microphone-slash.png'
import video from '../Images/video.png'
import Avatar1 from '../Images/ava 1.png'
import Avatar2 from '../Images/ava 2.png'
import Avatar3 from '../Images/ava 3.png'
import Avatar4 from '../Images/ava 4.png'


const Room3 = () => {
  return (
<div className="h-screen bg-gray-100 flex flex-col w-800"> 
      
      < Header/>

      {/* Main Content */} 
    <main className="flex-grow flex flex-col items-center justify-center p-6 h-screen">
        <div className="bg-white rounded-lg shadow-lg w-1/2 h-96" >
          <div className="relative">
            <div className="bg-black rounded-lg w-full h-80"></div>
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
          <div className="flex items-center mt-1 space-x-4 p-4 rounded-lg bg-gray-100 justify-between w-full">
              
              {/* Volume Slider */}
            <input
              type="range"
              className="w-24 bg-green-500 rounded-full bg-block"/>
              
              {/* Join Meeting Button */}
            <div className="items-center space-x-4 flex flex-row">
                <button className="bg-[#217148] text-white px-4 py-2 rounded-3xl">
                  Join Meeting 
                </button>

              {/* Audio Control */}
              <div className="relative group">
                <button className=" text-white bg-[#21714B] bg-opacity-70 p-2 rounded-full h-8 w-8">
                <img src={microphone} alt="audio on" />
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block 
                bg-gray-800 text-white text-sm px-3 py-1 rounded">Audio On
                </div>
              </div>

              {/* video Control */}
              <div className="relative group">
                <button className=" text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
                <img src={video} alt="video off"/>
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden 
                group-hover:block bg-gray-800 text-white text-sm px-3 py-1 rounded">Video Off
                </div>
              </div>


            </div>
            <button className="text-gray-700 bg-gray-300 rounded-full h-8 w-8 text-lg flex justify-center 
            text-center items-center">⋯</button>

        </div>
          
          
      </div>
            {/* Participants */}
              <div className="flex items-center space-x-2 mt-4">
                <div className="flex -space-x-2">
                    <img src={Avatar1} alt="Participant 1" className="w-8 h-8 rounded-full border-2 border-white" />
                    <img src={Avatar2} alt="Participant 2" className="w-8 h-8 rounded-full border-2 border-white" />
                    <img src={Avatar3} alt="Participant 3" className="w-8 h-8 rounded-full border-2 border-white" />
                    <img src={Avatar4} alt="Participant 4" className="w-8 h-8 rounded-full border-2 border-white" />
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700 
                      font-semibold text-sm border-2 border-white">+9
                    </div>
                  </div>
                <span className="text-gray-700 text-sm">Are in this meeting</span>
              </div>
    
    </main>
</div> 

  );
};

export default Room3;
