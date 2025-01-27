import React from "react";
import logo from '../src/Images/Frame 1707480519.png'
import bell from '../src/Images/Frame 1768.png'
import frame from '../src/Images/Frame 1707480527.png'

const ConferencePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-yellow shadow-md p-15 20 h-30">
        <div className="flex items-center">
          <img src={logo}alt="Logo"className="w-8 h-8 mr-2"/>
          <span className="text-xl font-bold">Conference</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-white text-lg bg-green-600 rounded-full w-8 h-8">?</button>
          <button className="text-gray-500 text-lg w-6 h-6" >
            <img src={bell} alt="bell" /> </button>
          <button className="text-gray-500 text-lg w-6 h-6">
            <img src={frame} alt="frame" /> </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
              J
            </div>
            <span className="text-gray-700 font-medium">James Oluwale</span>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">[Departmental Progress & Future Roadmap Session]</h1>
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin h-5 w-5 border-4 border-gray-300 border-t-green-500 rounded-full mr-2"></div>
          <p className="text-gray-600">Waiting for Host to Start. We will let you know when the Host starts the meeting.</p>
        </div>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
          Go back
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-gray-500">
        <a href="feedback responce" className="hover:underline">
          Send Feedback
        </a>
      </div>

      {/* User Info */}
      {/* <div className="absolute top-4 right-4 flex items-center">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-green-500">
          J
        </div>
        <span className="ml-2 text-gray-700">James Oluwale</span>
      </div> */}
    </div>
  );
};

export default ConferencePage;
