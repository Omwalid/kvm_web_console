const express = require('express');
const router = express.Router();


const vms= require('../controllers/vms')

const isAuth = require('../middlewares/isAuth');


router.get('/list', isAuth, vms.vmList)

module.exports = router