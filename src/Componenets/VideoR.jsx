import Header from "./Header";
import SemiHead from "./SemiHead";
import Avatar1 from '../Images/ava 1.png';
// import Avatar2 from '../Images/ava 2.png';
// import Avatar3 from '../Images/ava 3.png';
// import Avatar4 from '../Images/ava 4.png';
import maximize from '../Images/maximize-2.png';
import sound from '../Images/sound.png';
// import speaker from '../Images/Speaker.png'
import Participant1 from '../Images/participant 1.png'
// import Protector from '../Images/Protect.png'
// import Icon from '../Images/Iconic 2.png'
// import Gridone from '../Images/Grid Viewer.png'
// import Gridtwo from '../Images/Grid View.png'
// import Recorder from '../Images/Recorder.png'


export default function VideoConference() { 
    return (
      <div className="flex flex-col h-screen bg-gray-100 p-4">

        <Header />
        <SemiHead />

        {/* Header */}

        {/* <div className="flex justify-between items-center bg-white p-4 h-3 shadow-md mt-1">
          <h2 className="text-lg font-semibold">[Internal] Weekly Report Marketing + Sales</h2>
          <p className="text-sm">Wed Jul 17 2024</p>
        </div>

        

        <div className="flex items-center space-x-3 justify-between bg-white p-4 shadow-md mt-1 h-12">

                  <div className="flex -space-x-1">
                    <img src={Protector} alt="P 1" className="w-8 h-8 border-2 border-white" />
                    <img src={Icon} alt="P 2" className="w-8 h-8 border-2 border-white" />
                    <img src={Gridone} alt="P 3" className="w-10 h-10 border-2 border-white" />
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
          </div> */}
  
        {/* Main Content */}
        <div className="flex flex-grow mt-4 space-x-4">
          {/* Video Section */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-4 relative">
            {/* <div className="relative">
              <img className="w-full h-[400px] rounded-xl object-cover" src="https://via.placeholder.com/600" alt="Active Speaker" />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md">Adam Joseph</div>
            </div> */}
            <div className="relative">
            <div className="bg-black bg-cover bg-centre rounded-lg w-full h-80"></div>
            <span className="absolute bottom-4 left-4 text-sm bg-green-800 text-white px-2 py-1 rounded-md">
              Adam Joseph
            </span>
            <button className="absolute top-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={maximize} alt="screen size" />
            </button>
            <button className="absolute bottom-4 right-4 text-white bg-gray-700 bg-opacity-70 p-2 rounded-full h-8 w-8">
              <img src={sound} alt="sound" />
            </button>
          </div>
  
            {/* Participants in Small Grid */}
            <div className="flex space-x-2 mt-4">
              <img className="w-16 h-16 rounded-lg object-cover" src={Participant1} alt="Participant" />
              <img className="w-16 h-16 rounded-lg object-cover" src="https://via.placeholder.com/60" alt="Participant" />
              <img className="w-16 h-16 rounded-lg object-cover" src="https://via.placeholder.com/60" alt="Participant" />
              <img className="w-16 h-16 rounded-lg object-cover" src="https://via.placeholder.com/60" alt="Participant" />
            </div>
          </div>
  
          {/* Sidebar: Participants & Chat */}
          <div className="w-1/3 flex flex-col space-y-4">
            {/* Participants List */}
            <div className="bg-white rounded-2xl shadow-md p-4">
              <h3 className="text-md font-semibold mb-2">Participants (+9)</h3>
              <div className="space-y-2">
                <div className="flex flex-row space-x-2 items-center justify-between">
                  <span>Dianne Russell</span> 
                  <img src={Avatar1} alt="Participant 1" className="w-8 h-8 rounded-full border-2 border-white" />
                  <span className="text-green-500 text-xs">Host</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Guy Hawkins</span> <button className="text-sm text-blue-500">Mute</button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Kathryn Murphy</span> <button className="text-sm text-blue-500">Mute</button>
                </div>
              </div>
            </div>
  
            {/* Chat Panel */}
            <div className="bg-white rounded-2xl shadow-md p-4 flex-1 flex flex-col">
              <h3 className="text-md font-semibold mb-2">Chats (14)</h3>
              <div className="overflow-y-auto flex-1 space-y-2">
                <div className="bg-gray-200 p-2 rounded-md">Good afternoon, everyone.</div>
                <div className="bg-gray-200 p-2 rounded-md">We will start this meeting</div>
                <div className="bg-gray-200 p-2 rounded-md">Yes, let's start this meeting.</div>
              </div>
              <input type="text" placeholder="Type something..." className="mt-2 p-2 w-full border rounded-lg" />
            </div>
          </div>
        </div>
  
        {/* Bottom Controls */}
        <div className="mt-4 flex justify-center space-x-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Leave Meeting</button>
          {/* <button className="bg-gray-500 text-white px-4 py-2 rounded-lg">Mute</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg">Stop Video</button> */}
        </div>
      </div>
    );
  }
  