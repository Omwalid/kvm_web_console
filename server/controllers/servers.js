const con = require('../connect_db');
const util = require('util');
const ansible = require('node-ansible')
const axios = require('axios')
const execSync = require('child_process').exec;




const query = util.promisify(con.query).bind(con);




exports.serverList = async (req, res) => {
    try {
        var serversToSend = await query("SELECT server_id,server_name,server_ip, DATE_FORMAT(adding_date,\"%Y-%m-%d\") adding_date FROM servers WHERE user_id=? ORDER BY adding_date DESC limit 3;", res.locals.user_id)
        serversToSend = JSON.parse(JSON.stringify(serversToSend))
        res.status(200).json({ servers: serversToSend });
    } catch (e) {
        res.status(500).end();
        throw (e)
    }
}



exports.deleteServer = async (req, res) => {
    try {
        var serverDelete = await query("delete servers, vnets, vms from servers left join vnets on servers.server_id=vnets.server_id  left join vms on servers.server_id=vms.server_id where servers.server_id=?;",req.params.server_id)
        if (serverDelete.affectedRows === 0) {
            return res.status(409).json({ deleted: false });
        }
        res.status(200).json({ deleted: true });
    } catch (e) {
        res.status(500).end()
        throw (e)
    }
}




exports.addServer = async (req, res, next) => {

    var newServer = {
        server_name: req.body.serverName,
        server_ip: req.body.serverIp,
        remote_user: req.body.remoteUser,
        user_id: res.locals.user_id
    }

    //ping the remote server
    var ping = new ansible.AdHoc().hosts(newServer.server_ip).module('ping');
    ping.inventory(newServer.server_ip + ',')
    ping.user(newServer.remote_user)
    promise = ping.exec();

    promise.then(async function (succ) {

        var select = await query('SELECT server_id from servers where server_ip=? AND remote_user=? AND user_id=?',[newServer.server_ip,newServer.remote_user,newServer.user_id])

        if( Array.isArray(select) && select.length ){
                return res.status(409).json({server_add: false, message: "server already exists"})
           }
         else{
            var adding = await query('INSERT INTO servers SET ?', newServer)
            var server_id= adding.insertId
           }

            axios.get(`http://localhost:5000/servers/update?server_id=`+server_id, { withCredentials: true })
            .then(resu=>{ 
                res.status(201).json({ server_added: true, updated: true })
                })
            .catch(e=>{console.log(e)
                res.status(201).json({ server_added: true, updated: false })
             })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: "problem with remote server"});
        })
}






exports.update = async (req, res) => {
    var server_id= req.query.server_id
    try{
    var getinfo = await query("SELECT server_ip, remote_user FROM servers WHERE server_id=?;",server_id)
    getinfo = JSON.parse(JSON.stringify(getinfo))
    var ip= getinfo[0].server_ip
    var user=getinfo[0].remote_user
   }catch(e){throw e}


    command='ssh '+user+'@'+ip+' "bash -s" < /home/omw/newApp/scripts/sys_info'
    const myShellScript = execSync(command)
  
    var vnets = [];
    var vms=[];
    var promise = new Promise((resolve, reject) => {
        myShellScript.stdout.on('data', (data) => {
            var str = data.split('@@')
            var vs=[]
            var vss=[]
            for (var i in str) {
                if (str[i] === '\n') { return resolve() }
                var substr=str[i].split('@')
                for(var j in substr){
                  if(i==0){vs[j] = JSON.parse(substr[j]);}
                   else vss[j] = JSON.parse(substr[j]);
                }
                if(i==0){vms=vs}
                else{vnets=vss}
            }
            resolve()
        })
    })

    promise.then(async() => {
        try{
        var deleting2 = await query('delete from vnets where server_id=?', server_id)
        var deleting2 = await query('delete from vms where server_id=?', server_id)

        for(var i in vnets){
            vnets[i].server_id=server_id
            var adding = await query('INSERT INTO vnets SET ?', vnets[i])
        }
        for(var i in vms){
            vms[i].server_id=server_id
            var adding = await query('INSERT INTO vms SET ?', vms[i])
        }
        res.status(200).end();
    }
     catch(e){throw e}

    })
        .catch(e => {
            res.status(500).end()
            throw e
        })


}