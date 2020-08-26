const con = require('../connect_db');
const util = require('util');


const query = util.promisify(con.query).bind(con);




exports.vnetList = async (req, res) => {
    try {
        var vnetsToSend = await query("SELECT vnet_id,vnet_name,vnet_state,type,mac_add,bridge_name FROM vnets inner join servers on servers.server_id = vnets.server_id WHERE vnets.server_id=? AND servers.user_id=? ORDER BY vnet_name DESC limit 3;",
                                    [req.query.server_id,res.locals.user_id])
        vnetsToSend = JSON.parse(JSON.stringify(vnetsToSend))
        res.status(200).json({ vnets: vnetsToSend });
    } catch (e) {
        res.status(200).json({ vnets: [] })
        throw (e)
    }

}
