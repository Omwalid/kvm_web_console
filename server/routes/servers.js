const express = require('express');
const router = express.Router();


const servers=require('../controllers/servers')

const isAuth = require('../middlewares/isAuth');


router.get('/update',servers.update)

router.get('/list', isAuth, servers.serverList)

router.delete('/delete/:server_id', isAuth, servers.deleteServer)

router.post('/add', isAuth ,servers.addServer)

module.exports = router