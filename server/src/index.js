const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2');
const app = express();
const fs = require('fs');
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use('/imgs', express.static(path.join(__dirname, '../imgs')));

///////////////////////////////////////////////////////////
//                    API TEST                           //
///////////////////////////////////////////////////////////


app.get("/getComment", (req, res) => {
    const a = `SELECT * FROM comment`;
    pool.query(a, (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/getPost", (req, res) => {
    const a = `SELECT * FROM post`;
    pool.query(a, (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/getPost/imgs", (req, res) => {
    const a = `select photoPath from post ORDER BY postID DESC;`;
    pool.query(a, (err, data) => {
        if (err) {
            return res.json(err);
        }
        const photoPaths = data.map(item => item.photoPath);
        return res.json(photoPaths);
    })
})


app.get("/getPost/Count", (req, res) => {
    const query = `SELECT COUNT(*) FROM post`;
    pool.query(query, (err, data) => {
        if (err) {
            return res.json(err);
        }
        count = data[0]['COUNT(*)'];
        res.send(count.toString());
    });
});

app.get("/getPost/max", (req, res) => {
    const query = `SELECT MAX(postID) FROM post`;
    pool.query(query, (err, data) => {
        if (err) {
            return res.json(err);
        }
        max = data[0]['MAX(postID)'];
        if (max > 0) {
            res.send(max.toString());
        }
        else {
            res.send("0");
        }

    });
});


///////////////////////////////////////////////////////////
//                 UPLOAD IMAGE API                      //
///////////////////////////////////////////////////////////


const uploadFolder = path.join(__dirname, '../imgs/');
const storage = multer.diskStorage({
    destination: uploadFolder,
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) { return res.status(400).json({ success: false, message: 'No file uploaded' }); };

    const userId = req.body.userId;
    const postName = req.body.postName;
    const postDescription = req.body.postDescription;

    const query = `SELECT MAX(postID) FROM post`;
    pool.query(query, (err, data) => {
        if (err) { console.error(err); return res.status(500).json({ success: false, message: 'Database error' }); };
        const newPostID = data[0]['MAX(postID)'] + 1;
        const newFilename = `${newPostID}${path.extname(req.file.originalname)}`;
        //const newFilePath = `../imgs/${newFilename}`;

        fs.rename(
            path.join(uploadFolder, req.file.filename),
            path.join(uploadFolder, newFilename),

            (err) => {
                if (err) return res.status(500).json({ success: false, message: 'File rename error' });

                const insertQuery = `INSERT INTO post (postID, postName, postDescription, userID, photoPath, postTime, avgRating) 
                                     VALUES (?, ?, ?, ?, ?, NOW(), ?)`;

                const values = [
                    newPostID,
                    postName,
                    postDescription,
                    userId,
                    newFilename,
                    req.body.avgRating || 0
                ];

                pool.query(insertQuery, values, (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ success: false, message: 'Insert error' });
                    }

                    res.json({ success: true, filePath: newFilename, postID: newPostID, userId });
                });
            }
        );
    });
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


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