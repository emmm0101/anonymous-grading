import React from 'react'


function Home(){

    const componentDidMount = () => {
        const config = {
            headers:{
                Authorization: 'Bearer' + localStorage.getItem("accessToken")
            }
        }
    }

    return(
        <div style={{"backgroundColor": "#FFCCD5", "width": "100%", "height":"60px"}}>
           <h2>Home</h2>
        </div>
    )
}

export default Home;