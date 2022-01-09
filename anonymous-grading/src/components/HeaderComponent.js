import React from 'react'
// import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
// import ButtonGroup from 'react-bootstrap/ButtonGroup'
import pictures from '../assets/pictures/folder.png';
import bell from '../assets/pictures/bell.png';
import login from '../assets/pictures/login.png';
import home from '../assets/pictures/home.png'
import {Link} from 'react-router-dom';


function Header(){
    return(
        <div style={{"backgroundColor": "#FFCCD5", "width": "100%", "height":"60px"}}>
            <nav className="Nav" style={{"display":"grid"}}>
            <Link to='/home'>
            <button className="NavButton">
            <img src={home} alt="Home"/>       
            </button>
            </Link>
            <button className="NavButton">
            <img src={pictures} alt="Folder"/>
            </button>
            <button className="NavButton">
            <img src={bell} alt="Bell"/>
            </button>
            <Link to='/login'>
            <button className="NavButton">
            <img src={login} alt="Log In"/>
            </button>
            </Link>
            </nav>
           
        </div>
    )
}

export default Header;