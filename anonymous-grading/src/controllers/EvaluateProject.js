import React, {useEffect, useState} from 'react'
import axios from 'axios';
import happyStudents from '../assets/pictures/happyStudents.png';
import evaluate2 from '../assets/pictures/evaluate2.png';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function EvaluateProject(){
    const [projectChecked, setprojectChecked] = useState(false);
    const [deliverable, setDeliverable] = useState('');
    const [project, setProject] = useState('');

    const [value, setValue] = React.useState(0);
    const [hover, setHover] = React.useState(-1);

    const labels = {
      0.5: '2',
      1: '2.5',
      1.5: '3',
      2: '4',
      2.5: '5',
      3: '6',
      3.5: '7',
      4: '8',
      4.5: '9',
      5: '10',
    };



    useEffect(() => {
      axios.get("http://localhost:3001/getProjectIdFromDeliverable", {
        headers: {
          deliverableID: localStorage.getItem("deliverableID"),
        },
      }).then((response) => {
        if (response.data.error) {
          console.log(false)
        } else {
          console.log(response.data)
          localStorage.setItem("projectToEvaluate", response.data)
        }
      });

      const data2 = {
        projectToEvaluate: localStorage.getItem("projectToEvaluate"),
        deliverableID: localStorage.getItem("deliverableID")
      }

      console.log(data2)
      axios.put("http://localhost:3001/updateProjectID", data2).then((response) => {
        if (response.data.error) {
          console.log(false)
        } else {
          console.log(response.data)
        }
      });
    })
    const sendGrade = () => {
      const data = {
        deliverableID: localStorage.getItem("deliverableID"),
        grade: value
      }
      axios.put("http://localhost:3001/updateGrade", data).then((response) => {
        if (response.data.error) {
          console.log(response.data.error)
        } else {
          console.log(response.data)
        }
      });
    }


    if(projectChecked == false){
        axios.get("http://localhost:3001/evaluateProject", {
          headers: {
            deliverableID: localStorage.getItem("deliverableID")
          },
          }).then((response) => {
          if (response.data.error) {
            console.log(response.data.error)
          } else {
            //console.log(response.data)
            setprojectChecked(true);
            setDeliverable(response.data[0]);
            setProject(response.data[1]);
          }
        });
        console.log(deliverable)
      }
    return(
      <div className='evaluateDiv'>
      <h3>Evaluate the project</h3> 
      <div className="splitLeft left">
       <div>
       <h4 className="projectTitle">{project.name}</h4>
         <a href={project.link}><button className='githubButton'>Go to Github</button></a>
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
                           {deliverable.ddl_date}
                       </div>
                       <div className="cell2" data-title="Last Name">
                       {deliverable.description}
                       </div>
                   </div>
               </div>
           </div>
       </div>
       <Typography component="legend">Rate the project</Typography>
      {/* <Rating
        name="simple-controlled"
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      /> */}
       <Rating
        name="hover-feedback"
        value={value}
        precision={0.5}
        onChange={(event, newValue) => {
          setValue(newValue);
          const data = {
            deliverableID: localStorage.getItem("deliverableID"),
            grade: newValue
          }
          axios.put("http://localhost:3001/updateGrade", data).then((response) => {
            if (response.data.error) {
              console.log(response.data.error)
            } else {
              console.log(response.data)
            }
          });
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
            {value !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
      )}
   </div>
       </div>
     </div>

     {/* <Rating value={state.val1} onChange={(e) => this.setState({val1: e.value})} /> */}
    <div className="splitRight right">
       <div className="centered">
         <img src={evaluate2} alt="Avatar man" style={{"width": "600px"}}/>
       </div>
     </div> 
     </div>
    )
}

export default EvaluateProject;