import React from "react";
// import "./App.css";
import logo from "../Images/Frame 1707480519.png"
import bell from '../Images/Frame 1768.png'
import frame from '../Images/Frame 1707480527.png'




const ConHome = () => {
  return (
    <div className="main-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <span>Conference</span>
        </div>
        <div className="header-icons">
            <button className="icon-button">?</button>
            
            
            <img src={bell} alt="notification"
              className="icon-bell" />
            
            <img src={frame} alt="box"
              className="icon-frame" />
           

          <div className="circle_username"> 
            <div className="profile-circle">J</div>
            <span className="username">James Oluwale</span>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="Event">
        <h1 className="session-title">[Departmental Progress & Future Roadmap Session]</h1>
        <div className="status">
          <div className="loader"></div>
          <p>
            Waiting for Host to Start. We will let you know when the Host starts the meeting.
          </p>
        </div>
        <button className="go-back-btn">Go back</button>
      </main>

      {/* Footer */}
      <footer className="footer">
        <a href="#feedback">Send Feedback</a>
      </footer>
    </div>
  );
};

export default ConHome;
