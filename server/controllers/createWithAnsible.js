const express = require('express');
const app = express();
const fs = require('fs');
const ansible = require('node-ansible')

const create_vnet = (req,res)=>{

  // get this infos from db
   var remote_user= "omw"
   var server_ip= "192.168.122.1"

  // get the infos from the form 
   var test= {
        "server_ip": "192.168.122.1",
        "vnet": {
          "name": "vnet3",
          "bridge_name": "virbr2",
          "mode": "nat",
          "gateway_ip": "192.168.52.1",
          "netmask": "255.255.255.0",
          "dhcp_start": "192.168.52.2",
          "dhcp_end": "192.168.52.100"
        }
      }
    
    test= JSON.stringify(test)

    // remplace paths 
    fs.writeFileSync('/home/omw/newApp/ansible_playbooks/create_vnet/vars/test.json',test)
    var vnet_ans= new ansible.Playbook().playbook('/home/omw/newApp/ansible_playbooks/create_vnet/main');
    vnet_ans.inventory(server_ip + ',')
    vnet_ans.user(remote_user)

    var promise = vnet_ans.exec();
    promise.then(function(successResult) {
        // if successResult.code === 0 ==> vnet created or no hosts matched 
        console.log(successResult.code); 
        // if accessed == false ==> vnet created and hosts matched
        var accessed = successResult.output.includes('no hosts matched')
        console.log(accessed)
        res.status(200).json({done: true})
      }, function(error) {
        console.error(error);
      })
}




const delete_vnet = (req,res)=>{
      var remote_user= "omw"
      var server_ip= "192.168.122.1"
      var test= {
           "server_ip": "192.168.122.1",
           "vnet": {
             "name": "vnet3"
           }
         }
       
       test= JSON.stringify(test)
   
       fs.writeFileSync('/home/omw/newApp/ansible_playbooks/remove_vnet/vars/test.json',test)
       var vnet_ans= new ansible.Playbook().playbook('/home/omw/newApp/ansible_playbooks/remove_vnet/main');
       vnet_ans.inventory(server_ip + ',')
       vnet_ans.user(remote_user)
   
       var promise = vnet_ans.exec();
       promise.then(function(successResult) {
           console.log(successResult.code); 
           var accessed = successResult.output.includes('no hosts matched')
           console.log(accessed)
           res.status(200).json({deleted: true})
         }, function(error) {
           console.error(error);
         })
   }

   const create_vm = (req,res)=>{
      var remote_user= "omw"
      var server_ip= "192.168.122.1"
      var test=   {
        "server_ip": "192.168.122.1",
        "vm": {
          "name": "testVM8",
          "ram": 1048576,
          "vcpus": 1,
          "vnet": {
            "name": "vnet2"
          },
          "volume": {
            "name": "ansVolume3",
            "pool": "testPool",
            "size": "12G",
            "type": "qcow2"
          }
        }
      }
       
       test= JSON.stringify(test)
   
       fs.writeFileSync('/home/omw/newApp/ansible_playbooks/create_vm/vars/test.json',test)
       var vm_ans= new ansible.Playbook().playbook('/home/omw/newApp/ansible_playbooks/create_vm/main');
       vm_ans.inventory(server_ip + ',')
       vm_ans.user(remote_user)
   
       var promise = vm_ans.exec();
       promise.then(function(successResult) {
           console.log(successResult.code); 
           console.log(successResult.output);
           var accessed = successResult.output.includes('no hosts matched')
           console.log(accessed)
           res.status(200).json({done: true})
         }, function(error) {
           console.error(error);
         })
   }
   

   const delete_vm = (req,res)=>{
    var remote_user= "omw"
    var server_ip= "192.168.122.1"
    var test= {
         "server_ip": "192.168.122.1",
         "vm": {
           "name": "testVM8"
         }
       }
     
     test= JSON.stringify(test)
 
     fs.writeFileSync('/home/omw/newApp/ansible_playbooks/remove_vm/vars/test.json',test)
     var vm_ans= new ansible.Playbook().playbook('/home/omw/newApp/ansible_playbooks/remove_vm/main');
     vm_ans.inventory(server_ip + ',')
     vm_ans.user(remote_user)
 
     var promise = vm_ans.exec();
     promise.then(function(successResult) {
         console.log(successResult.code); 
         var accessed = successResult.output.includes('no hosts matched')
         console.log(accessed)
         res.status(200).json({deleted: true})
       }, function(error) {
         console.error(error);
       })
 }



app.post('/create_vnet', create_vnet)
app.post('/create_vm', create_vm)
app.post('/delete_vnet', delete_vnet)
app.post('/delete_vm', delete_vm)

app.listen(5050, () =>
    console.log("connected"))