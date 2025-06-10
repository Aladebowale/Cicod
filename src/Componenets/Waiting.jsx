import React from "react";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';


const Waiting = () => {
      const navigate = useNavigate();
  
  return (
    <div className="h-screen bg-white flex flex-col w-screen">
      
      <Header/>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
      <div className="w-64 text-center flex-col">
      <h1 className="text-x2 font-bold text-gray-900 mb-4 shadow-emerald-800">
          [Departmental Progress & Future Roadmap Session]
        </h1>
        <div className="flex flex-row items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div>
          <p className="text-xs">Waiting for Host to Start. We will let you know when the Host starts the meeting.</p>
        </div> 
        
          <button className="mt-2 px-6 py-2 bg-[#21714B] text-white rounded-full hover:bg-[#21714B] " 
            onClick={() => navigate('/Room1')}>Go back 
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-[#21714B] cursor-pointer">
        <a href="feedback" className="hover:underline" onClick={() => navigate('/Left')} >
          Send Feedback
        </a>
      </div>
    </div>
  );
};

export default Waiting;
