const con = require('../connect_db');
const util = require('util');


const query = util.promisify(con.query).bind(con);




exports.vmList = async (req, res) => {
    try {
        var vmsToSend = await query("SELECT vm_id,vm_name,vm_state,vcpus,memory,ip_add,vnet FROM vms inner join servers on servers.server_id = vms.server_id WHERE vms.server_id=? AND servers.user_id ORDER BY vm_name DESC limit 3;",
                                     [req.query.server_id,res.locals.user_id])
        vmsToSend = JSON.parse(JSON.stringify(vmsToSend))
        res.status(200).json({ vms: vmsToSend });
    } catch (e) {
        res.status(200).json({ vms: [] })
        throw (e)
    }

}
