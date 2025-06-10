import React from "react";
// import Header from "./Header"; 
import micon from "../Images/Icon/Mic-On.png"
import voff from "../Images/Icon/video-off.png"
import von from "../Images/Icon/Video On.png"
import micoff from "../Images/Icon/mic off.png"
import vector from "../Images/Icon/Vector.png"
import Avatar1 from '../Images/ava 1.png';
// import Avatar2 from '../Images/ava 2.png';
import Avatar3 from '../Images/ava 3.png';
// import Avatar4 from '../Images/ava 4.png';
import Avatar5 from '../Images/Icon/image.png'
import Avatar6 from '../Images/Icon/avatar 6.png'
import Rec1 from '../Images/Rectangle 1.png'
import Rec2 from '../Images/Rectangle 2.png'
import Rec3 from '../Images/Rectangle 3.png'
import Rec4 from '../Images/Rectangle 4.png'
import Rec5 from '../Images/Rectangle 5.png'
import Rec6 from '../Images/Rectangle 6.png'
import Rec7 from '../Images/Rectangle 7.png'
import Rec8 from '../Images/Rectangle 8.png'
import Rec9 from '../Images/Rectangle 9.png'
import Rec10 from '../Images/Rectangle 10.png'
import Rec11 from '../Images/Rectangle 11.png'
import Rec12 from '../Images/Rectangle 12.png'
import Rec13 from '../Images/Rectangle 13.png'
import Rec14 from '../Images/Rectangle 14.png'
import Rec15 from '../Images/Rectangle 15.png'
import Rec16 from '../Images/Rectangle 16.png'
import FRAME from '../Images/Frame 904.png'
import AddUser from '../Images/user-add.png'
// import slider from '../Images/Icon/Button.png'
// import Avatar1 from '../Images/ava 1.png';
import Avatar2 from '../Images/ava 2.png';
// import Avatar3 from '../Images/ava 3.png';
import Avatar4 from '../Images/ava 4.png';
import Protector from '../Images/Protect.png'
import Icon from '../Images/Iconic 2.png'
import Gridone from '../Images/Frame 1707480527.png'
import Gridtwo from '../Images/Icons 3.png'
import Recorder from '../Images/Recorder.png'
 
