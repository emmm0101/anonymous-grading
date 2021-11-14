import React from 'react'
// import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
// import ButtonGroup from 'react-bootstrap/ButtonGroup'
import pictures from '../assets/pictures/folder.png';
import bell from '../assets/pictures/bell.png';
import login from '../assets/pictures/login.png';


function Header(){
    return(
        <div style={{"backgroundColor": "#FFCCD5", "width": "100%", "height":"60px"}}>
            <nav className="Nav" style={{"display":"grid"}}>
             {/* <ButtonToolbar>
             <ButtonGroup> */}
            <button className="NavButton">
            <img src={pictures} alt="Folder"/>
                 {/* icon={require('../assets/pictures/icons8-folder-30.png') */} 
                {/* style={{"backgroundColor": "red", "width": "70px", "height":"70px"}} */}
            </button>
            <button className="NavButton">
            <img src={bell} alt="Bell"/>
            </button>
            <button className="NavButton">
            <img src={login} alt="Log In"/>
            </button>
            {/* </ButtonGroup>
            </ButtonToolbar> */}
            </nav>
           
        </div>
    )
}

export default Header;