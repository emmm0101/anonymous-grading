import React, {useState} from 'react';
import axios from 'axios';
import grader from '../assets/pictures/grader.jpg'
import sadStudent from '../assets/pictures/sadStudent.png'
import happyStudents from '../assets/pictures/happyStudents.png'

function Home(){

    const [authState, setAuthState] = useState(false);
    const [hasProject, setHasProject] = useState(false);
    const [projectLink, setProjectLink] = useState('');
    const [projectName, setProjectName] = useState('');
    const [teammate1, setTeammate1] = useState('');
    const [teammate2, setTeammate2] = useState('');
    const [teammate3, setTeammate3] = useState('');
    const [deliverable1, setDeliverable1] = useState('');
    const [deliverable2, setDeliverable2] = useState('');
    const [deliverable3, setDeliverable3] = useState('');
    const [projectChecked, setprojectChecked] = useState(false);

    axios.get("http://localhost:3001/auth", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      if (response.data.error) {
        setAuthState(false);
      } else {
        setAuthState(true);
      }
    });

    if(projectChecked == false){
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
        setprojectChecked(true);
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

    axios.get("http://localhost:3001/usersDeliverables", {
      headers: {
        projectID: localStorage.getItem("projectID")  },
      }).then((response) => {
      if (response.data.error) {
        console.log(response.data.error)
      } else {
        console.log(response.data);
        setDeliverable1(response.data[0])
        setDeliverable2(response.data[1])
        if(response.data.length > 2){
        setDeliverable3(response.data[2])
        }
        
      }
    });
    }

    return(
        <div className='homeContainer'>
             { authState && (
                 <h2>You can start now to evaluate projects.</h2>
             )}
             {!authState && (
                 <>
           <h2>Welcome to Anonymous Grading!</h2> 
           <img src={grader} alt="Grader" style={{"height": "800px"}} />
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
           <div className="splitLeft left">
            <div>
            <h4 className="projectTitle">{projectName}</h4>
              <a href={projectLink}><button className='githubButton'>Go to Github</button></a>
            <div className="container-table100">
                <div className="wrap-table100">
                    <div className="table">
                        <div className="row header">
                            <div className="cell">
                                First Name
                            </div>
                            <div className="cell">
                                Last Name
                            </div>
                            <div className="cell">
                                Email
                            </div>
                        <div className="row">
                            <div className="cell" data-title="First Name">
                                {teammate1.first_name}
                            </div>
                            <div className="cell" data-title="Last Name">
                            {teammate1.last_name}
                            </div>
                            <div className="cell" data-title="Email">
                            {teammate1.email}
                            </div>
                        </div>

                        <div className="row">
                            <div class="cell" data-title="First Name">
                            {teammate2.first_name}
                            </div>
                            <div className="cell" data-title="Last Name">
                            {teammate2.last_name}
                            </div>
                            <div className="cell" data-title="Email">
                            {teammate2.email}
                            </div>
                        </div>

                        <div className="row">
                            <div class="cell" data-title="First Name">
                            {teammate3.first_name}
                            </div>
                            <div className="cell" data-title="Last Name">
                            {teammate3.last_name}
                            </div>
                            <div className="cell" data-title="Email">
                            {teammate3.email}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="container-table100">
                <div className="wrap-table2">
                    <div className="table">
                        <div className="row2 header2">
                            <div className="cell2">
                                Deadline date
                            </div>
                            <div className="cell2">
                                Description
                            </div>
                        <div className="row2">
                            <div className="cell2" data-title="First Name">
                                {deliverable1.ddl_date}
                            </div>
                            <div className="cell2" data-title="Last Name">
                            {deliverable1.description}
                            </div>
                        </div>

                        <div className="row2">
                            <div className="cell2" data-title="First Name">
                            {deliverable2.ddl_date}
                            </div>
                            <div className="cell2" data-title="Last Name">
                            {deliverable2.description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            </div>
          </div>
         <div className="splitRight right">
            <div className="centered">
              <img src={happyStudents} alt="Avatar man"/>
            </div>
          </div> 
                 
           </>
           )}
        </div>
    )
}

export default Home;