const VideoCallUII = () => {
  return (
<div className="flex flex-col h-screen w-screen bg-gray-100 p-4">

    {/* <Header /> */}
{/* <Header /> */}
<div className="flex items-center space-x-3 justify-between bg-white p-4 shadow-md mt-1 mb-1 h-12">

<div className="flex -space-x-1 items-center">
  <img src={Protector} alt="P 1" className="w-8 h-8 border-2 border-white mr-8" />
  <img src={Icon} alt="P 2" className="w-8 h-8 border-2 border-white" />
  <img src={Gridone} alt="P 3" className="w-6 h-6 border-2 border-white" />
  <img src={Gridtwo} alt="P 4" className="w-8 h-8 border-2 border-white" />
</div>

<div className="flex items-center space-x-3"> 
<div className="flex -space-x-2">
  <img src={Avatar1} alt="Participant 1" className="w-8 h-8 rounded-full border-2 border-white" />
  <img src={Avatar2} alt="Participant 2" className="w-8 h-8 rounded-full border-2 border-white" />
  <img src={Avatar3} alt="Participant 3" className="w-8 h-8 rounded-full border-2 border-white" />
  <img src={Avatar4} alt="Participant 4" className="w-8 h-8 rounded-full border-2 border-white" />
  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700 
    font-semibold text-sm border-2 border-white">+9</div>
</div>
<button className="bg-green-500 text-white px-3 py-1 rounded-lg">Code: cem-jmnt-hsu</button>
<img src={Recorder} alt="P 4" className="w-16 h-8 border-2 border-white" />
</div>
</div>
{/* Main Content */}
    <div className="w-full h-screen bg-white flex justify-between">
      

        {/* Main Speaker View */}
        <div className="grid grid-cols-5 gap-1 rounded-full ">
          <div className="relative">
      <img src={Rec1} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
        {/* <div className="relative p-4 rounded-lg text-white text-center h-40 flex flex-col justify-center items-center"> */}
        <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
        </div>
        <div className="relative">
      <img src={Rec2} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
        </div>

        <div className="relative">
      <img src={Rec3} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
        </div>

        <div className="relative">
      <img src={Rec4} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
        </div>
        <div className="relative">
      <img src={Rec5} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
        </div>
        <div className="relative">
      <img src={Rec6} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
        </div>
        <div className="relative">
      <img src={Rec7} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
        </div>
        <div className="relative">
      <img src={Rec8} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
        </div>
        <div className="relative">
      <img src={Rec9} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
        </div>
        <div className="relative">
      <img src={Rec10} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
        </div>
        <div className="relative">
      <img src={Rec11} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
        </div>
        <div className="relative">
      <img src={Rec12} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
        </div>
        <div className="relative">
      <img src={Rec13} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
      </div>
        <div className="relative">
      <img src={Rec14} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
      </div>
        <div className="relative">
      <img src={Rec15} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex 
      flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
      </div>
        <div className="relative">
      <img src={Rec16} alt="Participant 1" className=" h-32 border-2 border-white relative rounded-lg flex flex-col justify-center items-center" />
      <button className="absolute bottom-1 right-0 mr-0.5 rounded-full h-8 w-8"><img src={FRAME} alt="sound" /></button>
      </div>
      </div>

       
      {/* Sidebar */}
      <div className="w-80 bg-white p-4 shadow-lg h-full overflow-y-auto">

        {/* Participants Section */}
        <div>
          <div className="flex flex-row space-x-2 items-center text-center">
            <h2 className="text-sm font-semibold ">Participants (+9)</h2>
            <div className="bg-green-100 text-green-700 px-4 py-1 mt-2 rounded-full space-x-2">
              <button className="  text-xs font-semibold">Add Participant</button>
              <button><img src={AddUser} alt="" width={8} /></button>    
            </div>
            <button><img src={vector} alt="" width={10} /></button>
          </div>
          <div className="mt-4 bg-gray-200">
            <div className="flex items-center gap-2 p-2 border-b rounded-full bg-white">
              <img src={Avatar6} alt="Participant 1" className="w-8 h-8 rounded-full border-2 border-white" />
              <div className="flex-1 flex flex-row">
                <p className="font-medium text-sm">Dianne Russell</p>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Co-Host</span>
                <img src={micon} alt="" width={15}/>
                <img src={voff} alt="" width={15} />
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 p-2 border-b">
                <img src={Avatar3} alt="Participant 1" className="w-10 h-10 rounded-full border-2 border-white" />
                <p className="flex-1 font-medium text-sm">Guy Hawkins</p>
                <img src={micoff} alt="" width={15}/>
                <img src={voff} alt="" width={15} />
            </div>
            <div className="flex flex-row items-center gap-2 p-2 border-b">
                <img src={Avatar1} alt="Participant 1" className="w-10 h-10 rounded-full border-2 border-white" />
                <p className="flex-1 font-medium text-sm">Kathryn Murphy</p>
                <img src={micoff} alt="" width={15}/>
                <img src={von} alt="" width={15} />
            </div>
          </div>
        </div>
        
        {/* Chat Section */}
        <div className="mt-2 ">
          <div className="flex flex-row items-center text-center space-x-4">
          <h2 className="text-sm font-semibold">Chats</h2>
          <div className="flex mt-2 ">
            <button className="flex-1 bg-green-700 text-white text-xs px-2 py-1 rounded-full w-24">Group</button>
            <button className="flex-1 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full w-28">Personal</button>
          </div>
          <button><img src={vector} alt="" width={10} /></button>
          </div>

          <div className="flex flex-col">
              <div className="mt-2 flex flex-row items-center">
                <img src={Avatar1} alt="Participant 1" className="w-10 h-10 rounded-full border-2 border-white" />
                <div className="flex flex-row">
                  <div className="flex flex-col items-baseline">
                    <div className="flex flex-col items-baseline space-x-2 bg-gray-100 rounded-lg">
                      <p className="font-light text-xs">Kathryn Murphy</p>
                      <p className="font-medium text-xs p-1">Good afternoon, everyone.</p>
                    </div>
                    <div>
                      <p className="font-medium text-xs bg-gray-100 rounded-lg mt-2 p-2">We will start this meeting</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">11:01 AM</p>
                </div>
              </div>

              <div className="mt-2 flex flex-row items-center">
                <img src={Avatar5} alt="Participant 1" className="w-10 h-10 rounded-full border-2 border-white" />
                <div className="flex flex-row ">
                    <div className="flex flex-col items-baseline space-x-2 bg-gray-100 rounded-lg">
                      <p className="font-light text-xs">Joshua Abraham</p>
                      <p className="font-medium text-xs p-1">Yes, Let's start this meeting</p>
                    </div>
                  <p className="text-xs text-gray-500">11:02 AM</p>
                </div>
              </div>

              <div className="mt-2 flex flex-row items-center">
                <img src={Avatar1} alt="Participant 1" className="w-10 h-10 rounded-full border-2 border-white" />
                <div className="flex flex-row">
                    <div className="flex flex-col items-baseline space-x-2 bg-gray-100 rounded-lg">
                      <p className="font-light text-xs">Kathryn Murphy</p>
                      <p className="font-medium text-xs p-1">Today, We are to discuss last week sales.</p>
                    </div>
                  <p className="text-xs text-gray-500">11:04 AM</p>
                </div>
              </div>

              <div className="mt-2 flex flex-row items-center">
                <img src={Avatar5} alt="Participant 1" className="w-10 h-10 rounded-full border-2 border-white" />
                <div className="flex flex-row">
                    <div className="flex flex-col items-baseline space-x-2 bg-gray-100 rounded-lg">
                      <p className="font-light text-xs">Joshua Abraham</p>
                      <p className="font-medium text-xs p-1">Yes, Let's start this meeting</p>
                    </div>
                  <p className="text-xs text-gray-500">11:06 AM</p>
                </div>
              </div>

       
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default VideoCallUII;
