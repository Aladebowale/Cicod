import React from "react";
import Header from "./Header";
import SemiHead from "./SemiHead"; 
import micon from "../Images/Icon/Mic-On.png"
import voff from "../Images/Icon/video-off.png"
import von from "../Images/Icon/Video On.png"
import micoff from "../Images/Icon/mic off.png"
import vector from "../Images/Icon/Vector.png" 
import Avatar1 from '../Images/ava 1.png';
import Avatar2 from '../Images/ava 2.png'; 
import Avatar3 from '../Images/ava 3.png';
import Avatar4 from '../Images/ava 4.png';
import Avatar5 from '../Images/Icon/image.png'
import Avatar6 from '../Images/Icon/avatar 6.png'
import maximize from '../Images/maximize-2.png'; 
import sound from '../Images/sound.png';
import Participant1 from '../Images/participant 1.png'
import Participant2 from '../Images/participant 2.png'
import Participant3 from '../Images/participant 3.png'
import AddUser from '../Images/user-add.png'
import Comp2 from '../Images/Icon/Component 2.png'
import Vect2 from '../Images/Icon/Vector (2).png'
import Icon2 from '../Images/Icon/Icons (2).png'
import speaker from '../Images/Speaker.png'
import slider from '../Images/Icon/Button.png'
// import Protector from '../Images/Protect.png'
import Icon from '../Images/Iconic 2.png'
import Gridone from '../Images/Frame 1707480527.png'
import Gridtwo from '../Images/Icons 3.png'
// import Recorder from '../Images/Recorder.png'
import Protector from '../Images/Protect.png'
import MIC from '../Images/Icon/microphone-slash.png'
import mic from '../Images/Icon/Mic.png'


