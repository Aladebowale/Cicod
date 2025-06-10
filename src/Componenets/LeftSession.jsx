import React from "react";
import Header from "./Header";
import hands from '../Images/hands.png'
import { useNavigate } from 'react-router-dom';


const LeftSession = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-white flex flex-col w-screen"> 

      <Header/>
      
      {/* Main Content */}
      <main className="  text-center flex-grow flex flex-col items-center justify-center p-6 h-screen">
        <div className="flex flex-row items-center space-y-4 w-60 "> 
          <img src={hands}alt="Wave"className="w-8 h-8 mr-2"/>

          <div className="flex-inline flex-col items-center  ">
                <h2 className="text-2xl font-semibold text-gray-800">
                Oops! You've Left the Session</h2>
                <button className="px-6 py-2 bg-[#21714B] text-white mt-2 font-medium rounded-full hover:bg-green-700" onClick={() => navigate('/')}>Rejoin</button>
          </div>
        </div>
      </main>

     {/* Footer */}
     <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-[#21714B] cursor-pointer">
        <a href="feedback" className="hover:underline">
          Send Feedback
        </a>
      </div>
    </div>
  );
};

export default LeftSession;
