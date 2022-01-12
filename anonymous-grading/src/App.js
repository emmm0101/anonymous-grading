import './App.css';
import MainComponent from './components/MainComponent';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import HeaderComponent from './components/HeaderComponent';
import Home from './controllers/Home';
import Login from './controllers/Login';
import { AuthContext } from "./components/AuthContextComponent";
import { useState, useEffect } from "react";
import axios from "axios";


function App() {


  return (
    <div className="App">
      <BrowserRouter>
        <HeaderComponent/>
        <Switch>
            <Route path='/home' component={Home}/>
            <Route path='/login' component={Login}/>           
            <Redirect to='/home'/>
       </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
