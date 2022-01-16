import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import HeaderComponent from './components/HeaderComponent';
import Home from './controllers/Home';
import Login from './controllers/Login';
import EvaluateProject from './controllers/EvaluateProject'


function App() {


  return (
    <div className="App">
      <BrowserRouter>
        <HeaderComponent/>
        <Switch>
            <Route path='/home' component={Home}/>
            <Route path='/login' component={Login}/> 
            <Route path='/evaluateProject' component={EvaluateProject}/>            
            <Redirect to='/home'/>
       </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
