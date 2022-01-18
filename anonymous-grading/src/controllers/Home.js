import React, { useState, useEffect } from 'react';
import axios from 'axios';
import grader from '../assets/pictures/grader.jpg'
import sadStudent from '../assets/pictures/sadStudent.png'
import happyStudents from '../assets/pictures/happyStudents.png'


function Home() {

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
  const [isStudent, setIsStudent] = useState(true);
  const [projects, setProjects] = useState('');
  const [grades, setGrades] = useState('');
  const [projectsChecked, setProjectsChecked] = useState(false);
  const [refresh, setRefresh] = useState(false);


  axios.get("http://localhost:3001/auth", {
    headers: {
      accessToken: localStorage.getItem("accessToken"),
    },
  }).then((response) => {
    if (response.data.error) {
      setAuthState(false);
    } else {
      setAuthState(true);
      //setAccount(localStorage.getItem("account_type"))
      if (localStorage.getItem("account_type") == 'Teacher') {
        setIsStudent(false)
      }

    }
  });

  if (isStudent == false && projectsChecked == false) {
    axios.get("http://localhost:3001/projects").then((response) => {
      if (response.data.error) {
        console.log(response.data.error)
      } else {
        
        setProjects(response.data)
        //console.log(projects)
        setProjectsChecked(true);
      }
    });

  }

  useEffect(() => {
    axios.get("http://localhost:3001/grades").then((response) => {
      if (response.data.error) {
        console.log(response.data.error)
      } else {
        setGrades(response.data)
        console.log(grades)
      }
    });  
}, []);




  if (projectChecked == false && isStudent == true) {
    axios.get("http://localhost:3001/user/project/:id", {
      headers: {
        userID: localStorage.getItem("userID")
      },
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

  if (hasProject && projectChecked == false && isStudent == true) {
    axios.get("http://localhost:3001/teammates", {
      headers: {
        projectID: localStorage.getItem("projectID")
      },
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
        projectID: localStorage.getItem("projectID")
      },
    }).then((response) => {
      if (response.data.error) {
        console.log(response.data.error)
      } else {
        console.log(response.data);
        setDeliverable1(response.data[0])
        setDeliverable2(response.data[1])
        if (response.data.length > 2) {
          setDeliverable3(response.data[2])
        }

      }
    });

    // useEffect(() => {
    //   if(!refresh){
    //     window.location.reload(false);
    //     setRefresh(true);
    //   }
    // })
    //window.location.reload(false);
  }


  return (
    <div className='homeContainer'>
      {authState && isStudent && (
        <h2>You can start now to evaluate projects.</h2>
      )}
      {!authState && (
        <>
          <h2>Welcome to Anonymous Grading!</h2>
          <img src={grader} alt="Grader" style={{ "height": "800px" }} />
          <h3>Please login first to access home page.</h3>
        </>
      )}
      {!hasProject && authState && isStudent && (
        <>
          <h2>At the moment there are no projects assigned to you</h2>
          <img src={sadStudent} alt="Sad Student" style={{ "marginTop": "50px", "height": "1500px" }} />
        </>
      )}
      {authState && !isStudent && projectsChecked && (
        <>
          <h3>Projects</h3>
          <div className="splitLeft left" style={{"height" :"800px"}}>
            <div>
              {projects.map((l) => (
                <div className="container-table100">
                  <div className="wrap-table2">
                    <div className="table">
                      <div className="row2 header2">
                        <div className="cell2">
                          Name
                        </div>
                        <div className="cell2">
                          Github Repository
                        </div>
                        <div className="cell2">
                          Project ID
                        </div>
                        <div className="row2">
                          <div className="cell2" data-title="First Name">
                            {l.name}
                          </div>
                          <div className="cell2" data-title="Last Name">
                            <a href={l.link}>
                              {l.link}
                            </a>
                          </div>
                          <div className="cell2" data-title="Last Name">
                            {l.projectID}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {grades.map((l) => (
                <div className="container-table100">
                  <div className="wrap-table2">
                    <div className="table">
                      <div className="row2 header2">
                        <div className="cell2">
                          Grade between 0-5
                        </div>
                        <div className="cell2">
                          Deliverable ID
                        </div>
                        <div className="cell2">
                          Project ID
                        </div>

                        <div className="row2">
                          <div className="cell2" data-title="First Name">
                            {l.grade}
                          </div>
                          <div className="cell2" data-title="Last Name">
                            <a href={l.link}>
                              {l.deliverableID}
                            </a>
                          </div>
                          <div className="cell2" data-title="Last Name">
                            {l.projectID}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="splitRight right">
            <div className="centered">
              <img src={happyStudents} alt="Avatar man" />
            </div>
          </div>

        </>
      )
      }
      {hasProject && isStudent && (
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
                        <div className="cell" data-title="First Name">
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
                        <div className="cell" data-title="First Name">
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
              <img src={happyStudents} alt="Avatar man" />
            </div>
          </div>

        </>
      )}
    </div>
  )
}

export default Home;