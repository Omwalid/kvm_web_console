const mysql = require('mysql');


var con = mysql.createConnection({
    host: "localhost",
    user: "omw",
    password: "root",
    database: "newApp"
  });
  
  
  
  con.connect(function(err) {
    if (err) console.log(err);
   else {console.log("Connected to mysql!");   
  }
  });

module.exports = con;



















/*const mongoose= require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/newApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>console.log('successfuly connected to the db'))
.catch((err)=>console.log(err))*/