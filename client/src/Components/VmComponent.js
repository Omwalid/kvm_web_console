import React, { Component } from 'react'
import { Table, Button, Alert, Spinner } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';

class VmBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            vms: []
        }
    }

    componentDidMount() {
        var server_id=this.props.selected_server
        axios.get('http://localhost:5000/vms/list?server_id='+server_id ,{ withCredentials: true })
            .then(res => {
                if (res.status === 200) {
                    this.setState({ vms: res.data.vms })
                    this.setState({isLoading: false})
                }
                else { console.log("problem on the server") }
            })
    }

    render(){
        var nb = 0;
        const vmTable = this.state.vms.map((vm) => {
            nb += 1;
            return (
                <tr id={vm.vnet_id}>
                    <td>{nb}</td>
                    <td>{vm.vm_name}</td>
                    <td>{vm.vm_state}</td>
                    <td>{vm.vcpus}</td>
                    <td>{vm.memory}</td>
                    <td>{vm.ip_add}</td>
                    <td>{vm.vnet}</td>
                    <td><Button variant="danger" style={{ width: "100%" }}>delete</Button></td>
                </tr>
            );
        });
        return(
        this.state.isLoading ? <Spinner animation="grow" /> : 
            this.props.selected_server.length !== 0 ?
            <div className="container">
            <h2>selected server: {this.props.selected_server}</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>vm name</th>
                        <th>vm state</th>
                        <th>vcpus</th>
                        <th>memory</th>
                        <th>ip_add</th>
                        <th>vnet</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {vmTable}
                </tbody>
            </Table>
            <div className="col-12 col-md-5 m-1">
                <Button className="m 2" variant="primary" size="lg">
                    add vm
            </Button>
            </div>
        </div>
        :
        <Alert variant="danger">
            <Alert.Heading>No server selected!</Alert.Heading>
            <p>
                You need to select a server first to display VMs
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

export default VmBoard;