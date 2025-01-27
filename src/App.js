import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "../src/Componenets/Home";
import "./App.css";
import Page2 from '../src/Componenets/tailwindHome';


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/Page2' element={<Page2 />}/> 
        </Routes>
      </Router>
    </div>
  );
};

export default App;
 