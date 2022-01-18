import React, { useState } from "react";
import "../App.css";
import { useSpring, animated } from "react-spring";
import Axios from 'axios';
import { useHistory} from 'react-router-dom';



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
      : "solid 2px #DF5E5E",  //Animate bottom border of login button
  });
  const registerBtnProps = useSpring({
    borderBottom: registrationFormStatus
      ? "solid 2px #DF5E5E"
      : "solid 0px transparent", //Animate bottom border of register button
  });

  function registerClicked() {
    setRegistartionFormStatus(true);
  }
  function loginClicked() {
    setRegistartionFormStatus(false);
  }

  return (
    <div className="divLogin">
    <div className="login-register-wrapper">
      <div className="nav-buttons">
        <animated.button
          onClick={loginClicked} //se va afisa formulare de login
          id="loginBtn"
          style={loginBtnProps}
        >
          Login
        </animated.button>
        <animated.button
          onClick={registerClicked} //se va afisa formulare de login
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
    </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let history = useHistory();

  const login = e => {
    e.preventDefault();
    console.log('checked');
    const data = {
      email: email,
      password: password
    }

    //request de verificare a user-ului in baza de date, in caz afirmativ, se vor salva in localStorage datele ce vor fi utilizate pentru alte request-uri in alte functii
    Axios.post('http://localhost:3001/login', data).then(res => {
      console.log(res);
      localStorage.setItem("accessToken", res.data.token);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("userID", res.data.userID);
      localStorage.setItem("account_type", res.data.account_type);
      history.push('/home');
    }).catch(err => {
      console.log(err)
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

  let history = useHistory();
  const submitRegistration = (e) => {
    e.preventDefault();
    const data = {
      first_name: firstnameReg,
      last_name: lastnameReg,
      email: emailReg,
      password: passwordReg
    }
    console.log('submitButton')
    //axios call pentru a adauga o noua inregistrare in baza de date, in tabela user. in cazul in care record ul a fost adaugat cu succes, 
    //user-ul va fi redirectionat catre pagina de login(formularul de login)
    Axios.post('http://localhost:3001/registration', data).then((response) => {
      console.log(response)
      history.push('/login');
      console.log('Registration' + response)
    }).catch(err => console.log(err))
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