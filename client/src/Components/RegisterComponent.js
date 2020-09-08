
import React, { Component } from "react";
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';



class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            userName: '',
            email: '',
            password: '',
            confpassword: '',
            error: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    FormIsNotEmpty() {
        if (this.state.fullName && this.state.userName && this.state.password && this.state.email && this.state.confpassword) {
            return true
        }
        else return false
    }
    PasswordIsValid() {
        if (this.state.password.length < 6) {
            this.setState({ error: "password should contain more than 6 characters" })
            return false
        }
        else if (this.state.password !== this.state.confpassword) {
            this.setState({ error: "passwords don't match" })
            return false
        }
        else return true
    }
    FormIsValid() {
        if (!this.FormIsNotEmpty()) {
            this.setState({ error: "Please fill all fields" })
            return false
        }
        else if (!this.PasswordIsValid()) { return false }
        else return true
    }



    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.FormIsValid()) {

            const user = {
                fullName: this.state.fullName,
                userName: this.state.userName,
                email: this.state.email,
                password: this.state.password
            }

            axios.post(`http://localhost:5000/users/register`, user, { withCredentials: true })
                .then(
                    res => {
                        if (res.status === 201 && res.data.userAdded === true) {
                            this.props.change_status(true, res.data.user)
                        }
                    }
                )
                .catch(e => {
                    if (e.response.status === 409) {
                     //   alert("email already exists !")
                     this.setState({ error: "email already exists !" })
                    }
                    else console.log(e);
                })
        } else console.log("error");
    }
    render() {
        return (
            <div className="container">
                <div className="col-12 col-md-5 m-1">
                    <p style={{ color: "red" }}>{this.state.error}</p>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="formBasicFullName">
                            <Form.Label>Full-name</Form.Label>
                            <Form.Control type="text" name="fullName" value={this.state.fullName}
                                onChange={this.handleInputChange} placeholder="Enter your full-name" />
                        </Form.Group>
                        <Form.Group controlId="formBasicUserName">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="userName" value={this.state.userName}
                                onChange={this.handleInputChange} placeholder="Enter username" />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" name="email" value={this.state.email}
                                onChange={this.handleInputChange} placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" value={this.state.password}
                                onChange={this.handleInputChange} placeholder="Password" />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Confirm the Password</Form.Label>
                            <Form.Control type="password" name="confpassword" value={this.state.confpassword}
                                onChange={this.handleInputChange} placeholder="Confirm the Password" />
                        </Form.Group>
                        <Button variant="primary" type="submit" >
                            Submit
                        </Button>
                    </Form>
                </div>

            </div>

        );
    }
}
export default Register;










