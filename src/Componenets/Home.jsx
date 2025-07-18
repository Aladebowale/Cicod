import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import calendar_icon from '../Images/Union.png';
import clock_icon from '../Images/Union time.png';
import export_icon from '../Images/Export button-icon.png';
import contact_icon from '../Images/contact.png'; 
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isValidating, setIsValidating] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const API_URL = 'https://dev.konn3ct.ng/api/app/kv4';
  const { url } = useParams();

  useEffect(() => {
    const validateMeetingOnLoad = async () => {
      try {
        const response = await axios.post(`${API_URL}/validate-meeting`, { name: url });
        console.log("Meeting Validated:", response.data);
        setApiResponse(response.data);

        const simulatedMeetings = [
          { id: "1", time: "8:30am", title: "[Operational Strategy Planning]", date: "Tue Nov 17 2024" },
          { id: "2", time: "9:30am", title: "[Streamlining Public Service Delivery]", date: "Tue Nov 17 2024" },
          { id: "3", time: "10:30am", title: "[Enhancing Agency Collaboration]", date: "Tue Nov 17 2024" },
          { id: "4", time: "11:30am", title: "[Departmental Progress & Future Roadmap Session]", date: "Tue Nov 17 2024" },
          { id: "5", time: "12:30pm", title: "[StandUp Meeting]", date: "Tue Nov 17 2024" },
        ];
        setMeetings(simulatedMeetings);

        if (location.pathname === '/Room/standupmeet') {
          const standupMeeting = simulatedMeetings.find(m => m.title === '[StandUp Meeting]');
          if (standupMeeting) {
            setSelectedMeeting(standupMeeting);
          } else {
            setError("StandUp Meeting not found.");
          }
        } else if (simulatedMeetings.length > 0) {
          setSelectedMeeting(simulatedMeetings[0]);
        }
      } catch (error) {
        console.error("Meeting validation failed:", error.response?.data || error.message);
        setError("Meeting is unavailable or invalid.");
      } finally {
        setIsValidating(false);
      }
    };

    validateMeetingOnLoad();
  }, [location.pathname, url]);

  const handleJoinMeeting = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/join-room`, {
        name,
        email,
        room: url,
      });
      console.log("Join Success:", response.data);
      navigate('/Room1', { state: { meeting: response.data } });
      
    } catch (error) {
      console.error("Join Failed:", error.response?.data || error.message);
      setError("Invalid name or email. Please try again.");
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row w-full max-w-4xl justify-center items-center mt-[48px] sm:mt-[56px]">
        {/* Sidebar: Meeting List */}
        <div className="w-full lg:w-1/4 bg-gray-50 py-4 box-border">
          <div className="bg-white border border-green-600 rounded-lg shadow-md p-4 h-[400px] overflow-y-auto">
            {meetings.map((item, index) => (
              <div
                key={index}
                className={`h-32 mb-2 last:mb-0 bg-white border border-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-100 ${selectedMeeting?.title === item.title ? 'bg-green-50' : ''}`}
                onClick={() => setSelectedMeeting(item)}
              >
                <div className="text-xs text-gray-600 mb-1 mt-1">{item.time}</div>
                <div className="text-sm font-bold text-gray-800 mb-1">{item.title}</div>
                <img src={export_icon} alt="Export" width={13} />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 mt-4 lg:mt-0 lg:ml-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          {selectedMeeting ? (
            <div className="bg-white rounded-lg shadow-md p-5 h-[380px]">
              <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1 text-xs">
                  <img src={clock_icon} alt="Clock" width={13} /> {selectedMeeting.time}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <img src={calendar_icon} alt="Calendar" width={13} /> {selectedMeeting.date}
                </div>
              </div>

              <div className="text-xl font-bold text-gray-800 mb-2">
                {apiResponse ? (
                <h2>{apiResponse.data.name}</h2>
                 ) : (
                  <p>Meeting not available.</p>
                )}
                
              </div>
              {/* Display API Response */}
              <div className="text-sm text-gray-600 mb-4">
                {apiResponse ? (
                  <p><strong>Meeting Status:</strong> {apiResponse.message || JSON.stringify(apiResponse)}</p>
                ) : (
                  <p>No meeting status available.</p>
                )}
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
                  <img height={20} width={20} src={contact_icon} alt="Contact" className="pt-1 w-5" />
                </div>

                <div className="flex items-center mb-4">
                  <input type="checkbox" id="save-name" className="mr-2" />
                  <label htmlFor="save-name" className="text-xs text-gray-600">
                    Save my name for future meetings
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 w-full mt-3">
                  <input
                    type="email"
                    placeholder="Enter Email Address"
                    className="flex-grow py-2 border border-gray-300 rounded-md text-sm pl-3 mb-2 sm:mb-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white border-none py-2 px-4 text-sm rounded-md cursor-pointer transition-colors duration-300 hover:bg-green-600"
                  >
                    Join Meeting
                  </button>
                </div>
              </form>

              <div className="text-xs mt-4">
                <a href="#more-info" className="text-green-600 no-underline hover:underline">
                  Learn more
                </a>{" "}
                about Conference
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">Select a meeting</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Header from "./Header";
// import calendar_icon from '../Images/Union.png';
// import clock_icon from '../Images/Union time.png';
// import export_icon from '../Images/Export button-icon.png';
// import contact_icon from '../Images/contact.png'; 
// import { useNavigate, useLocation, useParams} from 'react-router-dom';

// const Home = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [isValidating, setIsValidating] = useState(true);
//   const [meetings, setMeetings] = useState([]);
//   const [selectedMeeting, setSelectedMeeting] = useState(null);
//   const [error, setError] = useState(null);
//   const [apiResponse, setApiResponse] = useState(null);

//   const API_URL = 'https://dev.konn3ct.ng/api/app/kv4';

//   const {url} = useParams();

//   useEffect(() => {
   
//     const validateMeetingOnLoad = async () => {
//       try {
//         const response = await axios.post(`${API_URL}/validate-meeting`, { name: url });
//         console.log("Meeting Validated:", response.data);
//         setApiResponse(response.data)

        
//         const simulatedMeetings = [
//           { id: "1",time: "8:30am", title: "[Operational Strategy Planning]", date: "Tue Nov 17 2024" },
//           { id: "2",time: "9:30am", title: "[Streamlining Public Service Delivery]", date: "Tue Nov 17 2024" },
//           { id: "3",time: "10:30am", title: "[Enhancing Agency Collaboration]", date: "Tue Nov 17 2024" },
//           {id: "4", time: "11:30am", title: "[Departmental Progress & Future Roadmap Session]", date: "Tue Nov 17 2024" },
//           { id: "5",time: "12:30pm", title: "[StandUp Meeting]", date: "Tue Nov 17 2024" },
//         ];
//         setMeetings(simulatedMeetings);

        
//         if (location.pathname === '/Room/standupmeet') {
//           const standupMeeting = simulatedMeetings.find(m => m.title === '[StandUp Meeting]');
//           if (standupMeeting) {
//             setSelectedMeeting(standupMeeting);
//           } else {
//             setError("StandUp Meeting not found.");
//           }
//         } else if (simulatedMeetings.length > 0) {
//           setSelectedMeeting(simulatedMeetings[0]);
//         }
//       } catch (error) {
//         console.error("Meeting validation failed:", error.response?.data || error.message);
//         setError("Meeting is unavailable or invalid.");
//       } finally {
//         setIsValidating(false);
//       }
//     };

//     validateMeetingOnLoad();
//   }, [location.pathname]);

//   const handleJoinMeeting = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const response = await axios.post(`${API_URL}/join-room`, {
//         name,
//         email,
//         meeting: selectedMeeting?.title,
//       });
//       console.log("Join Success:", response.data);
//       navigate('/Room1', { state: { meeting: selectedMeeting } });
//     } catch (error) {
//       console.error("Join Failed:", error.response?.data || error.message);
//       setError("Invalid name or email. Please try again.");
//     }
//   };

//   if (isValidating) {
//     return (
//       <div className="h-screen flex justify-center items-center text-lg">
//         Validating meeting, please wait...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row w-full max-w-4xl justify-center items-center mt-[48px] sm:mt-[56px]">
//         <div className="w-full lg:w-1/4 bg-gray-50 py-4 box-border">
//           <div className="bg-white border border-green-600 rounded-lg shadow-md p-4 h-[400px] overflow-y-auto">
//             {meetings.map((item, index) => (
//               <div
//                 key={index}
//                 className={`h-32 mb-2 last:mb-0 bg-white border border-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-100 ${selectedMeeting?.title === item.title ? 'bg-green-50' : ''}`}
//                 onClick={(meeting) => setSelectedMeeting(item)}
//               >
//                 <div className="text-xs text-gray-600 mb-1 mt-1">{item.time}</div>
//                 <div className="text-sm font-bold text-gray-800 mb-1">{item.title}</div>
//                 <img src={export_icon} alt="Export" width={13} />
              
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="w-full lg:w-3/4 mt-4 lg:mt-0 lg:ml-4">
//           {error && (
//             <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
//               {error}
//             </div>
//           )}
//           {selectedMeeting ? (
//             <div className="bg-white rounded-lg shadow-md p-5 h-[380px]">
//               <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
//                 <div className="flex items-center gap-1 text-xs">
//                   <img src={clock_icon} alt="Clock" width={13} /> {selectedMeeting.time}
//                 </div>
//                 <div className="flex items-center gap-1 text-xs">
//                   <img src={calendar_icon} alt="Calendar" width={13} /> {selectedMeeting.date}
//                 </div>
//               </div>

//               <div className="text-xl font-bold text-gray-800 mb-2">
//                 <h2>{apiResponse.data}</h2>
//               </div>
//               <div className="text-sm text-gray-500 mb-5">
//                 <p>Enter your name and email to join the meeting.</p>
//               </div>

//               <form className="flex flex-col" onSubmit={handleJoinMeeting}>
//                 <div className="border border-green-500 rounded-md py-1.5 h-10 text-sm flex justify-between items-center gap-2 w-full mb-3">
//                   <input
//                     type="text"
//                     placeholder="Enter your name e.g., Prince Derrick"
//                     className="flex-grow py-2 border-none rounded-md text-sm outline-none h-8 mt-1 ml-3 w-4/5"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                   />
//                   <img height={20} width={20} src={contact_icon} alt="Contact" className="pt-1 w-5" />
//                 </div>

//                 <div className="flex items-center mb-4">
//                   <input type="checkbox" id="save-name" className="mr-2" />
//                   <label htmlFor="save-name" className="text-xs text-gray-600">
//                     Save my name for future meetings
//                   </label>
//                 </div>

//                 <div className="flex flex-col sm:flex-row justify-between items-center gap-2 w-full mt-3">
//                   <input
//                     type="email"
//                     placeholder="Enter Email Address"
//                     className="flex-grow py-2 border border-gray-300 rounded-md text-sm pl-3 mb-2 sm:mb-0"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                   <button
//                     type="submit"
//                     className="bg-green-500 text-white border-none py-2 px-4 text-sm rounded-md cursor-pointer transition-colors duration-300 hover:bg-green-600"
//                   >
//                     Join Meeting
//                   </button>
//                 </div>
//               </form>

//               <div className="text-xs mt-4">
//                 <a href="#more-info" className="text-green-600 no-underline hover:underline">
//                   Learn more
//                 </a>{" "}
//                 about Conference
//               </div>
//             </div>
//           ) : (
//             <div className="text-center text-gray-500">Select a meeting</div>
//           )}
//         </div>
//       </div>
//      </div>
   
//   );
// };

// export default Home;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Header from "./Header";
// import calendar_icon from '../Images/Union.png';
// import clock_icon from '../Images/Union time.png';
// import export_icon from '../Images/Export button-icon.png';
// import contact_icon from '../Images/contact.png'; 
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [isValidating, setIsValidating] = useState(true);
//   const [meetings, setMeetings] = useState([]);
//   const [selectedMeeting, setSelectedMeeting] = useState(null);

//   const API_URL = 'https://dev.konn3ct.ng/api/app/kv4';

//   // Validate meeting on page load
//   useEffect(() => {
//     const validateMeetingOnLoad = async () => {
//       try {
//         const response = await axios.post(API_URL + "/validate-meeting", { name: "standupmeet" });
//         console.log("Meeting Validated on Load:", response.data);
//       } catch (error) {
//         console.error("Meeting validation failed:", error.response?.data || error.message);
//         alert("Meeting is unavailable or invalid.");
//       } finally {
//         setIsValidating(false);
//       }
//     };

//     validateMeetingOnLoad();

    
//     const simulatedMeetings = Array.from({ length: 10 }, (_, i) => {
//       const titles = [
//         "[Operational Strategy Planning]",
//         "[Streamlining Public Service Delivery]",
//         "[Enhancing Agency Collaboration]",
//         "[Enhancing Agency Collaboration]",
//         "[Departmental Progress & Future Roadmap Session]",
//         `[StandUp Meeting]`,
//         `[Sample Topic]`,
//         `[Meeting 8]`,
//         `[Meeting 9]`,
//         `[Meeting 10]`,
//       ];
//       return {
//         time: `${8 + Math.floor(i / 2)}:30${i % 2 === 0 ? 'am' : 'pm'}`,
//         title: titles[i] || `[Meeting ${i + 1} - Sample Topic]`,
//         date: "Tue Nov 17 2024",
//       };
//     });
//     setMeetings(simulatedMeetings);
//     // Set the first meeting as default
//     if (simulatedMeetings.length > 0) {
//       setSelectedMeeting(simulatedMeetings[0]);
//     }
//   }, []);

//   // Submit name and email
//   const handleJoinMeeting = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(API_URL + "/join-room", {
//         name,
//         email
//       });

//       console.log("Validation Success:", response.data);
//       navigate('/Room1'); // Navigate on success
//     } catch (error) {
//       console.error("Validation Failed:", error.response?.data || error.message);
//       alert("Invalid name or email. Please try again.");
//     }
//   };

//   if (isValidating) {
//     return (
//       <div className="h-screen flex justify-center items-center text-lg">
//         Validating meeting, please wait...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen ">
//       <Header />

//       <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row w-full max-w-4xl justify-center items-center mt-[70px]">
//         {/* Sidebar */}
//         <div className="w-full lg:w-1/6 bg-gray-50 mr-0 py-1 box-border">
//           <div className="bg-white border border-green-600 rounded-lg shadow-md p-2 mb-2 h-[400px] overflow-y-auto">
//             {meetings.map((item, index) => (
//               <div
//                 key={index}
//                 className="h-32 mb-2 last:mb-0 bg-white border border-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-100"
//                 onClick={() => setSelectedMeeting(item)}
//               >
//                 <div className="text-xs text-gray-600 mb-1 mt-1">{item.time}</div>
//                 <div className="text-sm font-bold text-gray-800 mb-1">{item.title}</div>
//                 <img src={export_icon} alt="icon_export" width={13} />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="w-full lg:w-[500px] mx-auto mt-4 lg:mt-0 lg:ml-2">
//           {selectedMeeting ? (
//             <div className="bg-white rounded-lg shadow-md p-5 h-[380px]">
//               <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
//                 <div className="flex items-center gap-1 text-xs">
//                   <img src={clock_icon} alt="icon_clock" width={13} /> {selectedMeeting.time}
//                 </div>
//                 <div className="flex items-center gap-1 text-xs">
//                   <img src={calendar_icon} alt="icon_calendar" width={13} /> {selectedMeeting.date}
//                 </div>
//               </div>

//               <div className="text-xl text-gray-800 mb-2">
//                 <h2>{selectedMeeting.title}</h2>
//               </div>
//               <div className="text-sm text-gray-500 mb-5">
//                 <p>Enter your name and email to join the meeting.</p>
//               </div>

//               <form className="flex flex-col" onSubmit={handleJoinMeeting}>
//                 <div className="border border-green-500 rounded-md py-1.5 h-10 text-sm flex justify-between items-center gap-2 w-full mb-3">
//                   <input
//                     type="text"
//                     placeholder="Enter your name e.g., Prince Derrick"
//                     className="flex-grow py-2 border-none rounded-md text-sm outline-none h-8 mt-1 ml-3 w-4/5"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                   />
//                   <img height={20} width={20} src={contact_icon} alt="Contact Icon" className="pt-1 w-5" />
//                 </div>

//                 <div className="flex items-center mb-4">
//                   <input type="checkbox" id="save-name" className="mr-2" />
//                   <label htmlFor="save-name" className="text-xs text-gray-600">
//                     Save my name for future meetings
//                   </label>
//                 </div>

//                 <div className="flex justify-between items-center gap-2 w-full mt-3">
//                   <input
//                     type="email"
//                     placeholder="Enter Email Address"
//                     className="flex-grow py-2 border border-gray-300 rounded-md text-sm pl-3"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />

//                   <button
//                     type="submit"
//                     className="bg-green-500 text-white border-none py-2 px-4 text-sm rounded-md cursor-pointer transition-colors duration-300 hover:bg-green-700"
//                   >
//                     Join Meeting
//                   </button>
//                 </div>
//               </form>

//               <div className="text-xs">
//                 <a href="#more-info" className="text-green-600 no-underline hover:underline inline-block mt-4">
//                   Learn more
//                 </a>{" "}
//                 about Conference
//               </div>
//             </div>
//           ) : (
//             <div className="text-center text-gray-500">Select a meeting</div>)}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Header from "./Header";
// import calendar_icon from '../Images/Union.png';
// import clock_icon from '../Images/Union time.png';
// import export_icon from '../Images/Export button-icon.png';
// import contact_icon from '../Images/contact.png'; 
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [isValidating, setIsValidating] = useState(true);
//   const [meetings, setMeetings] = useState([]);
//   const [selectedMeeting, setSelectedMeeting] = useState(null);

//   const API_URL = 'https://dev.konn3ct.ng/api/app/kv4';

//   // Validate meeting on page load
//   useEffect(() => {
//     const validateMeetingOnLoad = async () => {
//       try {
//         const response = await axios.post(API_URL + "/validate-meeting", { name: "standupmeet" });
//         console.log("Meeting Validated on Load:", response.data);
//       } catch (error) {
//         console.error("Meeting validation failed:", error.response?.data || error.message);
//         alert("Meeting is unavailable or invalid.");
//       } finally {
//         setIsValidating(false);
//       }
//     };

//     validateMeetingOnLoad();

//     // Simulate fetching meetings (replace with real API call)
//     const simulatedMeetings = Array.from({ length: 10 }, (_, i) => ({
//       time: `${8 + Math.floor(i / 2)}:30${i % 2 === 0 ? 'am' : 'pm'}`,
//       title: `[Meeting ${i + 1} - Sample Topic]`,
//       date: "Tue Nov 17 2024",
//     }));
//     setMeetings(simulatedMeetings);
//     // Set the first meeting as default
//     if (simulatedMeetings.length > 0) {
//       setSelectedMeeting(simulatedMeetings[0]);
//     }
//   }, []);

//   // Submit name and email
//   const handleJoinMeeting = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(API_URL + "/join-room", {
//         name,
//         email
//       });

//       console.log("Validation Success:", response.data);
//       navigate('/Room1'); // Navigate on success
//     } catch (error) {
//       console.error("Validation Failed:", error.response?.data || error.message);
//       alert("Invalid name or email. Please try again.");
//     }
//   };

//   if (isValidating) {
//     return (
//       <div className="h-screen flex justify-center items-center text-lg">
//         Validating meeting, please wait...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       <Header />

//       <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row w-full justify-center items-start mt-[70px]">
//         {/* Sidebar */}
//         <div className="w-full lg:w-1/6 bg-gray-50 mr-0 py-1 box-border">
//           <div className="bg-white border border-gray-300 rounded-lg shadow-md p-2 mb-2 h-[400px] overflow-y-auto">
//             {meetings.map((item, index) => (
//               <div
//                 key={index}
//                 className="h-32 mb-2 last:mb-0 bg-white border border-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-100"
//                 onClick={() => setSelectedMeeting(item)}
//               >
//                 <div className="text-xs text-gray-600 mb-1 mt-1">{item.time}</div>
//                 <div className="text-base font-bold text-gray-800 mb-4">{item.title}</div>
//                 <img src={export_icon} alt="icon_export" width={13} />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="w-full lg:w-[500px] mx-auto mt-4 lg:mt-0 lg:ml-2">
//           {selectedMeeting ? (
//             <div className="bg-white rounded-lg shadow-md p-5 h-[380px]">
//               <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
//                 <div className="flex items-center gap-1 text-xs">
//                   <img src={clock_icon} alt="icon_clock" width={13} /> {selectedMeeting.time}
//                 </div>
//                 <div className="flex items-center gap-1 text-xs">
//                   <img src={calendar_icon} alt="icon_calendar" width={13} /> {selectedMeeting.date}
//                 </div>
//               </div>

//               <div className="text-xl text-gray-800 mb-2">
//                 <h2>{selectedMeeting.title}</h2>
//               </div>
//               <div className="text-sm text-gray-500 mb-5">
//                 <p>Enter your name and email to join the meeting.</p>
//               </div>

//               <form className="flex flex-col" onSubmit={handleJoinMeeting}>
//                 <div className="border border-green-500 rounded-md py-1.5 h-10 text-sm flex justify-between items-center gap-2 w-full mb-3">
//                   <input
//                     type="text"
//                     placeholder="Enter your name e.g., Prince Derrick"
//                     className="flex-grow py-2 border-none rounded-md text-sm outline-none h-8 mt-1 ml-3 w-4/5"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                   />
//                   <img height={20} width={20} src={contact_icon} alt="Contact Icon" className="pt-1 w-5" />
//                 </div>

//                 <div className="flex items-center mb-4">
//                   <input type="checkbox" id="save-name" className="mr-2" />
//                   <label htmlFor="save-name" className="text-xs text-gray-600">
//                     Save my name for future meetings
//                   </label>
//                 </div>

//                 <div className="flex justify-between items-center gap-2 w-full mt-3">
//                   <input
//                     type="email"
//                     placeholder="Enter Email Address"
//                     className="flex-grow py-2 border border-gray-300 rounded-md text-sm pl-3"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />

//                   <button
//                     type="submit"
//                     className="bg-green-500 text-white border-none py-2 px-4 text-sm rounded-md cursor-pointer transition-colors duration-300 hover:bg-green-700"
//                   >
//                     Join Meeting
//                   </button>
//                 </div>
//               </form>

//               <div className="text-xs">
//                 <a href="#more-info" className="text-green-600 no-underline hover:underline inline-block mt-4">
//                   Learn more
//                 </a>{" "}
//                 about Conference
//               </div>
//             </div>
//           ) : (
//             <div className="text-center text-gray-500">Select a meeting from the sidebar to begin.</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;







// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Header from "./Header";
// import calendar_icon from '../Images/Union.png';
// import clock_icon from '../Images/Union time.png';
// import export_icon from '../Images/Export button-icon.png';
// import contact_icon from '../Images/contact.png'; 
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [isValidating, setIsValidating] = useState(true);
//   const [meetings, setMeetings] = useState([]);
//   const [selectedMeeting, setSelectedMeeting] = useState(null);

//   const API_URL = 'https://dev.konn3ct.ng/api/app/kv4';

//   // Validate meeting on page load
//   useEffect(() => {
//     const validateMeetingOnLoad = async () => {
//       try {
//         const response = await axios.post(API_URL + "/validate-meeting", { name: "standupmeet" });
//         console.log("Meeting Validated on Load:", response.data);
//       } catch (error) {
//         console.error("Meeting validation failed:", error.response?.data || error.message);
//         alert("Meeting is unavailable or invalid.");
//       } finally {
//         setIsValidating(false);
//       }
//     };

//     validateMeetingOnLoad();

//     // Simulate fetching meetings (replace with real API call)
//     const simulatedMeetings = Array.from({ length: 10 }, (_, i) => ({
//       time: `${8 + Math.floor(i / 2)}:30${i % 2 === 0 ? 'am' : 'pm'}`,
//       title: `[Meeting ${i + 1} - Sample Topic]`,
//       date: "Tue Nov 17 2024",
//     }));
//     setMeetings(simulatedMeetings);
//   }, []);

//   // Submit name and email
//   const handleJoinMeeting = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(API_URL + "/join-room", {
//         name,
//         email
//       });

//       console.log("Validation Success:", response.data);
//       navigate('/Room1'); // Navigate on success
//     } catch (error) {
//       console.error("Validation Failed:", error.response?.data || error.message);
//       alert("Invalid name or email. Please try again.");
//     }
//   };

//   if (isValidating) {
//     return (
//       <div className="h-screen flex justify-center items-center text-lg">
//         Validating meeting, please wait...
//       </div>
//     );
//   }

//   return (
//     <div className="">
//       <Header />

//       <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row w-full h-screen justify-center items-center mt-[70px]">
//         <div className="flex flex-col w-full lg:w-1/6 bg-gray-50 mr-0 py-1 box-border">
//           {/* Scrollable Sidebar */}
//           <div className="bg-white border border-gray-300 rounded-lg shadow-md p-2 mb-2 h-[400px] overflow-y-auto">
//             {meetings.map((item, index) => (
//               <div
//                 key={index}
//                 className="h-32 mb-2 last:mb-0 bg-white border border-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-100"
//                 onClick={() => setSelectedMeeting(item)}
//               >
//                 <div className="text-xs text-gray-600 mb-1 mt-1">{item.time}</div>
//                 <div className="text-base font-bold text-gray-800 mb-4">{item.title}</div>
//                 <img src={export_icon} alt="icon_export" width={13} />
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-5 max-w-[900px] w-[500px] mx-auto h-[380px]">
//           {selectedMeeting ? (
//             <>
//               <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
//                 <div className="flex items-center gap-1 text-xs">
//                   <img src={clock_icon} alt="icon_clock" width={13} /> {selectedMeeting.time}
//                 </div>
//                 <div className="flex items-center gap-1 text-xs">
//                   <img src={calendar_icon} alt="icon_calendar" width={13} /> {selectedMeeting.date}
//                 </div>
//               </div>

//               <div className="text-xl text-gray-800 mb-2">
//                 <h2>{selectedMeeting.title}</h2>
//               </div>
//               <div className="text-sm text-gray-500 mb-5">
//                 <p>Enter your name and email to join the meeting.</p>
//               </div>

//               <form className="flex flex-col" onSubmit={handleJoinMeeting}>
//                 <div className="border border-green-500 rounded-md py-1.5 h-10 text-sm flex justify-between items-center gap-2 w-full mb-3">
//                   <input
//                     type="text"
//                     placeholder="Enter your name e.g., Prince Derrick"
//                     className="flex-grow py-2 border-none rounded-md text-sm outline-none h-8 mt-1 ml-3 w-4/5"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                   />
//                   <img height={20} width={20} src={contact_icon} alt="Contact Icon" className="pt-1 w-5" />
//                 </div>

//                 <div className="flex items-center mb-4">
//                   <input type="checkbox" id="save-name" className="mr-2" />
//                   <label htmlFor="save-name" className="text-xs text-gray-600">
//                     Save my name for future meetings
//                   </label>
//                 </div>

//                 <div className="flex justify-between items-center gap-2 w-full mt-3">
//                   <input
//                     type="email"
//                     placeholder="Enter Email Address"
//                     className="flex-grow py-2 border border-gray-300 rounded-md text-sm pl-3"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />

//                   <button
//                     type="submit"
//                     className="bg-green-500 text-white border-none py-2 px-4 text-sm rounded-md cursor-pointer transition-colors duration-300 hover:bg-green-700"
//                   >
//                     Join Meeting
//                   </button>
//                 </div>
//               </form>

//               <div className="text-xs">
//                 <a href="#more-info" className="text-green-600 no-underline hover:underline inline-block mt-4">
//                   Learn more
//                 </a>{" "}
//                 about Conference
//               </div>
//             </>
//           ) : (
//             <div className="text-center text-gray-500">Select a meeting from the sidebar to begin.</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;