const VideoCallUI = () => {   
  return (
<div className="flex flex-col min-h-screen w-full bg-gray-100 p-4 md:p-8 ">

    <Header />
    <SemiHead />
  
  {/* <div className="flex items-center space-x-3 justify-between bg-white p-4 shadow-md mt-1 mb-1 h-12"> */}
  <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 shadow-md mt-1 mb-1">

    <div className="flex space-x-3 items-center">
      <img src={Protector} alt="P 1" className="w-8 md:w-4 h-8 md:-4 border-2 border-white mr-8 md:mr-4" />
      <div className="flex items-center">
        <img src={Icon} alt="P 2" className="w-8 md:w-4 h-8 md:h-4 border-2 border-white" />
        <img src={Gridone} alt="P 3" className="w-6 md:w-3 h-6 md:h-3 border-2 border-white" />
        <img src={Gridtwo} alt="P 4" className="w-8 md:w-8 h-8 md:h-4 border-2 border-white" />
      </div>
    </div>

    <div className="flex items-center space-x-3"> 
      <div className="flex -space-x-2">
        <img src={Avatar1} alt="Participant 1" className="w-8 h-8 rounded-full border-2 border-white" />
        <img src={Avatar2} alt="Participant 2" className="w-8 h-8 rounded-full border-2 border-white" />
        <img src={Avatar3} alt="Participant 3" className="w-8 h-8 rounded-full border-2 border-white" />
        <img src={Avatar4} alt="Participant 4" className="w-8 h-8 rounded-full border-2 border-white" />
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E8F2EE] text-[#1E6132] 
        font-semibold text-sm border-2 border-white">+9</div>
      </div>
      <button className="bg-[#E8F2EE] text-[#1E6132] px-3 py-1 rounded-lg">Code: cem-jmnt-hsu</button>

      <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-4 py-2 shadow-sm bg-white">
      {/* Recording Icon */}
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Outer Circle */}
        <div className="absolute w-full h-full border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
        {/* Inner Circle */}
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
      </div>
      {/* Timer */}
      <span className="text-gray-700 text-sm font-medium">13:03:34</span>
    </div>

</div>
</div>

  
{/* Main Content */}
    <div className="w-full h-screen bg-white flex">
      

        {/* Main Speaker View */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">

      <div className="relative">
          <img className="w-screen h-[400px] rounded-xl object-cover" src={speaker} alt="Active Speaker" />

      <div className=" absolute top-4 left-4 flex items-center space-x-2 border border-gray-400 rounded-lg px-4 py-2 shadow-sm bg-white">
          {/* Recording Icon */}
      <div className=" w-6 h-6 flex items-center justify-center">
          {/* Outer Circle (Pulsating Effect) */}
        <div className="absolute  border-2 border-red-500 opacity-50 rounded-full animate-ping"></div>
          {/* Inner Circle */}
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
      </div>
        {/* Timer */}
        <span className="text-gray-700 text-sm font-medium">13:03:34</span>
      </div>
          
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md">Adam Joseph</div>
          <button className="absolute top-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={maximize} alt="screen size" />
            </button>
            <button className="absolute bottom-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={sound} alt="sound" />
            </button>
        </div>
           
       {/* Participants */}
        <div className="w-full max-w-4xl mt-4 grid grid-cols-4 gap-2">
          <div className="relative">
          <img className="w-full h-24 rounded-xl object-cover " src={Participant1} alt="Participant" />
          <span className="absolute bottom-2 left-4 text-xs bg-gray-800 text-white px-2 py-1 rounded-md">
            Cassie Jung
            </span>
            <button className="absolute bottom-2 right-4 text-white bg-[#EF4444] bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={MIC} alt="sound"/>
            </button>
          </div>

          <div className="relative">
          <img className="w-full h-24 rounded-xl object-cover " src={Participant2} alt="Participant" />
          <span className="absolute bottom-2 left-4 text-xs bg-gray-800 text-white px-2 py-1 rounded-md">
          Alice Wong
            </span>
            <button className="absolute bottom-2 right-4 text-white bg-[#1E6132] bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={mic} alt="sound"/>
            </button>
          </div>

          <div className="relative">
          <img className="w-full h-24 rounded-xl object-cover " src={Participant3} alt="Participant" />
          <span className="absolute bottom-2 left-4 text-xs bg-gray-800 text-white px-2 py-1 rounded-md">
          Theresa Webb
            </span>
            <button className="absolute bottom-2 right-4 text-white bg-[#1E6132] bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={mic} alt="sound"/>
            </button>
          </div>

          {/* <div className="bg-green-500 h-24 rounded-xl flex items-center justify-center text-white font-semibold">Alice Wong</div>
          <div className="bg-gray-700 h-24 rounded-xl flex items-center justify-center text-white font-semibold">Theresa Webb</div> */}
          <div className="bg-green-800 h-24 rounded-xl flex items-center justify-center text-white font-semibold">Christian Wong</div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-4xl mt-6 flex justify-between">

        <div>
        <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
        <img src={slider} alt="slider" className="w-12 h-4" />
        </div>
        </div>

        <div className="flex space-x-1">
                <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Comp2} alt="slider" className="min-w-min h-4" />
                </div>

                <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Vect2} alt="slider" className="w-4 h-4" />
                </div>

                <div className="flex items-center space-x-1 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Icon2} alt="slider" className="w-4 h-4" />
                </div>

                <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Comp2} alt="slider" className="w-4 h-4" />
                </div>

                <div className="flex items-center space-x-2 border border-gray-400 rounded-lg px-2 py-1 shadow-sm bg-white">
                <img src={Comp2} alt="slider" className="w-4 h-4" />
                </div>
        </div>
        
    

          <button className="bg-[#EF4444] text-white py-2 px-4 rounded-lg">Leave Meeting</button>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="w-80 bg-white p-4 shadow-lg h-full overflow-y-auto">
        {/* Participants Section */}
        <div>
          <div className="flex flex-row space-x-1 items-center">
          <h2 className="text-sm font-semibold">Participants (+9)</h2>
          {/* <div className="flex">
          <button className="bg-[#E8F2EE] text-[#1E6132] px-4 py-1 rounded-sm mt-2">Add Participant</button>
           
          </div> */}
          <div className="bg-green-100 text-green-700 px-4 py-1 mt-2 rounded-full space-x-2">
              <button className="  text-xs font-semibold">Add Participant</button>
              <button><img src={AddUser} alt="" width={8} /></button>    
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 p-2 border-b">
            <img src={Avatar6} alt="Participant 1" className="w-10 h-10 rounded-full border-2 border-white" />
            <div className="flex-1 flex flex-row">
                <p className="font-medium">Dianne Russell</p>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Co-Host</span>
                <img src={micon} alt="" width={15}/>
                <img src={voff} alt="" width={15} />
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 p-2 border-b">
            <img src={Avatar3} alt="Participant 1" className="w-10 h-10 rounded-full border-2 border-white" />
            <p className="flex-1 font-medium">Guy Hawkins</p>
              <img src={micoff} alt="" width={15}/>
              <img src={voff} alt="" width={15} />
            </div>
            <div className="flex flex-row items-center gap-2 p-2 border-b">
            <img src={Avatar1} alt="Participant 1" className="w-10 h-10 rounded-full border-2 border-white" />
            <p className="flex-1 font-medium">Kathryn Murphy</p>
              <img src={micoff} alt="" width={15}/>
              <img src={von} alt="" width={15} />
            </div>
          </div>
        </div>
        
        {/* Chat Section */}
        <div className="mt-6 ">
          <div className="flex flex-row items-center text-center space-x-4">
          <h2 className="text-sm font-semibold">Chats (14)</h2>
          <div className="flex gap-2 mt-2">
            <button className="flex-1 bg-[#1E6132] text-white text-xs px-2 py-1 rounded-full">Group</button>
            <button className="flex-1 bg-[#E8F2EE] text-[#1E6132] text-xs px-2 py-1 rounded-full">Personal</button>
            <button><img src={vector} alt="" width={10} /></button>
          </div>
          </div>

          
            <p className="text-xs text-gray-500 mt-4">April 12, 2024</p>

          <div className="flex flex-col">

            <div className="mt-2 flex flex-row items-center">
                    <img src={Avatar1} alt="Participant 1" className="w-10 h-10 rounded-full border-2 border-white" />
              <div className="flex flex-col">
                <div className="flex flex-row items-center space-x-4">
                  <p className="font-medium">Kathryn Murphy</p>
                  <p className="text-xs text-gray-500">11:01 AM</p>
                </div>
                <p className="bg-gray-100 p-2 rounded-lg">Good afternoon, everyone.</p>
              </div>
            </div>

            <div className="mt-2 flex flex-row items-center">
            <img src={Avatar5} alt="Participant 1" className="w-10 h-10 rounded-full border-2 border-white" />
            <div className="flex flex-col">
                <div className="flex flex-row items-center space-x-4">
                  <p className="font-medium">Joshua Abraham</p>
                  <p className="text-xs text-gray-500">11:02 AM</p>
                </div>
                <p className="bg-gray-100 p-2 rounded-lg">Yes, Let's start this meeting</p>
              </div>
            </div>

            <div className="mt-2 flex flex-row items-center">
            <img src={Avatar1} alt="Participant 1" className="w-10 h-10 rounded-full border-2 border-white" />
            <div className="flex flex-col">
                <div className="flex flex-row items-center space-x-4">
                  <p className="font-medium">Kathryn Murphy</p>
                  <p className="text-xs text-gray-500">11:01 AM</p>
                </div>
                <p className="bg-gray-100 p-2 rounded-lg">Good afternoon, everyone.</p>
              </div>
            </div>

            <div className="mt-2 flex flex-row items-center">
            <img src={Avatar5} alt="Participant 1" className="w-10 h-10 rounded-full border-2 border-white" />
              <div className="flex flex-col">
                <div className="flex flex-row items-center space-x-4">
                  <p className="font-medium">Joshua Abraham</p>
                  <p className="text-xs text-gray-500">11:02 AM</p>
                </div>
                <p className="bg-gray-100 p-2 rounded-lg">Yes, Let's start this meeting</p>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default VideoCallUI;
