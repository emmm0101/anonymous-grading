import React, {useState} from 'react'
import axios from 'axios';
import happyStudents from '../assets/pictures/happyStudents.png';
import evaluate2 from '../assets/pictures/evaluate2.png';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

function EvaluateProject(){
    const [projectChecked, setprojectChecked] = useState(false);
    const [deliverable, setDeliverable] = useState('');
    const [project, setProject] = useState('');

    const [value, setValue] = React.useState(2);


    if(projectChecked == false){
        axios.get("http://localhost:3001/evaluateProject", {
          headers: {
            deliverableID: localStorage.getItem("deliverableID")
          },
          }).then((response) => {
          if (response.data.error) {
            console.log(response.data.error)
          } else {
            console.log(response.data)
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
      <Rating
        name="simple-controlled"
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
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