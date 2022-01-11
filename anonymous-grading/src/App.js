import './App.css';
import MainComponent from './components/MainComponent';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import HeaderComponent from './components/HeaderComponent';
import Home from './controllers/Home';
import Login from './controllers/Login';
import { AuthContext } from "./components/AuthContextComponent";
import { useState, useEffect } from "react";
import axios from "axios";


function App() {

  const [authState, setAuthState] = useState(false);
  // var accessToken = "";
  // if(email.includes("laura")){
  //   accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imh1bHViYWxhdXJhMTlAc3R1ZC5hc2Uucm8iLCJpYXQiOjE2NDE5MTg0OTN9.jaroROCe5EreS29-Vbc0vQ4w4fTq8-uNxGji6RVqytA"
  // }else if(email.includes("emma")){
  //   accessToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtbWFpb25lc2N1MTlAc3R1ZC5hc2Uucm8iLCJpYXQiOjE2NDE5MTg1NjF9._hcw4F7nrhZuVPuNK5JVGDmSUHJPUzzSMyjXn-G7Bk0"
  // }else if(email.includes("alexia")){
  //   accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlhY29iZXNjdWFsZXhpYTE5QHN0dWQuYXNlLnJvIiwiaWF0IjoxNjQxOTE4NjIzfQ.zDEIcWoTxrQZgFgNzowar0Yuip6moBvxhHI-e0AVO8E"
  // }
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState(false);
          debugger;
          console.log(false)
        } else {
          setAuthState(true);
          console.log("true from app.js")
        }
      });
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <HeaderComponent/>
        <Switch>
            <Route path='/home' component={Home}/>
            <Route path='/login' component={Login}/>
            <Redirect to='/home'/>
       </Switch>
      </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
