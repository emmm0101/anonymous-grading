import React from 'react'
import Header from './Header'

function MainComponent(){
    return (
        <React.Fragment>
        <Header className="Header" style={{"display":"grid"}}/>
        <div></div>
        </React.Fragment>
    )
}

export default MainComponent;