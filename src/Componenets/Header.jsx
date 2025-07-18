import { useState } from 'react';
import logo from "../Images/Frame 1707480519.png"
import bell from '../Images/Frame 1768.png'
import dropdown from '../Images/dropdown.png'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-3 bg-white shadow-md h-12 sm:h-14 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 mr-2"/>
          <span className="text-lg sm:text-xl font-bold">Conference</span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Hamburger Menu Button for Mobile */}
          <button 
            className="sm:hidden w-6 h-6 flex flex-col justify-center items-center space-y-1" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="w-5 h-0.5 bg-gray-700"></span>
            <span className="w-5 h-0.5 bg-gray-700"></span>
            <span className="w-5 h-0.5 bg-gray-700"></span>
          </button>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
            <button className="text-base sm:text-lg rounded-full w-6 h-6 sm:w-8 sm:h-8 bg-white text-[#1E6132] font-semibold border-4 border-[#E8F2EE] flex items-center justify-center">?</button>
            <button className="text-gray-500 text-base sm:text-lg w-5 h-5 sm:w-6 sm:h-6">
              <img src={bell} alt="Notifications" />
            </button>
            <div className="flex flex-row items-center space-x-1 sm:space-x-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#E8F2EE] text-[#1E6132] rounded-full flex items-center justify-center text-base sm:text-lg font-semibold">J</div>
              <span className="text-gray-700 font-medium text-sm sm:text-base">James Oluwale</span>
              <button className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1">
                <img src={dropdown} alt="Dropdown" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu (visible when hamburger is clicked) */}
      {isMenuOpen && (
        <div className="sm:hidden fixed top-12 left-0 right-0 bg-white shadow-md z-40 p-4">
          <div className="flex flex-col space-y-2">
            <button className="text-base rounded-full w-6 h-6 bg-white text-[#1E6132] font-semibold border-4 border-[#E8F2EE] flex items-center justify-center">?</button>
            <button className="text-gray-500 text-base w-5 h-5">
              <img src={bell} alt="Notifications" />
            </button>
            <div className="flex flex-row items-center space-x-1">
              <div className="w-5 h-5 bg-[#E8F2EE] text-[#1E6132] rounded-full flex items-center justify-center text-base font-semibold">J</div>
              <span className="text-gray-700 font-medium text-sm">James Oluwale</span>
              <button className="w-1.5 h-1.5 mt-1">
                <img src={dropdown} alt="Dropdown" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from being hidden under the fixed header */}
      <div className="h-12 sm:h-14"></div>
    </div>
  );
};

export default Header;




// import logo from "../Images/Frame 1707480519.png"
// import bell from '../Images/Frame 1768.png'
// import frame from '../Images/Frame 1707480527.png'
// import dropdown from '../Images/dropdown.png'

// const Header = () => {
//     return (
//       <div> 
//         {/* Header */}
//         <header className="flex justify-between items-center px-4 sm:px-6 py-3 bg-white shadow-md h-12 sm:h-14 fixed top-0 left-0 right-0 z-50">
//           <div className="flex items-center">
//             <img src={logo} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 mr-2"/>
//             <span className="text-lg sm:text-xl font-bold">Conference</span>
//           </div>
          
//           <div className="flex items-center space-x-2 sm:space-x-4">
//             <button className="text-base sm:text-lg rounded-full w-6 h-6 sm:w-8 sm:h-8 bg-white text-[#1E6132] font-semibold border-4 border-[#E8F2EE] p-0">?</button>
//             <button className="text-gray-500 text-base sm:text-lg w-5 h-5 sm:w-6 sm:h-6">
//               <img src={bell} alt="bell" />
//             </button>
//             <button className="text-gray-500 text-base sm:text-lg w-5 h-5 sm:w-6 sm:h-6">
//               <img src={frame} alt="frame" />
//             </button>
  
//             <div className="flex flex-row items-center space-x-1 sm:space-x-2">
//               <form className="flex flex-row p-1 sm:p-2 rounded-3xl shadow-md items-center space-x-1 border-[#DDE2E5] border-2">
//                 <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#E8F2EE] text-[#1E6132] rounded-full flex items-center justify-center text-base sm:text-lg font-semibold">J</div>
//                 <span className="text-gray-700 font-medium text-sm sm:text-base">James Oluwale</span>
//                 <button className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1">
//                   <img src={dropdown} alt="DD" />
//                 </button>
//               </form>
//             </div>
//           </div>
//         </header>
//         <div className="h-12 sm:h-14"></div>
//       </div>
//     );
// };

// export default Header;




// import logo from "../Images/Frame 1707480519.png"
// import bell from '../Images/Frame 1768.png'
// import frame from '../Images/Frame 1707480527.png'
// import dropdown from '../Images/dropdown.png'


// const Header = () => {
//     return (
//       <div> 
//         {/* Header */}
//         <header className="flex justify-between items-center px-6 py-4 bg-yellow shadow-md p-15 20 h-14 bg-white">
//           <div className="flex items-center">
//             <img src={logo}alt="Logo"className="w-8 h-8 mr-2"/>
//             <span className="text-xl md:text-l font-bold">Conference</span>
//           </div>
          
//           <div className="flex items-center space-x-4">
//           <button className=" text-lg rounded-full w-8 h-8  bg-white text-[#1E6132]  font-semibold border-4 border-[#E8F2EE] p-0">?</button>
//           <button className="text-gray-500 text-lg w-6  h-6" >
//               <img src={bell} alt="bell" /> </button>
//             <button className="text-gray-500 text-lg  w-6 h-6">
//               <img src={frame} alt="frame" /> </button>
  
//             <div className="flex flex-row items-center space-x-2 ">
//               <form className="flex flex-row p-2 rounded-3xl shadow-md items-center space-x-1 border-[#DDE2E5] border-2">
//               <div className=" w-6 h-6 bg-[#E8F2EE] text-[#1E6132] rounded-full flex items-center justify-center text-lg font-semibold">J</div>
//               <span className="text-gray-700 font-medium">James Oluwale</span>
//               <button className="w-1.5 h-1.5 mt-1">
//                 <img src={dropdown} alt="DD" /></button>
//               </form>
//             </div>
            
//           </div>
//         </header>
//         </div>

//     );
// };

// export default Header;