import React, { Component } from 'react'
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap'
import axios from 'axios';


class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            serverName: '',
            serverIp: '',
            remoteUser: '',
            show: false,
            server_id: '',
            servers: []
        }
        this.handleShow = this.handleShow.bind(this);
        this.hideShow = this.hideShow.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteServer = this.deleteServer.bind(this);

    }


    handleShow() {
        this.setState({ show: true })
    }
    hideShow() {
        this.setState({ show: false })
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

        const newServer = {
            serverName: this.state.serverName,
            serverIp: this.state.serverIp,
            remoteUser: this.state.remoteUser
        }


        axios.post(`http://localhost:5000/servers/add`, newServer, { withCredentials: true })
            .then(
                res => {
                    if (res.status === 201 && res.data.server_added === true) {
                        this.hideShow();
                        window.location.reload(false);
                    }
                }
            )
            .catch(err => {
                if (err.response.status === 401 && err.response.data.message === "not logged_in") { this.props.notLoggedIn() }
                else if (err.response.status === 409) { alert(err.response.data.message) }
                else if (err.response.status === 500) { alert("make sure you entered the correct input, added the public key into your server and ssh and python is installed")}
            })


    }

    deleteServer(id) {
        var server_id = id
        axios.delete(`http://localhost:5000/servers/delete/` + server_id, { withCredentials: true })
            .then(
                res => {
                    if (res.status === 200 && res.data.deleted === true) {
                        window.location.reload(false);
                    }
                }
            )
            .catch(err => {
                if (err.response.status === 401 && err.response.data.message === "not logged_in") { this.props.notLoggedIn() }
                else if (err.response.status === 409) { alert("server already deleted or doesn't exist") }
            })
    }

    updateServer(id) {
        var server_id = id
        axios.get(`http://localhost:5000/servers/update?server_id=` + server_id, { withCredentials: true })
            .then(
                res => {
                    if (res.status === 200) {
                        window.location.reload(false);
                    }
                }
            )
            .catch(err => {
                if (err.response.status === 401 && err.response.data.message === "not logged_in") { this.props.notLoggedIn() }
                else if (err.response.status === 500) { alert("Updating failed") }
            })
    }

    componentDidMount() {
        axios.get('http://localhost:5000/servers/list', { withCredentials: true })
            .then(res => {
                if (res.status === 200) {
                    this.setState({ servers: res.data.servers })
                    this.setState({ isLoading: false })
                }
            })
            .catch(err => {
                if (err.response.status === 401 && err.response.data.message === "not logged_in")
                    this.props.notLoggedIn()
            })
    }

    render() {
        var nb = 0;
        const serverTable = this.state.servers.map((server) => {
            nb += 1;
            return (
                <tr id={server.server_id} onClick={() => this.props.selectedServer(server.server_id)}>
                    <td>{nb}</td>
                    <td>{server.server_name}</td>
                    <td>{server.server_ip}</td>
                    <td>{server.adding_date}</td>
                    <td><Button variant="primary" style={{ width: "100%" }}
                        onClick={() => this.updateServer(server.server_id)}
                    >update</Button></td>
                    <td><Button variant="danger" style={{ width: "100%" }}
                        onClick={() => this.deleteServer(server.server_id)}
                    >delete</Button></td>
                </tr>
            );
        });

        return (
            this.state.isLoading ? <Spinner animation="grow" /> :
                <div className="container">
                    <h2>selected server: {this.props.selected_server}</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>server name</th>
                                <th>server ip</th>
                                <th>adding date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {serverTable}
                        </tbody>
                    </Table>
                    <div className="col-12 col-md-5 m-1">
                        <Button className="m 2" variant="primary" size="lg" onClick={this.handleShow}>
                            add server
                </Button>
                    </div>
                    <Modal
                        show={this.state.show}
                        onHide={this.hideShow}
                        dialogClassName="modal-90w"
                        aria-labelledby="example-custom-modal-styling-title"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="example-custom-modal-styling-title">
                                Add a server
          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group controlId="formBasicFullName">
                                    <Form.Label>server name</Form.Label>
                                    <Form.Control type="text" name="serverName" value={this.state.serverName}
                                        onChange={this.handleInputChange} placeholder="Enter the server name" />
                                </Form.Group>
                                <Form.Group controlId="formBasicUserName">
                                    <Form.Label>server ip</Form.Label>
                                    <Form.Control type="text" name="serverIp" value={this.state.serverIp}
                                        onChange={this.handleInputChange} placeholder="Enter the server ip" />
                                </Form.Group>
                                <Form.Group controlId="formBasicUserName">
                                    <Form.Label>remote user</Form.Label>
                                    <Form.Control type="text" name="remoteUser" value={this.state.remoteUser}
                                        onChange={this.handleInputChange} placeholder="Enter the remote user" />
                                </Form.Group>

                                <Button variant="primary" type="submit" >
                                    add the server
                        </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>

                </div>

        );
    }



}

export default Dashboard;