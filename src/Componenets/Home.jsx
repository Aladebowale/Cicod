// import React from "react";
// // import "./App.css";
// import Header from "./Header";
// import calendar_icon from '../Images/Union.png';
// import clock_icon from '../Images/Union time.png';
// import export_icon from '../Images/Export button-icon.png';
// import contact_icon from '../Images/contact.png';
// import borderline from '../Images/Border line.png';
// import { useNavigate } from 'react-router-dom';
 

 
// const Home = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="">
//        {/* Header */}
//       <Header />

//       {/* Container */}
//     {/* <div className="container"> */}
//     <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row w-full h-screen
//  justify-center items-center mt-[70px]">

          
//           <div className="flex flex-col w-full lg:w-1/6 bg-gray-50 mr-2 lg:mr-5 py-1 box-border">
//           {/* Sidebar */}
     
//             <div className="bg-white border border-gray-300 rounded-lg shadow-md p-2 mb-2">
//             {/* Box */}
//             <div className="h-32">
//               {/* <div class="event"> */}
//                 <div class="text-xs text-gray-600 mb-1 mt-1">8:30am</div>
//                 <div class="text-base font-bold text-gray-800 mb-4">[Enhancing Agency Collaboration]</div>
//                 <img src={export_icon} alt="icon_export" width={13}></img>
//               </div>
//             </div>

//             <div className="bg-white border border-gray-300 rounded-lg shadow-md p-2 mb-2">
//             {/* Box */}
//             <div className="h-32">
//               {/* <div class="event"> */}
//                 <div class="text-xs text-gray-600 mb-1 mt-1">1:30pm</div>
//                 <div class="text-base font-bold text-gray-800 mb-4">[Streamlining Public Service Delivery]</div>
//                 <img src={export_icon} alt="icon_export" width={13}></img>
//               </div>
//             </div>

//             <div className="bg-white border border-gray-300 rounded-lg shadow-md p-2 mb-2">
//             {/* Box */}
//             <div className="h-32">
//               {/* <div class="event"> */}
//               <div className=" text-xs text-gray-600 mb-1 mt-1">3:30pm</div>
//                 <div class="text-base font-bold text-gray-800 mb-4">[Operational Strategy Planning]</div>
//                 <img src={export_icon} alt="icon_export" width={13}></img>
//               </div>
//             </div>
//           </div>
          
//       <img src={borderline} alt="line" width={2} height={350} className="ml-0 mr-4 h-[380px]"></img>
      
//       {/* <div className="meeting-card"> */}
//       <div className="bg-white rounded-lg shadow-md p-5 max-w-[900px] w-[500px] mx-auto h-[380px]">
//         <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
//           <div className="flex items-center gap-1 text-xs">
//             <img src={clock_icon} alt="icon_clock" width={13}></img>  1:30pm
//           </div>
//           <div className="flex items-center gap-1 text-xs">
//             <img src={calendar_icon} alt="icon_calendar" width={13}></img>  Tue Nov 17 2024
//           </div>
//         </div>
//         <div className="text-xl text-gray-800 mb-2">
//         <h2>[Departmental Progress & Future Roadmap Session]</h2>
//         </div>
//          <div className="text-sm text-gray-500 mb-5">
//          <p>Enter your name and email to join the meeting.</p>
//          </div>
        
//         <form className="flex flex-col">
//           <div className="border border-green-500 rounded-md py-1.5 h-10 text-sm flex justify-between 
// items-center gap-2 w-full">
//             <input
//             type="text"
//             placeholder="Enter your name e.g., Prince Derrick" 
//             className="flex-grow py-2 border-none rounded-md text-sm outline-none h-8 mt-1 ml-3 w-4/5"/>
            
//             <img height={20} width={20}
//             src={contact_icon} alt="Contact Icon"
//             className="pt-1 w-5"/>  
//           </div>
          
//           <div className="flex items-center mb-4 mt-2">
//             <input type="checkbox" id="save-name" className="mr-2" />
//             <label htmlFor="save-name" className="text-xs text-gray-600">Save my name for future meetings</label>
//           </div>

//           <div className="flex justify-between items-center gap-2 w-full mt-3"> 
//             <input
//             type="email"
//             placeholder="Enter Email Address"
//             className="flex-grow py-2 border border-gray-300 rounded-md text-sm pl-3"/>

//             <button type="submit" className="bg-green-500 text-white border-none py-2 px-4 text-sm rounded-md 
// cursor-pointer transition-colors duration-300 hover:bg-green-700" onClick={() => navigate('CApp')}>Join Meeting</button>
//           </div>
//         </form>

