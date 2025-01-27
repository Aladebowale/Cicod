import React from "react";
import Header from "./Header";
import hands from '../Images/hands.png'

const LeftSession = () => {
  return (
    <div className="h-800 bg-gray-300 flex flex-col w-800"> 

      <Header/>
      
      {/* Main Content */}
      <main className="text-center mt-16">
        <div className="flex flex-row items-center space-y-4"> 
          <img src={hands}alt="Wave"className="w-8 h-8 mr-2"/>

          <div className="flex flex-col items-center ">
                <h2 className="text-2xl font-semibold text-gray-800">
                Oops! You’ve Left the Session</h2>
                <button className="px-6 py-2 bg-[#21714B] text-white font-medium rounded hover:bg-green-700">Rejoin</button>
          </div>
        </div>
      </main>

     {/* Footer */}
     <div className="absolute bottom-4 text-green-800 items-center">
        <a href="feedback" className="hover:underline">
          Send Feedback
        </a>
      </div>
    </div>
  );
};

export default LeftSession;
