const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
require('dotenv').config({ path: '../.env' });

var bcrypt = require('bcryptjs')

const port = 5000;
app.use(cors());
app.use(express.json())

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.get('/', (req, res) => {
    res.json('111111');
});

app.get("/test", (req, res) => {
    res.json('test1 test2 test3');
});

app.get("/getPost", (req, res) => {
    const a = `SELECT * FROM post`;
    pool.query(a, (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/getPost/Count", (req, res) => {
    const query = `SELECT COUNT(*) FROM comment`;
    pool.query(query, (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data[0]);
    });
});

app.get("/getComment", (req, res) => {
    const a = `SELECT * FROM comment`;
    pool.query(a, (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

//API for checking Username
app.post('/checkUsername', (req, res) => {
    const query = `select count(*) from user where userName = '${req.body.username}'`;
    pool.query(query, (err, data) => {
        if (err) {
            return res.json(err);
        }

        if (data[0]['count(*)'] != 0) {
            return res.json({ "Status": true })
        } else {
            return res.json({ "Status": false })
        }
    })
})

//API for checking accName
app.post('/checkAccname', (req, res) => {
    const query = `select count(*) from user where accName = '${req.body.accountName}'`;
    pool.query(query, (err, data) => {
        if (err) {
            return res.json(err);
        }

        if (data[0]['count(*)'] != 0) {
            return res.json({ "Status": true })
        } else {
            return res.json({ "Status": false })
        }
    })
})

app.post('/checkstdID', (req, res) => {
    const query = `select count(*) from clubmemberid where studentID = '${req.body.stdID}'`;
    pool.query(query, (err, data) => {
        if (err) {
            return res.json(err);
        }

        if (data[0]['count(*)'] != 0) {
            return res.json({ "Status": true })
        } else {
            return res.json({ "Status": false })
        }
    })
})

//Check both username and password
app.post('/login', (req, res) => {
    const query = `select * from user where userName = '${req.body.username}'`;
    pool.query(query, (err, data) => {
        if(bcrypt.compareSync(req.body.password, data[0].passWord)){
            return res.json({"ID" : data[0].userID, "Status": true })
        }else{
            return res.json({"ID" : null, "Status": false })
        }
    })
    
})

app.post('/getData', (req, res) => {
    const query = `select roleName from role where roleID = (select roleID from user where userID = ${req.body.userID})`;
    pool.query(query, (err, data) => {
        if(data[0]){
            return res.json({"Role" : data[0].roleName, "Status" : true})
        }else{
            return res.json({"Role" : null, "Status" : false})
        }
        
    })
    
})

app.post('/getData2', (req, res) => {
    const query = `select accName,profilePic from user where userID = ${req.body.userID}`;
    pool.query(query, (err, data) => {
        if(data[0]){
            return res.json({"accName" : data[0].accName,"profilePath" : data[0].profilePic, "Status" : true})
        }else{
            return res.json({"accName" : null,"profilePath" : null, "Status" : false})
        }
        
    })
    
})

//For verifying email address(Spam Prevention)
const nodemailer = require('nodemailer');
const { data } = require('react-router-dom');

//Setup the sender email: Email and Password config in env file
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.serverEmail,
        pass: process.env.APP_PASSWORD
    },
})



//Generate 6-digits OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

//The OTP sending function
async function sendOTP(transporter, email) {
    const otp = generateOTP()

    const mailOption = {
        from: {
            name: 'PAPHON',
            address: process.env.serverEmail
        },
        to: email,
        subject: 'Verify Your Registration',
        text: `SYSTEM ENGINEERING TESTING\nPlease Verify your Registration from our website\n Your OTP is ${otp} .`,
    }

    try {
        await transporter.sendMail(mailOption)
    } catch (error) {
        console.error(error)
        return error
    }
    return (otp)
}

app.post('/Sendotp', async (req, res) => {
    try {
        const otp = await sendOTP(transporter, req.body.email); // Wait for the OTP to be sent
        res.json({ success: true, OTP: otp }); // Send the OTP back to the client
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
})

function createSalt(p){
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(p,salt)

    var ret = {s :salt , hp : hash}
    return ret
}



//API for create new account in user database
//Insert Profile Pic Path Later to be default
app.post('/registerNonClubMember', (req, res) => {
    const defaultProfilePicPath = "Insert Default Path Here"
    const body = req.body
    var ep = createSalt(req.body.password)
    console.log(ep)
    var queryCommand = `insert into user(userName,passWord,salt,accName,createTime,roleID,profilePic) values(?,"${ep.hp}","${ep.s}",?,NOW(),3,"${defaultProfilePicPath}")`
    pool.query(queryCommand, [body.username, body.password, body.accountName], (err, results) => {
        if (err) {
            console.log(err)
            return res.json({ success: false })
        }
        return res.json({ success: true })
    })
})

app.post('/registerClubMember', (req, res) => {
    const defaultProfilePicPath = "Insert Default Path Here"
    const body = req.body
    var ep = createSalt(req.body.password)
    var queryCommand = `insert into user(userName,passWord,salt,accName,createTime,roleID,profilePic) values(?,${ep.hp},${ep.s},?,NOW(),2,"${defaultProfilePicPath}")`
    pool.query(queryCommand, [body.username, body.password, body.accountName], (err, results) => {
        if (err) {
            console.log(err)
            return res.json({ success: false })
        }
        return res.json({ success: true })
    })
})

app.listen(port, () => { console.log('\x1b[36m%s\x1b[0m is started/updated', `http://localhost:${port}`); })