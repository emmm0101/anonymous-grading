import React, { useEffect, useState } from 'react'
import evaluate from '../assets/pictures/evaluate.png';
import bell from '../assets/pictures/bell.png';
import login from '../assets/pictures/login.png';
import logout from '../assets/pictures/logout.png';
import home from '../assets/pictures/home.png';
import registerProject from '../assets/pictures/registerProject.png'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useHistory, Redirect } from 'react-router-dom';
import { Popover } from '@primer/react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PreviewIcon from '@mui/icons-material/Preview';
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
  const [isStudent, setIsStudent] = useState(true);
  const [projectID, setProjectID] = useState('');

  //un axios call care verifica jwt-ul user-ului conectat. in cazul in care acesta nu este valid, user-ul nu va putea avea acces la tabele cu proiectele
  axios.get("http://localhost:3001/auth", {
    headers: {
      accessToken: localStorage.getItem("accessToken"),
    },
  }).then((response) => {
    if (response.data.error) {
      setAuthState(false);
      console.log(false)
    } else {
      setAuthState(true);
    }
  });


  let history = useHistory();
  //functia care se apeleaza in momentul in care user-ul da click pe butonul de Logout, stergandu-se toate datele salvate pe parcurs in localStorage
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userID");
    localStorage.removeItem("email");
    localStorage.removeItem("projectID");
    localStorage.removeItem("account_type");
    localStorage.removeItem("projectToEvaluate");
    localStorage.removeItem("deliverableID");
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
    //axios call pentru a puta face insert in tabela project cu noile date necesare
    axios.post('http://localhost:3001/registerProject', data).then(res => {
      if (res.status == 201) {
        console.log(res.data)
        setOpen(false);
        setOpenTeamDialog(true);
        setProjectID(res.data.projectID);
      } else {
        alert('Failed to register project')
      }
    }).catch(err => {
      console.log(err)
    })
  }


  //use effect -> pentru a verifica daca s-a conectat un profesor sau un student, dupa ce aplicatia isi face render
  useEffect(() => {
    if (localStorage.getItem("account_type") === 'Student') {
      setIsStudent(true);
    } else {
      setIsStudent(false);
    }
  })

  //inchide dialogul de inregistrat partialele(deliverables)
  const handleDeliverableClose = () => {
    setOpenDeliverableDialog(false);
  }


  //deschide dialogul de inregistrat un proiect
  const handleClickOpen = () => {
    setOpen(true);
  };


   //inchide dialogul de inregistrat un proiect
  const handleClose = () => {
    setOpen(false);
  };


 //inchide dialogul de inregistrat colegii cu care se realizeaza proiectul -> se face update in tabela user, actualizandu-se projectID-ul la fiecare dintre acestia
  const handleAddTeammatesClose = () => {
    setOpenTeamDialog(false);
  }


   //deschide dialogul de inregistrat colegii cu care se realizeaza proiectul -> se face update in tabela user, actualizandu-se projectID-ul la fiecare dintre acestia
  const handleAddTeammates = () => {
    const data = {
      projectID: projectID,
      user_1: teammate1,
      user_2: teammate2,
      user_3: teammate3
    }
    console.log(data);
    axios.put("http://localhost:3001/users/project/:projectID", data).then(res => {
      if (res.status == 202) {
        console.log(res.data)
        setOpenTeamDialog(false);
        setOpenDeliverableDialog(true);
        alert('Your team has been added')
      } else {
        alert('Failed to register project')
      }
    }).catch(err => {
      console.log(err)
    })
  }


  //deschide dialogul de inregistrat partialele proiectului -> se face insert in tabela deliverable
  const handleAddDeliverable = () => {
    let deliverables = [];
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
    //axios call catre backend cu datele preluate din input-uri
    axios.post("http://localhost:3001/registerDeliverables", deliverables).then(res => {
      if (res.status == 201) {
        console.log(res.data)
        setOpenDeliverableDialog(false);
      } else {
        alert('Failed to register deliverables')
      }
    }).catch(err => {
      console.log(err)
    })
  }


  const [pos, setPos] = useState('top')
  const [openPopover, setOpenPopover] = useState(false);
  const [deliverableID, setDeliverableID] = useState(false);


  //deschide popover-ul care redirectioneaza catre pagina de evaluare, generandu-se random un numar sa fie asginat sa evalueze(in cazul in care este student)
  const onOpenPopover = () => {
    if (isStudent) {
      const userID = localStorage.getItem("userID")
      const randomNumber = Math.floor(Math.random() * (11 - 6) + 6);
      const grades = {
        grade: null,
        deliverableID: randomNumber,
        userID: userID,
        userUserID: userID,
        deliverableDeliverableID: randomNumber
      }

      console.log(grades);

      axios.post('http://localhost:3001/assignRandomEvaluator', grades).then(res => {
        console.log(res);
        localStorage.setItem("deliverableID", res.data.deliverableID);
        setDeliverableID(res.data.deliverableID);
      }).catch(err => {
        console.log(err)
      });
      setOpenPopover(true);
    }
  }

  //buton care triggaruieste redirectionarea catre pagina de evaluare
  const onPopoverSelect = () => {
    setOpenPopover(false);
    history.push('/evaluateProject');
  }


  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };


  //componente din header
  return (
    <div style={{ "backgroundColor": "#FCD8D4", "width": "100%", "height": "60px" }}>
      <nav className="Nav" style={{ "display": "grid" }}>
        <Link to='/home'>
          <button className="NavButton" style={{ "marginLeft": "110px" }}>
            <img src={home} alt="Home" />
          </button>
        </Link>
        <button className="NavButton" onClick={() => onOpenPopover()}>
          <img src={evaluate} alt="Evaluate" style={{ "width": "28px" }} />
        </button>
        <Popover relative={false} open={openPopover} caret={pos} style={{
          "marginTop": "200px",
          "marginLeft": "450px",
          "left": "0"
        }}>
          <Popover.Content>
            <List component="nav" aria-label="main mailbox folders">
              <ListItemButton
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
              >
                <ListItemIcon>
                  <PreviewIcon />
                </ListItemIcon>
                <ListItemText primary={deliverableID} />
              </ListItemButton>
            </List>
            <Link to='/evaluateProject'>
              <Button type="submit" onClick={() => setOpenPopover(false)} style={{ "color": "black" }}>
                <label style={{ "color": "black", "fontSize": "12px" }}>Select</label></Button>
            </Link>
            <Button type="submit" onClick={() => onPopoverSelect()} style={{ "color": "black" }}>
              <label style={{ "color": "black", "fontSize": "12px" }}>Close</label></Button>
          </Popover.Content>
        </Popover>
        <button className="NavButton" onClick={() => handleClickOpen()}>
          <img src={registerProject} alt="Register Project" style={{ "width": "26px" }} />
        </button>
        <Dialog open={open} onClose={() => handleClose()}>
          <DialogTitle>Register your team's project</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Project's name and repo's link are both required.
            </DialogContentText>
            <TextField
              autoFocus margin="dense" id="name" label="Name of the project" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setProjectName(e.target.value);
              }} />
            <TextField
              autoFocus margin="dense" id="link" label="Repo's link" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setProjectRepo(e.target.value);
              }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()}>Cancel</Button>
            <Button onClick={() => handleRegisterProject()}>Register</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openTeamDialog} onClose={() => handleClose()}>
          <DialogTitle>Your project has been register</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please add your email and your project teammates' emails.
            </DialogContentText>
            <TextField
              autoFocus margin="dense" id="teammate1" label="Yours" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setTeammate1(e.target.value);
              }} />
            <TextField
              autoFocus margin="dense" id="teammate2" label="First teammate" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setTeammate2(e.target.value);
              }} />
            <TextField
              autoFocus margin="dense" id="teammate2" label="Second teammate" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setTeammate3(e.target.value);
              }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleAddTeammatesClose()}>Cancel</Button>
            <Button onClick={() => handleAddTeammates()}>Add teammates</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openDeliverableDialog} onClose={() => handleClose()}>
          <DialogTitle>Add deliverables to your project</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus margin="dense" id="deliverableDate1" label="Deadline date for the first deliverable(format dd/MM/yyyy)" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setDeliverableDate1(e.target.value);
              }} />
            <TextField
              autoFocus margin="dense" id="deliverableDescription1" label="Description for the first deliverable" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setDeliverableDescription1(e.target.value);
              }} />
            <TextField
              autoFocus margin="dense" id="deliverableDate2" label="Deadline date for the second deliverable(format dd/MM/yyyy)" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setDeliverableDate2(e.target.value);
              }} />
            <TextField
              autoFocus margin="dense" id="deliverableDescription2" label="Description for the second deliverable" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setDeliverableDescription2(e.target.value);
              }} />
            <TextField
              autoFocus margin="dense" id="deliverableDate3" label="Deadline date for the third deliverable(format dd/MM/yyyy)" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setDeliverableDate3(e.target.value);
              }} />
            <TextField
              autoFocus margin="dense" id="deliverableDescription3" label="Description for the third deliverable" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setDeliverableDescription3(e.target.value);
              }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDeliverableClose()}>Cancel</Button>
            <Button onClick={() => handleAddDeliverable()}>Add deliverable</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openDeliverableDialog} onClose={() => handleClose()}>
          <DialogTitle>Add deliverables to your project</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus margin="dense" id="deliverableDate1" label="Deadline date for the first deliverable(format dd/MM/yyyy)" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setDeliverableDate1(e.target.value);
              }} />
            <TextField
              autoFocus margin="dense" id="deliverableDescription1" label="Description for the first deliverable" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setDeliverableDescription1(e.target.value);
              }} />
            <TextField
              autoFocus margin="dense" id="deliverableDate2" label="Deadline date for the second deliverable(format dd/MM/yyyy)" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setDeliverableDate2(e.target.value);
              }} />
            <TextField
              autoFocus margin="dense" id="deliverableDescription2" label="Description for the second deliverable" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setDeliverableDescription2(e.target.value);
              }} />
            <TextField
              autoFocus margin="dense" id="deliverableDate3" label="Deadline date for the third deliverable(format dd/MM/yyyy)" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setDeliverableDate3(e.target.value);
              }} />
            <TextField
              autoFocus margin="dense" id="deliverableDescription3" label="Description for the third deliverable" type="required" fullWidth variant="standard"
              onChange={(e) => {
                setDeliverableDescription3(e.target.value);
              }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDeliverableClose()}>Cancel</Button>
            <Button onClick={() => handleAddDeliverable()}>Add deliverable</Button>
          </DialogActions>
        </Dialog>
        <button className="NavButton">
          <img src={bell} alt="Bell" />
        </button>
        {authState && (
          <>
            <button className="NavButton" onClick={() => handleLogout()}>
              <img src={logout} alt="Log Out" />
            </button>
          </>
        )}
        {!authState && (
          <Link to='/login'>
            <button className="NavButton">
              <img src={login} alt="Log In" />
            </button>
          </Link>
        )}
      </nav>
    </div>
  )
}

export default Header;