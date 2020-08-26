const util = require('util');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const con = require('../connect_db');


const query = util.promisify(con.query).bind(con);
bcrypt.compare = util.promisify(bcrypt.compare);
bcrypt.hash = util.promisify(bcrypt.hash);


exports.LoggedIn = async (req, res) => {
    try {
        var user = await query("SELECT user_id, email, userName FROM user WHERE user_id=?", res.locals.user_id)
        user = JSON.parse(JSON.stringify(user))
        res.status(200).json({ isLoggedIn: true, user: user[0] })

    } catch (e) {
        res.status(401).json({ isLoggedIn: false, message: "user doesn't exist" })
    }
}



exports.Register = async (req, res) => {
    try{
    const newUser = {
        fullName: req.body.fullName,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    }
    //crypt the password 
    var hashedPasswd= await bcrypt.hash(newUser.password, 10)
    newUser.password = hashedPasswd;

    //create a user in the db
    var adding= await query('INSERT INTO user SET ?', newUser)
                      .catch(err=>{ return res.status(409).json({userAdded: false, message:"email already exists"})})

    delete newUser.password;
    newUser.user_id=adding.insertId

    //generate a token
    const token = jwt.sign(newUser, 'secretTest')

    res.cookie('access_token', token, { maxAge: 300000, httpOnly: true })
    res.status(201).json({ userAdded: true, user: newUser });
  }
  catch (e) { res.status(500).end();}

}



exports.Login = async (req, res) => {
    try {
        //get info from the req
        const userLogin = {
            email: req.body.email,
            password: req.body.password
        }

        //search for the email in db
        var user = await query("SELECT user_id,email, password, userName FROM user WHERE email=?", userLogin.email)
        user = JSON.parse(JSON.stringify(user))

        //if email not found
        if (!user[0]) {
            return res.status(401).json({ isLoggedIn: false, message: "incorrect email" });
        }
        //if found
        //check the passwrd
        const passwordMatched = await bcrypt.compare(userLogin.password, user[0].password);

        // if it's incorrect
        if (!passwordMatched) {
            return res.status(401).json({ isLoggedIn: false, message: "incorrect password" });
        }

        //if it's correct 
        const dataTosend = {
            user_id: user[0].user_id,
            userName: user[0].userName,
            email: user[0].email
        }
        const token = jwt.sign(dataTosend, 'secretTest')

        res.cookie('access_token', token, { maxAge: 300000, httpOnly: true })
        res.status(200).json({ isLoggedIn: true, user: dataTosend });
    }
    catch (e) { res.status(500).end(); }
}




exports.Logout=(req,res)=>{

    //clear the cookie

try{
    req.session = null
    res.cookie('connect.sid', '', {expires: new Date(1), path: '/' });
    res.cookie('access_token', '', {expires: new Date(1), path: '/', httpOnly: false});
    res.status(200).json({loggedOut: true})
    }
    catch(e){console.log(e); res.status(500).end();}
}