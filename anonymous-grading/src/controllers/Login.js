import React, { useState } from "react";
import "../App.css";
import { useSpring, animated } from "react-spring";
import Axios from 'axios';


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
  return (
    <React.Fragment>
      <label htmlFor="username">USERNAME</label>
      <input type="text" id="username" />
      <label htmlFor="password">PASSWORD</label>
      <input type="text" id="password" />
      <input type="submit" value="submit" className="submit" />
    </React.Fragment>
  );
}

function RegisterForm() {

    const [firstnameReg, setfirstnameReg] = useState('');
    const [lastnameReg, setlastnameReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');


    const submitRegistration = () => {
        Axios.post('http://localhost8080/registration', {
            first_name: firstnameReg, 
            last_name: lastnameReg, 
            email: emailReg, 
            password: passwordReg
        }).then((response) => {
            console.log('Registration' + response)
            console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaA')
        })
    }

    const getUsers = async () => {
        let users = await Axios.get('http://localhost8080/users').then((res) =>{
            console.log(res);
        }).catch(err => console.error(err))
        console.log(users.length)
        console.log(users);
    }

  return (
    <React.Fragment>
        
      <label htmlFor="firstName">first name</label>
      <input type="text" id="firstname" onChange={(e) => {
          setfirstnameReg(e.target.value);
      }}/>
      <label htmlFor="lastName">last name</label>
      <input type="text" id="fullname" onChange={(e) => {
          setlastnameReg(e.target.value);
      }}/>
      <label htmlFor="email">email</label>
      <input type="text" id="email" onChange={(e) => {
          setEmailReg(e.target.value);
      }}/>
      <label htmlFor="password">password</label>
      <input type="text" id="password" onChange={(e) => {
          setPasswordReg(e.target.value);
      }}/>
      {/* <label for="confirmpassword">confirm password</label>
      <input type="text" id="confirmpassword" value={values.password} onChange={handleChangeOnRegistration}/> */}
      {/* <button onClick={getUsers} style={{"color":"black"}}></button> */}
      <input type="submit" value="submit" className="submit" onClick={getUsers}/>
    </React.Fragment>
  );
}

export default Login;