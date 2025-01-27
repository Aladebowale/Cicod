import logo from "../Images/Frame 1707480519.png"
import bell from '../Images/Frame 1768.png'
import frame from '../Images/Frame 1707480527.png'
import dropdown from '../Images/dropdown.png'


const Header = () => {
    return (
      <div> 
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-yellow shadow-md p-15 20 h-14 bg-white">
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
  
            <div className="flex flex-row items-center space-x-2 ">
              <form className="flex flex-row p-2 rounded-3xl shadow-md items-center space-x-1 border-[#DDE2E5]">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">J</div>
              <span className="text-gray-700 font-medium">James Oluwale</span>
              <button className="w-1.5 h-1.5 mt-1">
                <img src={dropdown} alt="DD" /></button>
              </form>
            </div>
            
          </div>
        </header>
        </div>

    );
};

export default Header;