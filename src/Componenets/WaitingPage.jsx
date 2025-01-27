import React from "react";

import Header from "./Header";


const WaitingPage = () => {
  return (
    <div className="h-800 bg-white flex flex-col w-800">
      <Header/>
      {/* Main Content */}
      <div className="flex flex-col items-center text-center mt-40"> 
        <h1 className="text-x1 font-bold text-gray-900 mb-4 shadow-emerald-800">
          [Departmental Progress & Future Roadmap Session]
        </h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div>
          <span>Waiting for Host to Start. We will let you know when the Host starts the meeting.</span>
        </div> 
        <button className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Go back
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-green-800 items-center">
        <a href="feedback" className="hover:underline">
          Send Feedback
        </a>
      </div>
    </div>
  );
};

export default WaitingPage;