//           <div className="text-xs">
//             <a href="#more-info" className="text-green-600 no-underline hover:underline 
// inline-block mt-4">Learn more</a> about Conference
//           </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Home;




import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import calendar_icon from '../Images/Union.png';
import clock_icon from '../Images/Union time.png';
import export_icon from '../Images/Export button-icon.png';
import contact_icon from '../Images/contact.png'; 
import borderline from '../Images/Border line.png';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isValidating, setIsValidating] = useState(true);

  const API_URL = 'https://dev.konn3ct.ng/api/app/kv4';

  //  Validate meeting on page load
  useEffect(() => {
    const validateMeetingOnLoad = async () => {
      try {

        const response = await axios.post(API_URL +"/validate-meeting", { name: "standupmeet" });
        console.log("Meeting Validated on Load:", response.data);
      } catch (error) {
         console.error("Meeting validation failed:", error.response?.data || error.message);
        alert("Meeting is unavailable or invalid.");
      } finally {
        setIsValidating(false);
      }
    };

    validateMeetingOnLoad();
  }, []);

  //  Submit name and email
  const handleJoinMeeting = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(API_URL + "/join-room", {
        name ,
        email
      });

      console.log("Validation Success:", response.data);
      navigate('/Room1'); // Navigate on success
    } catch (error) {
      console.error("Validation Failed:", error.response?.data || error.message);
      alert("Invalid name or email. Please try again.");
    }
  };

  if (isValidating) {
    return (
      <div className="h-screen flex justify-center items-center text-lg">
        Validating meeting, please wait...
      </div>
    );
  }

  return (
    <div className="">
      <Header />

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row w-full h-screen justify-center items-center mt-[70px]">
        <div className="flex flex-col w-full lg:w-1/6 bg-gray-50 mr-2 lg:mr-5 py-1 box-border">
          {/* Sidebar */}
          {[ 
            { time: '8:30am', title: '[Enhancing Agency Collaboration]' },
            { time: '1:30pm', title: '[Streamlining Public Service Delivery]' },
            { time: '3:30pm', title: '[Operational Strategy Planning]' },
          ].map((item, index) => (
            <div key={index} className="bg-white border border-gray-300 rounded-lg shadow-md p-2 mb-2">
              <div className="h-32">
                <div className="text-xs text-gray-600 mb-1 mt-1">{item.time}</div>
                <div className="text-base font-bold text-gray-800 mb-4">{item.title}</div>
                <img src={export_icon} alt="icon_export" width={13} />
              </div>
            </div>
          ))}
        </div>

        <img src={borderline} alt="line" width={2} height={350} className="ml-0 mr-4 h-[380px]" />

        <div className="bg-white rounded-lg shadow-md p-5 max-w-[900px] w-[500px] mx-auto h-[380px]">
          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1 text-xs">
              <img src={clock_icon} alt="icon_clock" width={13} /> 1:30pm
            </div>
            <div className="flex items-center gap-1 text-xs">
              <img src={calendar_icon} alt="icon_calendar" width={13} /> Tue Nov 17 2024
            </div>
          </div>

          <div className="text-xl text-gray-800 mb-2">
            <h2>[Departmental Progress & Future Roadmap Session]</h2>
          </div>
          <div className="text-sm text-gray-500 mb-5">
            <p>Enter your name and email to join the meeting.</p>
          </div>

          <form className="flex flex-col" onSubmit={handleJoinMeeting}>
            <div className="border border-green-500 rounded-md py-1.5 h-10 text-sm flex justify-between items-center gap-2 w-full mb-3">
              <input
                type="text"
                placeholder="Enter your name e.g., Prince Derrick"
                className="flex-grow py-2 border-none rounded-md text-sm outline-none h-8 mt-1 ml-3 w-4/5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <img height={20} width={20} src={contact_icon} alt="Contact Icon" className="pt-1 w-5" />
            </div>

            <div className="flex items-center mb-4">
              <input type="checkbox" id="save-name" className="mr-2" />
              <label htmlFor="save-name" className="text-xs text-gray-600">
                Save my name for future meetings
              </label>
            </div>

            <div className="flex justify-between items-center gap-2 w-full mt-3">
              <input
                type="email"
                placeholder="Enter Email Address"
                className="flex-grow py-2 border border-gray-300 rounded-md text-sm pl-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                className="bg-green-500 text-white border-none py-2 px-4 text-sm rounded-md cursor-pointer transition-colors duration-300 hover:bg-green-700"
              >
                Join Meeting
              </button>
            </div>
          </form>

          <div className="text-xs">
            <a href="#more-info" className="text-green-600 no-underline hover:underline inline-block mt-4">
              Learn more
            </a>{" "}
            about Conference
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
