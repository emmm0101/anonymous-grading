import React from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from '../controllers/Home';
import Login from '../controllers/Login';
import {Switch, Route, Redirect, withRouter, Router} from 'react-router-dom';


function MainComponent(){

    return (
        <React.Fragment>
        <Header/>
        <Switch>
            <Route path='/home' component={Home}/>
            <Route path='/login' component={Login}/>
            <Redirect to='/home'/>
       </Switch>
        <Footer/>
        </React.Fragment>
    )
  
}

export default withRouter(MainComponent);