import React, { Component } from 'react'
import { Table, Button, Alert, Spinner } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';

class VnetBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            vnets: []
        }
    }

    componentDidMount() {
        var server_id = this.props.selected_server
        axios.get('http://localhost:5000/vnets/list?server_id=' + server_id, { withCredentials: true })
            .then(res => {
                if (res.status === 200) {
                    this.setState({ vnets: res.data.vnets })
                    this.setState({isLoading: false})

                }
                else { console.log("problem on the server") }
            })
    }

    render() {
        var nb = 0;
        const vnetTable = this.state.vnets.map((vnet) => {
            nb += 1;
            return (
                <tr id={vnet.vnet_id}>
                    <td>{nb}</td>
                    <td>{vnet.vnet_name}</td>
                    <td>{vnet.vnet_state}</td>
                    <td>{vnet.type}</td>
                    <td>{vnet.mac_add}</td>
                    <td>{vnet.bridge_name}</td>
                    <td><Button variant="danger" style={{ width: "100%" }}>delete</Button></td>
                </tr>
            );
        });
        return (
          this.state.isLoading ? <Spinner animation="grow" /> : 
            this.props.selected_server.length !== 0 ?
                <div className="container">
                    <h2>selected server: {this.props.selected_server}</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>vnet name</th>
                                <th>vnet state</th>
                                <th>type</th>
                                <th>mac add</th>
                                <th>bridge name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {vnetTable}
                        </tbody>
                    </Table>
                    <div className="col-12 col-md-5 m-1">
                        <Button className="m 2" variant="primary" size="lg">
                            add network
            </Button>
                    </div>
                </div>
                :
                <Alert variant="danger">
                    <Alert.Heading>No server selected!</Alert.Heading>
                    <p>
                        You need to select a server first to display vnets
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                       <LinkContainer to="/user">
                          <Button className="m 2" variant="outline-danger" size="lg">select a server</Button>
                       </LinkContainer>
                    </div>
                </Alert>
        );
    }
}

export default VnetBoard;