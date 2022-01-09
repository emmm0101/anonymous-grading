import React from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from '../controllers/Home';
import Login from '../controllers/Login';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';

function MainComponent(){
    return (
        //     <Header className="Header" style={{"display":"grid"}}/>
        //     <div>
        //         <h1>Welcome to Anonymous Grading!</h1>
        //     </div>
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