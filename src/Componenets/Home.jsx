import React from "react";
// import "./App.css";
import Header from "./Header";
import calendar_icon from '../Images/Union.png';
import clock_icon from '../Images/Union time.png';
import export_icon from '../Images/Export button-icon.png';
import contact_icon from '../Images/contact.png';
import borderline from '../Images/Border line.png';
import { useNavigate } from 'react-router-dom';


 
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      {/* Header */}
      <Header />

      {/* Container */}
    <div className="container">
      
          <div class="sidebar">

            <div class="box">
              <div class="event">
                <div class="time">8:30am</div>
                <div class="title">[Enhancing Agency Collaboration]</div>
                <img src={export_icon} alt="icon_export" width={13}></img>
              </div>
            </div>

            <div class="box">
              <div class="event">
                <div class="time">1:30pm</div>
                <div class="title">[Streamlining Public Service Delivery]</div>
                <img src={export_icon} alt="icon_export" width={13}></img>
              </div>
            </div>

            <div class="box">
              <div class="event">
                <div class="time">3:30pm</div>
                <div class="title">[Operational Strategy Planning]</div>
                <img src={export_icon} alt="icon_export" width={13}></img>
              </div>
            </div>
          </div>
          
          <img src={borderline} alt="line" width={2} height={350} className="borderline"></img>
      

       

      <div className="meeting-card">
        <div className="meeting-header">
          <div className="flex items-center">
            <img src={clock_icon} alt="icon_clock" width={13}></img>  1:30pm
          </div>
          <div className="date">
            <img src={calendar_icon} alt="icon_calendar" width={13}></img>  Tue Nov 17 2024
          </div>
        </div>
       
        <h2 className="meeting-title">[Departmental Progress & Future Roadmap Session]</h2>
        
        <p className="instruction">Enter your name and email to join the meeting.</p>
        
        <form className="meeting-form">
          <div className="inputfield_contact">
            <input
            type="text"
            placeholder="Enter your name e.g., Prince Derrick" 
            className="input-field1"/> 
            
            <img height={20} width={20}
            src={contact_icon} alt="Contact Icon"
            className="input_icon"/>  
          </div>
          
          <div className="checkbox-container">
            <input type="checkbox" id="save-name" />
            <label htmlFor="save-name">Save my name for future meetings</label>
          </div>

          <div className="input-joinMeet">
            <input
            type="email"
            placeholder="Enter Email Address"
            className="input-field2"/>

            <button type="submit" className="join-button" onClick={() => navigate('Page2')}>
            Join Meeting
            </button>
          </div>
        </form>

          <div className="about">
            <a href="#more-info" className="learn-more">Learn more</a> about Conference
          </div>
      </div>
    </div>
    </div>
  );
};

export default Home;
