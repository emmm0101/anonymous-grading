import React, { useState } from 'react'
import evaluate from '../assets/pictures/evaluate.png';
import bell from '../assets/pictures/bell.png';
import login from '../assets/pictures/login.png';
import logout from '../assets/pictures/logout.png';
import home from '../assets/pictures/home.png';
import deliverable from '../assets/pictures/registerDeliverable.png'
import registerProject from '../assets/pictures/registerProject.png'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Redirect, useHistory} from 'react-router-dom';

import axios from 'axios';


function Header() {
    const [authState, setAuthState] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectRepo, setProjectRepo] = useState('');
    const [teammate1, setTeammate1] = useState('');
    const [teammate2, setTeammate2] = useState('');
    const [teammate3, setTeammate3] = useState('');
    const [deliverableDate1, setDeliverableDate1] = useState('');
    const [deliverableDate2, setDeliverableDate2] = useState('');
    const [deliverableDate3, setDeliverableDate3] = useState('');
    const [deliverableDescription1, setDeliverableDescription1] = useState('');
    const [deliverableDescription2, setDeliverableDescription2] = useState('');
    const [deliverableDescription3, setDeliverableDescription3] = useState('');

    const [projectID, setProjectID] = useState('');

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
        }
    });
    let history = useHistory();
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userID");
        localStorage.removeItem("email");
        localStorage.removeItem("projectID");
        setAuthState(false);
        history.push('/login');
    }

    const [open, setOpen] = React.useState(false);
    const [openTeamDialog, setOpenTeamDialog] = React.useState(false);
    const [openDeliverableDialog, setOpenDeliverableDialog] = React.useState(false);

    const handleRegisterProject = () => {
        const data = {
            name: projectName,
            link: projectRepo
          }
          axios.post('http://localhost:3001/registerProject', data).then(res => {
              if(res.status == 201){
                console.log(res.data)
                setOpen(false);
                setOpenTeamDialog(true);
                setProjectID(res.data.projectID);
            } else{
                alert('Failed to register project')
            }
          }).catch(err => {
            console.log(err)
          })
    }

    const handleRegisterDeliverable = () => {
        setOpenDeliverableDialog(true);
    }

    const handleDeliverableClose = () => {
        setOpenDeliverableDialog(false);
    }

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleAddTeammatesClose = () => {
        setOpenTeamDialog(false);
    }

    const handleAddTeammates = () => {
        const data = {
            projectID: projectID,
            user_1: teammate1,
            user_2: teammate2,
            user_3: teammate3
        }
        console.log(data);
          axios.put("http://localhost:3001/users/project/:projectID", data).then(res => {
              if(res.status == 202){
                console.log(res.data)
                setOpenTeamDialog(false);
                setOpenDeliverableDialog(true);
                alert('Your team has been added')
            } else{
                alert('Failed to register project')
            }
          }).catch(err => {
            console.log(err)
          })
    }

    const handleAddDeliverable = () => {
        let deliverables =  [];
        const deliverable1 = {
            ddl_date: deliverableDate1,
            description: deliverableDescription1,
            projectID: projectID
        }
        deliverables.push(deliverable1)
        const deliverable2 = {
            ddl_date: deliverableDate2,
            description: deliverableDescription2,
            projectID: projectID
        }
        deliverables.push(deliverable2)
        const deliverable3 = {
            ddl_date: deliverableDate3,
            description: deliverableDescription3,
            projectID: projectID
        }
        deliverables.push(deliverable3);
        console.log(deliverables)
        axios.post("http://localhost:3001/registerDeliverables", deliverables).then(res => {
            if(res.status == 201){
              console.log(res.data)
              setOpenDeliverableDialog(false);
          } else{
              alert('Failed to register deliverables')
          }
        }).catch(err => {
          console.log(err)
        })

    }

    return (
        <div style={{ "backgroundColor": "#FFCCD5", "width": "100%", "height": "60px" }}>
            <nav className="Nav" style={{ "display": "grid" }}>
                <Link to='/home'>
                    <button className="NavButton">
                        <img src={home} alt="Home" />
                    </button>
                </Link>
                {!authState && (
                    <Link to='/login'>
                        <button className="NavButton">
                            <img src={login} alt="Log In" />
                        </button>
                    </Link>
                )}
                 <button className="NavButton">
                     <img src={evaluate} alt="Evaluate" style={{"width": "28px"}}/>
                 </button>
                 <button className="NavButton"  onClick={handleClickOpen}>
                    <img src={registerProject} alt="Register Project" style={{"width": "26px"}}/>
                 </button>
                 <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Register your team's project</DialogTitle>
                 <DialogContent>
                 <DialogContentText>
                    Project's name and repo's link are both required.
          </DialogContentText>
                <TextField
                autoFocus margin="dense" id="name" label="Name of the project" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setProjectName(e.target.value);
                  }}/>
              <TextField
                autoFocus margin="dense" id="link" label="Repo's link" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setProjectRepo(e.target.value);
                  }}/>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleRegisterProject}>Register</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openTeamDialog} onClose={handleClose}>
                <DialogTitle>Your project has been register</DialogTitle>
                 <DialogContent>
                 <DialogContentText>
                   Please add your email and your project teammates' emails.
          </DialogContentText>
               <TextField
                autoFocus margin="dense" id="teammate1" label="Yours" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setTeammate1(e.target.value);
                  }}/>
               <TextField
                autoFocus margin="dense" id="teammate2" label="First teammate" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setTeammate2(e.target.value);
                  }}/>
                 <TextField
                autoFocus margin="dense" id="teammate2" label="Second teammate" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setTeammate3(e.target.value);
                  }}/>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleAddTeammatesClose}>Cancel</Button>
                <Button onClick={handleAddTeammates}>Add teammates</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeliverableDialog} onClose={handleClose}>
                <DialogTitle>Add deliverables to your project</DialogTitle>
                 <DialogContent>
               <TextField
                autoFocus margin="dense" id="deliverableDate1" label="Deadline date for the first deliverable(format dd/MM/yyyy)" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setDeliverableDate1(e.target.value);
                  }}/>
               <TextField
                autoFocus margin="dense" id="deliverableDescription1" label="Description for the first deliverable" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setDeliverableDescription1(e.target.value);
                  }}/>
                 <TextField
                autoFocus margin="dense" id="deliverableDate2" label="Deadline date for the second deliverable(format dd/MM/yyyy)" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setDeliverableDate2(e.target.value);
                  }}/>
               <TextField
                autoFocus margin="dense" id="deliverableDescription2" label="Description for the second deliverable" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setDeliverableDescription2(e.target.value);
                  }}/>
             <TextField
                autoFocus margin="dense" id="deliverableDate3" label="Deadline date for the third deliverable(format dd/MM/yyyy)" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setDeliverableDate3(e.target.value);
                  }}/>
               <TextField
                autoFocus margin="dense" id="deliverableDescription3" label="Description for the third deliverable" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setDeliverableDescription3(e.target.value);
                  }}/>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleDeliverableClose}>Cancel</Button>
                <Button onClick={handleAddDeliverable}>Add deliverable</Button>
                </DialogActions>
            </Dialog>
            
            {/* <button className="NavButton" onClick={handleRegisterDeliverable}>
                    <img src={deliverable} alt="Register deliverable"/>
                  </button> */}
                  <Dialog open={openDeliverableDialog} onClose={handleClose}>
                <DialogTitle>Add deliverables to your project</DialogTitle>
                 <DialogContent>
               <TextField
                autoFocus margin="dense" id="deliverableDate1" label="Deadline date for the first deliverable(format dd/MM/yyyy)" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setDeliverableDate1(e.target.value);
                  }}/>
               <TextField
                autoFocus margin="dense" id="deliverableDescription1" label="Description for the first deliverable" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setDeliverableDescription1(e.target.value);
                  }}/>
                 <TextField
                autoFocus margin="dense" id="deliverableDate2" label="Deadline date for the second deliverable(format dd/MM/yyyy)" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setDeliverableDate2(e.target.value);
                  }}/>
               <TextField
                autoFocus margin="dense" id="deliverableDescription2" label="Description for the second deliverable" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setDeliverableDescription2(e.target.value);
                  }}/>
             <TextField
                autoFocus margin="dense" id="deliverableDate3" label="Deadline date for the third deliverable(format dd/MM/yyyy)" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setDeliverableDate3(e.target.value);
                  }}/>
               <TextField
                autoFocus margin="dense" id="deliverableDescription3" label="Description for the third deliverable" type="required" fullWidth variant="standard" 
                onChange={(e) => {
                    setDeliverableDescription3(e.target.value);
                  }}/>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleDeliverableClose}>Cancel</Button>
                <Button onClick={handleAddDeliverable}>Add deliverable</Button>
                </DialogActions>
            </Dialog>
                <button className="NavButton">
                    <img src={bell} alt="Bell"/>
                  </button>
                  { authState && (
                <>
                <button className="NavButton" onClick={handleLogout}>
                     <img src={logout} alt="Log Out"/>
                </button>
                </>
            )}
            </nav>
        </div>
    )
}

export default Header;