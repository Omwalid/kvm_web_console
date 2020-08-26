const express = require('express');
const router = express.Router();

const vnets=require('../controllers/vnets')

const isAuth = require('../middlewares/isAuth');

router.get('/list', isAuth, vnets.vnetList)

module.exports = router