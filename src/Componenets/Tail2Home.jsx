import React from "react";
import maximize from '../Images/maximize-2.png'
import sounder from '../Images/sounder.png'
import microphone from '../Images/microphone-slash.png'
import video from '../Images/video.png'
import Avatar1 from '../Images/ava 1.png'
import Avatar2 from '../Images/ava 2.png'
import Avatar3 from '../Images/ava 3.png'
import Avatar4 from '../Images/ava 4.png'
import Header from "./Header";

const Home2Tail = () => {
  
   
  return (
    <div className="min-h-screen bg-red flex flex-col">
      {/* Header */}

      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 ">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl" >
          <div className="relative">
            <div className="bg-black rounded-lg h-64 w-full mb-1.5"></div>
            <span className="absolute bottom-4 left-4 text-sm bg-gray-800 text-white px-2 py-1 rounded-md">
              Adam Joseph
            </span>
            <button className="absolute top-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={maximize} alt="screen size" />
            </button>
            <button className="absolute bottom-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={sounder} alt="sounder" />
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center mt-4 space-x-4 ">
            <input
              type="range"
              className="w-24 bg-green-500"/>

              
            <div className="flex items-center space-x-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg" >Join Meeting</button>
              <button className=" text-white bg-[#21714B] bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={microphone} alt="audio off" /></button>
              <button className=" text-white bg-[#21714B] bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={video} alt="video on"/></button>
            </div>
            <button className="text-gray-700 bg-gray-100 p-2 rounded-full h-8 w-8 absolite right-4 text-lg">⋯</button>
          </div> 
        </div>

        {/* Participants */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div >
              <img src={Avatar1} alt="Participant 1"
              className="w-8 h-8 rounded-full"/> 
            </div>
            <div >
              <img src={Avatar2} alt="Participant 2"
              className="w-8 h-8 rounded-full mx-1.25 -ml-0.5"/> 
            </div>
            <div >
              <img src={Avatar3} alt="Participant 3"
              className="w-8 h-8 rounded-full"/> 
            </div>
            <div >
              <img src={Avatar4} alt="Participant 4"
              className="w-8 h-8 rounded-full"/> 
            </div>
            <div className="text-[#1E6132] text-lg bg-gray-200 rounded-full w-8 h-8">+9</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Are in this meeting</p>
        </div>
      </main>
    </div> 
  );
};

export default Home2Tail;
