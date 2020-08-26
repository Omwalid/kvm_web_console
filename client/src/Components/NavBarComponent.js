import React, { Component } from "react";
import { Nav, Navbar, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios'

class NavBar extends Component {
    constructor(props){
        super(props);
        this.logout=this.logout.bind(this);
    }

    logout(){
        axios.get(`http://localhost:5000/users/logout`,{withCredentials: true})
        .then( 
           async res => {
            if(res.status === 200 && res.data.loggedOut === true) {
            this.props.change_status(false,{}) 
            console.log('logged-out')
            }
            else {console.log("user still logged-in")}   
         }
         )
         .catch(e=>{console.log(e)})
 }


    isLogged() {
        if (!this.props.isLoggedIn) {
            return (
                <React.Fragment>
                    <LinkContainer to="/login">
                        <Nav.Link href="">Login</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/register">
                        <Nav.Link href="">Register</Nav.Link>
                    </LinkContainer>
                </React.Fragment>
            )
        }
        else return (
            <React.Fragment>
            <LinkContainer to="/user">
                <Nav.Link href="">{this.props.user.userName}</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/vnet">
                <Nav.Link href="">vnets</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/vm">
                <Nav.Link href="">vms</Nav.Link>
            </LinkContainer>
                <Button variant="outline-info" onClick={this.logout}>log-out</Button>
            </React.Fragment>

        );
    }
    render() {
        const vo = this.isLogged();
        return (
            <div>
                
                <Navbar bg="dark" variant="dark">
                    <LinkContainer to="/home">
                        <Navbar.Brand href="">newApp</Navbar.Brand>
                    </LinkContainer>
                    <Nav className="mr-auto">
                        <LinkContainer to="/home">
                            <Nav.Link href="">Home</Nav.Link>
                        </LinkContainer>
                        {vo}

                    </Nav>
                </Navbar>
            </div>
        );
    }
}

export default NavBar;