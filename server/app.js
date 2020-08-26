const express= require('express');
const app= express();
const cookieParser= require('cookie-parser');
const session = require("express-session");
const bodyParser= require('body-parser');
var cors = require('cors');


var userRoute = require('./routes/users')
var serverRoute= require('./routes/servers')
var vnetRoute= require('./routes/vnets')
var vmRoute= require('./routes/vms')


require('./connect_db');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
  }));
  
  app.use(session({
    secret: 'secretTest',
    resave: true,
    saveUninitialized: true
}));


app.use('/users', userRoute);
app.use('/servers', serverRoute);
app.use('/vnets', vnetRoute);
app.use('/vms', vmRoute);




app.listen(5000, () => {
    console.log("express server listen to the port 5000");
});