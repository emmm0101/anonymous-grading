import React, {useState} from 'react';
import axios from 'axios';
import grader from '../assets/pictures/grader.jpg'
import sadStudent from '../assets/pictures/sadStudent.png'
import happyStudent from '../assets/pictures/happyStudent.png'


function Home(){

    const [authState, setAuthState] = useState(false);
    const [hasProject, setHasProject] = useState(false);
    const [projectLink, setProjectLink] = useState('');
    const [projectName, setProjectName] = useState('');
    const [teammate1, setTeammate1] = useState('');
    const [teammate2, setTeammate2] = useState('');
    const [teammate3, setTeammate3] = useState('');
    const [projectChecked, setprojectChecked] = useState(false);
    const [checked, setChecked] = useState(false);
    const [wasAuthChecked, setWasAuthChecked] = useState(false);

    if(wasAuthChecked == false){
    axios.get("http://localhost:3001/auth", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      if (response.data.error) {
        setAuthState(false);
        debugger;
        console.log(false)
      } else {
        setAuthState(true);
        setAuthState(true);
        console.log("true from home.js")
      }
    });
  }

    if(authState && checked == false){
    axios.get("http://localhost:3001/user/project/:id", {
      headers: {
        userID: localStorage.getItem("userID")  },
      }).then((response) => {
      if (response.data.error) {
        //setprojectChecked(true);
        console.log(response.data.error)
      } else {
        //console.log(response.data);
        setHasProject(true);
        //setprojectChecked(true);
        setProjectLink(response.data.link);
        setProjectName(response.data.name);
        localStorage.setItem("projectID", response.data.projectID)
      }
    });
  }

    if(hasProject && projectChecked == false){
      axios.get("http://localhost:3001/teammates", {
      headers: {
        projectID: localStorage.getItem("projectID")  },
      }).then((response) => {
      if (response.data.error) {
        console.log(response.data.error)
      } else {
        console.log(response.data);
        setprojectChecked(true);
        setTeammate1(response.data[0])
        setTeammate2(response.data[1])
        setTeammate3(response.data[2])
        
      }
    });
    }

    return(
        <div>
             { authState && (
                 <h2>You can start now to evaluate projects.</h2>
             )}
             {!authState && (
                 <>
           <h2>Welcome to Anonymous Grading!</h2>      
           <img src={grader} alt="Grader" style={{"marginTop": "50px", "height": "700px"}} />
           <h3>Please login first to access home page.</h3>
           </>
           )}
            {!hasProject && authState && (
                 <>
           <h2>At the moment there are no projects assigned to you</h2>      
           <img src={sadStudent} alt="Sad Student" style={{"marginTop": "50px", "height": "700px"}} />
           </>
           )}
           {hasProject && (
                 <>
           <h3>Your team's project</h3> 
           <div class="splitLeft left">
            <div>
            <h4 class="projectTitle">{projectName}</h4>
              <a href={projectLink}><button className='githubButton'>Go to Github</button></a>
            <h5>Team</h5>
            </div>
          </div>

          <div className="splitRight right">
            <div className="centered">
              <img src={happyStudent} alt="Avatar man"/>
              <h2>John Doe</h2>
              <p>Some text here too.</p>
            </div>
          </div>
           </>
           )}
        </div>
    )
}

export default Home;