const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2');
const app = express();
const path = require('path');
require('dotenv').config({ path: '../.env' });

const port = 5000;
app.use(cors());


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

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../imgs/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.json({ success: true, filePath: `../img/${req.file.filename}` });
});

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////


//API for checking Username
app.post('/checkUsername', (req, res) => {
    const query = `select count(*) from customer where userName = '${req.body.username}'`;
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



//API for create new account in user database
app.post('/registerNonClubMember', (req, res) => {
    const body = req.body
    var queryCommand = 'insert into customer(userName,passWord,accName,createTime) values(?,?,?,NOW())'
    console.log(body)
    pool.query(queryCommand, [body.username, body.password, body.accountName], (err, results) => {
        if (err) {
            console.log(err)
            return res.json({ success: false })
        }
        return res.json({ success: true })
    })
})


app.listen(port, () => { console.log('\x1b[36m%s\x1b[0m is started/updated', `http://localhost:${port}`); })