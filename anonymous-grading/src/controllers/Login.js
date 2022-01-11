import React, { useContext, useState } from "react";
import "../App.css";
import { useSpring, animated } from "react-spring";
import Axios from 'axios';
import { AuthContext } from '../components/AuthContextComponent';
import { Redirect, useHistory} from 'react-router-dom';



function Login() {
  const [registrationFormStatus, setRegistartionFormStatus] = useState(false);
  const loginProps = useSpring({
    left: registrationFormStatus ? -500 : 0, // Login form sliding positions
  });
  const registerProps = useSpring({
    left: registrationFormStatus ? 0 : 500, // Register form sliding positions 
  });

  const loginBtnProps = useSpring({
    borderBottom: registrationFormStatus
      ? "solid 0px transparent"
      : "solid 2px #1059FF",  //Animate bottom border of login button
  });
  const registerBtnProps = useSpring({
    borderBottom: registrationFormStatus
      ? "solid 2px #1059FF"
      : "solid 0px transparent", //Animate bottom border of register button
  });

  function registerClicked() {
    setRegistartionFormStatus(true);
  }
  function loginClicked() {
    setRegistartionFormStatus(false);
  }

  return (
    <div className="login-register-wrapper">
      <div className="nav-buttons">
        <animated.button
          onClick={loginClicked}
          id="loginBtn"
          style={loginBtnProps}
        >
          Login
        </animated.button>
        <animated.button
          onClick={registerClicked}
          id="registerBtn"
          style={registerBtnProps}
        >
          Register
        </animated.button>
      </div>
      <div className="form-group">
        <animated.form action="" id="loginform" style={loginProps}>
          <LoginForm />
        </animated.form>
        <animated.form action="" id="registerform" style={registerProps}>
          <RegisterForm />
        </animated.form>
      </div>
      {/* <animated.div className="forgot-panel" style={loginProps}>
        <a herf="#">Forgot your password</a>
      </animated.div> */}
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setAuthState} = useContext(AuthContext);
  let history = useHistory();
  var accessToken = "";
  if(email.includes("laura")){
    accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imh1bHViYWxhdXJhMTlAc3R1ZC5hc2Uucm8iLCJpYXQiOjE2NDE5MTg0OTN9.jaroROCe5EreS29-Vbc0vQ4w4fTq8-uNxGji6RVqytA"
  }else if(email.includes("emma")){
    accessToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtbWFpb25lc2N1MTlAc3R1ZC5hc2Uucm8iLCJpYXQiOjE2NDE5MTg1NjF9._hcw4F7nrhZuVPuNK5JVGDmSUHJPUzzSMyjXn-G7Bk0"
  }else if(email.includes("alexia")){
    accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlhY29iZXNjdWFsZXhpYTE5QHN0dWQuYXNlLnJvIiwiaWF0IjoxNjQxOTE4NjIzfQ.zDEIcWoTxrQZgFgNzowar0Yuip6moBvxhHI-e0AVO8E"
  }
  const login = () => {
    Axios.post('http://localhost:3001/login', {
      email: email,
      password: password
    }).then((response) => {
      console.log('Registration' + response)
      if(response.data.error){ console.log(response.data.error)
      }else{
      localStorage.setItem("accessToken", accessToken);
      setAuthState(true);
      alert(response.data + ' access token')
        history.push('/home');
      }
    })
  }
  return (
    <React.Fragment>
      <label htmlFor="username">EMAIL</label>
      <input type="text" id="username" onChange={(e) => {
        setEmail(e.target.value);
        console.log(e.target.value)
      }}/>
      <label htmlFor="password">PASSWORD</label>
      <input type="password" id="password" onChange={(e) => {
        setPassword(e.target.value);
      }}/>
      <input type="submit" value="submit" className="submit"  onClick={login}/>
    </React.Fragment>
  );
}

function RegisterForm() {

  const [firstnameReg, setfirstnameReg] = useState('');
  const [lastnameReg, setlastnameReg] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');

  // React.useEffect(() => {
  //   Axios.get('http://localhost:3001/users').then((res) => {
  //     console.log(res.data)
  //    // alert(res.data);
  //   }).catch(err => console.log(err));
  // }, []);
  let history = useHistory();
  const submitRegistration = () => {
    Axios.post('http://localhost:3001/registration', {
      first_name: firstnameReg,
      last_name: lastnameReg,
      email: emailReg,
      password: passwordReg
    }).then((response) => {
      //alert('successful insert')
      history.push('/home');
      
      console.log('Registration' + response)
    })
  }


  return (
    <React.Fragment>

      <label htmlFor="firstName">first name</label>
      <input type="text" id="firstname" onChange={(e) => {
        setfirstnameReg(e.target.value);
      }} />
      <label htmlFor="lastName">last name</label>
      <input type="text" id="fullname" onChange={(e) => {
        setlastnameReg(e.target.value);
      }} />
      <label htmlFor="email">email</label>
      <input type="text" id="email" onChange={(e) => {
        setEmailReg(e.target.value);
      }} />
      <label htmlFor="password">password</label>
      <input type="password" id="password" onChange={(e) => {
        setPasswordReg(e.target.value);
      }} />
      <input type="submit" value="submit" className="submit" onClick={submitRegistration} />
    </React.Fragment>
  );
}

export default Login;