import React, { Component } from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './NavBarComponent';
import LogIn from './LogInComponent';
import Register from './RegisterComponent';
import Home from "./HomeComponent";
import Dashboard from './DashboardComponent'
import VnetBoard from './vnetComponent'
import VmBoard from './VmComponent'
import Axios from "axios";
import { Spinner } from 'react-bootstrap'


class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoggedIn: false,
      user: {},
      selected_server: ''
    }
    this.change_status = this.change_status.bind(this);
    this.selectedServer = this.selectedServer.bind(this);
  }

  selectedServer(id){
    this.setState({selected_server: id})
  }

  change_status(bol, ob) {
    this.setState({ isLoggedIn: bol, user: ob })

  }
  check_Login() {
    Axios.get('http://localhost:5000/users/logged_in', { withCredentials: true })
      .then(res => {
        if (res.data.isLoggedIn === true && this.state.isLoggedIn === false) {
          this.change_status(true, res.data.user)
        }
        else if (!res.data.isLoggedIn && this.state.isLoggedIn) {
          this.change_status(false, {})
        }
        this.setState({isLoading: false})
      })
      .catch(err =>{ if (err.response) this.setState({isLoading: false})
       // console.log(err.response.data.message);
    })
  }

  componentDidMount() {
    this.check_Login();
  }

  render() {
    return (
      <div className="App">
        {this.state.isLoading ? <Spinner animation="grow" /> : 
        <div>
        <NavBar isLoggedIn={this.state.isLoggedIn} user={this.state.user}
          change_status={this.change_status} />
        <Switch>
          <Route exact path="/home" component={Home}></Route>

         <Route  path="/register">
            {this.state.isLoggedIn ? <Redirect to="/user" /> : <Register change_status={this.change_status} isLoggedIn={this.state.isLoggedIn}>
            </Register>}
          </Route>

          <Route  path="/login">
            {this.state.isLoggedIn ? <Redirect to="/user" /> : <LogIn change_status={this.change_status} isLoggedIn={this.state.isLoggedIn}>
            </LogIn>}
          </Route>

          <Route  path="/user">
            {this.state.isLoggedIn ?  <Dashboard selectedServer={this.selectedServer} 
             notLoggedIn={()=>{this.change_status(false, {})}}
             selected_server={this.state.selected_server}/> : <Redirect to="/login" />}
          </Route>

          <Route  path="/vnet">
            {this.state.isLoggedIn  ?  <VnetBoard 
             selected_server={this.state.selected_server}/> : <Redirect to="/login" />}
          </Route>

          <Route  path="/vm">
            {this.state.isLoggedIn  ?  <VmBoard 
             selected_server={this.state.selected_server}/> : <Redirect to="/login" />}
          </Route>

          <Redirect to="/home" />
        </Switch>
        </div>
        }
      </div>
    );
  }
}

export default Main;












