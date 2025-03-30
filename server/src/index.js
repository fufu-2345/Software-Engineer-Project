const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2');
const app = express();
const fs = require('fs');
const path = require('path');
const { check, validationResult } = require('express-validator');
require('dotenv').config({ path: '../.env' });

var bcrypt = require('bcryptjs')

const port = 5000;
app.use(cors());
app.use(express.json());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../profilePicture')));

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.get('/', (req, res) => {
    res.json(process.env.HOST + " " + process.env.USER + " " + process.env.PASSWORD + " " + process.env.DATABASE);
});

app.get("/test", (req, res) => {
    res.json('test1 test2 test3');
});

// ตรวจสอบและสร้างโฟลเดอร์ uploads 
const uploadDir = path.join(__dirname, '../profilePicture');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// ตั้งค่าการอัปโหลดรูปภาพ
const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload2 = multer({ storage: storage2 });

// ดึงข้อมูลโปรไฟล์ผู้ใช้
app.get('/getUserProfile/:id', (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: 'Database connection error' });
        }
        const query = `SELECT userID, accName, accDescription, Instagram, X, Line, Phone, Other, profilePic FROM user WHERE userID = ?`;
        pool.query(query, [id], (err, data) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (data.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(data[0]);
        });
    });
});

// อัปเดตข้อมูลโปรไฟล์ผู้ใช้
app.post('/updateProfile', upload2.single('image'), (req, res) => {
    const { accName, accDescription, Instagram, X, Line, Phone, Other, userId } = req.body;
    const newProfilePic = req.file ? req.file.filename : null;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // ดึงชื่อไฟล์รูปภาพเดิม
    const getUserQuery = 'SELECT profilePic FROM user WHERE userID = ?';
    pool.query(getUserQuery, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const oldProfilePic = results[0]?.profilePic;

        let query, values;
        if (newProfilePic) {
            query = `UPDATE user SET accName = ?, accDescription = ?, Instagram = ?, X = ?, Line = ?, Phone = ?, Other = ?, profilePic = ? WHERE userID = ?`;
            values = [accName, accDescription, Instagram, X, Line, Phone, Other, newProfilePic, userId];
        } else {
            query = `UPDATE user SET accName = ?, accDescription = ?, Instagram = ?, X = ?, Line = ?, Phone = ?, Other = ? WHERE userID = ?`;
            values = [accName, accDescription, Instagram, X, Line, Phone, Other, userId];
        }

        pool.query(query, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // ส่งค่า profilePic ใหม่กลับไปให้ client
            res.json({ message: 'Profile updated successfully', profilePic: newProfilePic || oldProfilePic });

            if (newProfilePic && oldProfilePic && oldProfilePic !== 'standard.png') {
                const oldImagePath = path.join(uploadDir, oldProfilePic);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error('Error deleting old profile picture:', err);
                    });
                }
            }
        });
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use('/imgs', express.static(path.join(__dirname, '../imgs')));
app.use('/news', express.static(path.join(__dirname, '../news')));
app.use('/profilePicture', express.static(path.join(__dirname, '../profilePicture')));

///////////////////////////////////////////////////////////
//                    API TEST                           //
///////////////////////////////////////////////////////////

app.get("/getPost/imgs/", (req, res) => {
    const { sortMode, mode } = req.query;

    const order = sortMode === 'DESC' ? 'DESC' : 'ASC';
    const column = mode === 'postID' ? 'postID' : 'avgRating';
    const search = req.query.search;

    let a;
    if (column === 'avgRating') {
        a = `select photoPath from post WHERE avgRating > 0 ORDER BY ${column} ${order};`;

        pool.query(a, (err, data) => {
            if (err) {
                return res.json(err);
            }
            a = `select photoPath from post WHERE avgRating = 0 ORDER BY postID DESC;`;
            let photoPaths = data.map(item => item.photoPath);
            pool.query(a, (err, data) => {
                if (err) {
                    return res.json(err);
                }
                photoPaths = photoPaths.concat(data.map(item => item.photoPath));
                return res.json(photoPaths);
            })
        })
    }
    else {
        a = `select post.photoPath from post JOIN user ON post.userID = user.userID WHERE user.userName LIKE '%${search}%' ORDER BY ${column} ${order}`;

        pool.query(a, (err, data) => {
            if (err) {
                return res.json(err);
            }
            const photoPaths = data.map(item => item.photoPath);
            return res.json(photoPaths);
        })
    }
})

app.get("/getPost/imgs2/", (req, res) => {
    const { sortMode, mode } = req.query;
    const order = sortMode === 'DESC' ? 'DESC' : 'ASC';
    const column = mode === 'postID' ? 'postID' : 'avgRating';
    const userId = req.query.userId;
    let a;

    if (column === 'avgRating') {
        a = `select photoPath from post WHERE userID = ${userId} AND avgRating > 0 ORDER BY ${column} ${order};`;

        pool.query(a, (err, data) => {
            if (err) {
                return res.json(err);
            }
            a = `select photoPath from post WHERE userID = ${userId} AND avgRating = 0 ORDER BY postID DESC;`;
            let photoPaths = data.map(item => item.photoPath);
            pool.query(a, (err, data) => {
                if (err) {
                    return res.json(err);
                }
                photoPaths = photoPaths.concat(data.map(item => item.photoPath));
                return res.json(photoPaths);

            })
        })
    }
    else {
        a = `select photoPath from post WHERE userID = ${userId} ORDER BY ${column} ${order}`;

        pool.query(a, (err, data) => {
            if (err) {
                return res.json(err);
            }
            const photoPaths = data.map(item => item.photoPath);
            return res.json(photoPaths);
        })
    }
})

app.get("/getProfile/userID", (req, res) => {
    const search = req.query.search;

    a = `select userID from user WHERE userName LIKE '%${search}%'`;
    pool.query(a, (err, data) => {
        if (err) {
            return res.json(err);
        }
        const userID = data.map(item => item.userID).filter(userID => userID !== '');;
        return res.json(userID);
    })
})

app.get("/getProfile/imgs", (req, res) => {
    const search = req.query.search;

    a = `select profilePic from user WHERE userName LIKE '%${search}%'`;
    pool.query(a, (err, data) => {
        if (err) {
            return res.json(err);
        }
        const profilePaths = data.map(item => item.profilePic);
        return res.json(profilePaths);
    })
})

app.get("/getProfile/imgs2", (req, res) => {
    const search = req.query.search;

    a = `select profilePic from user WHERE userID = ${search}`;
    pool.query(a, (err, data) => {
        if (err) {
            return res.json(err);
        }
        const profilePaths = data.map(item => item.profilePic).filter(photoPath => photoPath !== 'Insert Default Path Here');;
        return res.json(profilePaths);
    })
})

app.get("/getProfile/name", (req, res) => {
    const search = req.query.search;

    a = `select userName from user WHERE userName LIKE '%${search}%'`;
    pool.query(a, (err, data) => {
        if (err) {
            return res.json(err);
        }
        const userName = data.map(item => item.userName).filter(userName => userName !== '');;
        return res.json(userName);
    })
})


app.get("/getRole", (req, res) => {
    const { userId } = req.query;
    const query = `SELECT roleID FROM user WHERE userId = ?`;
    pool.query(query, [userId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ roleID: data[0].roleID });
    });
});

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

app.get("/getUserid", (req, res) => {
    const id = req.query.id;
    const a = 'SELECT userID FROM post WHERE postID = ?';
    pool.query(a, [id], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json({ userID: data[0].userID });
    })
})

///////////////////////////////////////////////////////////
//                         NEWS                          //
///////////////////////////////////////////////////////////

const newsDir = path.join(__dirname, "../news");

app.get("/getNews", (req, res) => {
    fs.readdir(newsDir, (err, files) => {
        if (err) {
            return res.json({ message: "Error reading directory" });
        }

        const imageFiles = files.filter(file => file !== ".gitkeep");

        if (imageFiles.length === 0) {
            return res.json({ news: null });
        }

        res.json({ news: imageFiles[1] });
    });
});

const getNewsFilePath = () => {
    const files = fs.readdirSync(newsDir).filter(file => file.startsWith("news."));
    return files.length ? path.join(newsDir, files[0]) : null;
}

const uploadNews = multer({ storage: multer.memoryStorage() });
if (!fs.existsSync(newsDir)) {
    fs.mkdirSync(newsDir, { recursive: true });
}

app.post("/uploadNews", uploadNews.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const oldFilePath = getNewsFilePath();
    if (oldFilePath && fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
    }

    const fileExtension = path.extname(req.file.originalname);
    const newFilePath = path.join(newsDir, `news${fileExtension}`);

    fs.writeFile(newFilePath, req.file.buffer, (err) => {
        if (err) {
            return res.status(500).json({ error: "Error saving file" });
        }
        res.json({ filename: `news${fileExtension}` });
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
const checkedPost = [
    check('userId').isString().withMessage('User ID must be a string').isLength({ min: 1 }).withMessage('User ID must have at least 1 character').notEmpty().withMessage('User ID is required'),
    check('postName').optional(),
    check('postDescription').optional(),
    check('image')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Image file is required');
            }
            if (req.files && req.files.length > 1) {
                throw new Error('Only one image file is allowed');
            }
            return true;
        })
];

//https://express-validator.github.io/docs/guides/getting-started
app.post('/upload', upload.single('image'), checkedPost, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ success: false, errors: errors.array() }); };
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
        if (bcrypt.compareSync(req.body.password, data[0].passWord)) {
            return res.json({ "ID": data[0].userID, "Status": true })
        } else {
            return res.json({ "ID": null, "Status": false })
        }
    })
})

app.post('/getData', (req, res) => {
    const query = `select roleName from role where roleID = (select roleID from user where userID = ${req.body.userID})`;
    pool.query(query, (err, data) => {
        if (data[0]) {
            return res.json({ "Role": data[0].roleName, "Status": true })
        } else {
            return res.json({ "Role": null, "Status": false })
        }

    })

})

app.post('/getData2', (req, res) => {
    const query = `select accName,profilePic from user where userID = ${req.body.userID}`;
    pool.query(query, (err, data) => {
        if (data[0]) {
            return res.json({ "accName": data[0].accName, "profilePath": data[0].profilePic, "Status": true })
        } else {
            return res.json({ "accName": null, "profilePath": null, "Status": false })
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
        user: process.env.SERVEREMAIL,
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
            address: process.env.SERVEREMAIL
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

function createSalt(p) {
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(p, salt)

    var ret = { s: salt, hp: hash }
    return ret
}

//API for create new account in user database
//Insert Profile Pic Path Later to be default
app.post('/registerNonClubMember', (req, res) => {
    const body = req.body
    var ep = createSalt(req.body.password)
    var queryCommand = `insert into user(userName,passWord,salt,accName,createTime,roleID,profilePic) values(?,"${ep.hp}","${ep.s}",?,NOW(),3,"")`
    pool.query(queryCommand, [body.username, body.accountName], (err, results) => {
        if (err) {
            return res.json({ success: false })
        }
        return res.json({ success: true })
    })
})

app.post('/registerClubMember', (req, res) => {
    const body = req.body
    var ep = createSalt(req.body.password)
    var queryCommand = `insert into user(userName,passWord,salt,accName,createTime,roleID,profilePic) values(?,"${ep.hp}","${ep.s}",?,NOW(),2,"")`
    pool.query(queryCommand, [body.username, body.accountName], (err, results) => {
        if (err) {
            return res.json({ success: false })
        }
        return res.json({ success: true })
    })
})

app.listen(port, () => { console.log('\x1b[36m%s\x1b[0m is started/updated', `http://localhost:${port}`); })

// ดึงโพสต์ทั้งหมดจาก MySQL
app.get('/getPost', (req, res) => {
    pool.query(`SELECT * FROM post`, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.json(data);
    });
});

// ดึงคอมเมนต์ทั้งหมดจาก MySQL
app.get('/getComment', (req, res) => {
    pool.query(`SELECT * FROM comment`, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.json(data);
    });
});

// ตรวจสอบ Username
app.post('/checkUsername', (req, res) => {
    const { username } = req.body;
    const query = `SELECT COUNT(*) AS count FROM customer WHERE userName = ?`;
    pool.query(query, [username], (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ "Status": data[0].count > 0 });
    });
});

app.get('/getComment/:id', (req, res) => {
    const postID = req.params.id;

    const query = `
        SELECT u.userName, c.commentDescription, r.ratingValue, c.userID, c.commentTime, u.profilePic
        FROM comment c
        JOIN user u ON c.userID = u.userID
        LEFT JOIN rating r ON c.userID = r.userID AND c.postID = r.postID
        WHERE c.postID = ?
        ORDER BY c.commentTime ASC;`;

    pool.query(query, [postID], (err, result) => {
        res.json(result);
    });
});


// เพิ่มคอมเมนต์ใหม่ลง Database
app.post('/addComment', (req, res) => {
    const { postID, commentDescription, ratingValue, userID } = req.body;

    // ถ้ามีคอมเมนต์ ให้เพิ่มลงตาราง comment
    // ปลอดภัย + จำกัดความยาว comment ไม่เกิน 800 ตัว
    const cleanComment = commentDescription?.trim();
    if (cleanComment && cleanComment.length > 800) {
        return res.status(400).json({ error: "Comment too long. Max 700 characters." });
    }
    if (cleanComment) {
        const commentQuery = `INSERT INTO comment (postID, userID, commentDescription, commentTime) VALUES (?, ?, ?, NOW())`;
        pool.query(commentQuery, [postID, userID, cleanComment], (err, commentResult) => {
            if (err) return res.status(500).json({ error: "Insert comment failed", details: err });
        });
    }

    // ถ้าผู้ใช้เลือก "Select Rating" -> ให้ลบ Rating เดิม
    if (ratingValue === null || ratingValue === "") {
        const deleteRatingQuery = `DELETE FROM rating WHERE postID = ? AND userID = ?`;
        pool.query(deleteRatingQuery, [postID, userID], (err, deleteResult) => {
            //อัปเดตค่า avgRatin หลังจากลบ Rating
            updateAvgRating(postID, res);
        });

    } else {
        // ตรวจสอบว่ามี Rating อยู่แล้วหรือไม่
        const checkRatingQuery = `SELECT ratingValue FROM rating WHERE postID = ? AND userID = ?`;
        pool.query(checkRatingQuery, [postID, userID], (err, result) => {
            if (result.length > 0) {
                const existingRating = result[0].ratingValue;
                if (existingRating !== ratingValue) {
                    // ถ้าค่า rating เปลี่ยน → UPDATE ค่าใหม่
                    const updateRatingQuery = `UPDATE rating SET ratingValue = ?, rateTime = NOW() WHERE postID = ? AND userID = ?`;
                    pool.query(updateRatingQuery, [ratingValue, postID, userID], (err, updateResult) => {
                        updateAvgRating(postID, res);
                    });
                } else {
                    // ถ้า rating เหมือนเดิม → ไม่ต้องอัปเดต
                    res.json({ success: true });
                }
            } else {
                // ➕ ถ้ายังไม่มี Rating → เพิ่มใหม่
                const insertRatingQuery = `INSERT INTO rating (postID, userID, ratingValue, rateTime) VALUES (?, ?, ?, NOW())`;
                pool.query(insertRatingQuery, [postID, userID, ratingValue], (err, insertResult) => {
                    updateAvgRating(postID, res);
                });
            }
        });
    }
});

app.post('/addCommentRating', (req, res) => {
    const { postID, commentDescription, ratingValue, userID } = req.body;

    // ถ้ามี Comment ให้เพิ่มลง `comment` Table
    // ปลอดภัย + จำกัดความยาว comment ไม่เกิน 800 ตัว
    const cleanComment = commentDescription?.trim();
    if (cleanComment && cleanComment.length > 800) {
        return res.status(400).json({ error: "Comment too long. Max 700 characters." });
    }
    if (cleanComment) {
        const commentQuery = `INSERT INTO comment (postID, userID, commentDescription, commentTime) VALUES (?, ?, ?, NOW())`;
        pool.query(commentQuery, [postID, userID, cleanComment], (err, commentResult) => {
            if (err) return res.status(500).json({ error: "Insert comment failed", details: err });
        });
    }


    // ถ้ามี Rating ต้องอัปเดตหรือเพิ่มลง `rating` Table
    if (ratingValue !== null) {
        const checkRatingQuery = `SELECT ratingID FROM rating WHERE postID = ? AND userID = ?`;
        pool.query(checkRatingQuery, [postID, userID], (err, result) => {

            if (result.length > 0) {
                // ถ้ามี Rating อยู่แล้ว → อัปเดต
                const updateRatingQuery = `UPDATE rating SET ratingValue = ?, rateTime = NOW() WHERE postID = ? AND userID = ?`;
                pool.query(updateRatingQuery, [ratingValue, postID, userID], (err, updateResult) => {
                    updateAvgRating(postID, res); // อัปเดต avgRating ของโพสต์
                });
            } else {
                // ถ้ายังไม่มี Rating → เพิ่มใหม่
                const insertRatingQuery = `INSERT INTO rating (postID, userID, ratingValue, rateTime) VALUES (?, ?, ?, NOW())`;
                pool.query(insertRatingQuery, [postID, userID, ratingValue], (err, insertResult) => {
                    updateAvgRating(postID, res); // อัปเดต avgRating ของโพสต์
                });
            }
        });
    } else {
        res.json({ success: true });
    }
});

app.get('/getLatestRatings/:postID', (req, res) => {
    const postID = req.params.postID;

    const query = `
        SELECT userID, ratingValue 
        FROM rating 
        WHERE postID = ? 
        ORDER BY rateTime DESC`;

    pool.query(query, [postID], (err, result) => {
        res.json(result);
    });
});


const updateAvgRating = (postID, res) => {
    const avgRatingQuery = `
        UPDATE post 
        SET avgRating = (SELECT IFNULL(AVG(ratingValue), 0) FROM rating WHERE postID = ?) 
        WHERE postID = ?`;

    pool.query(avgRatingQuery, [postID, postID], (err, result) => {
        res.json({ success: true });
    });
};

app.get('/getPost/:id/:userID?', (req, res) => {
    const { id, userID } = req.params;

    let query = `
    SELECT p.*, 
        u.userName,
        u.profilePic,
        COALESCE((SELECT AVG(ratingValue) FROM rating WHERE postID = p.postID), 0) AS avgRating,
        COALESCE((SELECT COUNT(*) FROM rating WHERE postID = p.postID), 0) AS ratingCount
    FROM post p
    JOIN user u ON p.userID = u.userID
    WHERE p.postID = ?`;

    let queryParams = [id];

    if (userID) {
        query = `
        SELECT p.*, 
            u.userName,
            u.profilePic,
            COALESCE((SELECT AVG(ratingValue) FROM rating WHERE postID = p.postID), 0) AS avgRating,
            COALESCE((SELECT COUNT(*) FROM rating WHERE postID = p.postID), 0) AS ratingCount,
            (SELECT ratingValue 
             FROM rating 
             WHERE postID = p.postID AND userID = ? 
             ORDER BY rateTime DESC LIMIT 1) AS userRating
        FROM post p
        JOIN user u ON p.userID = u.userID
        WHERE p.postID = ?`;

        queryParams = [userID, id];
    }

    pool.query(query, queryParams, (err, result) => {
        if (result.length === 0) {
            console.warn(`No post found for postID: ${id}`);
            return res.status(404).json({ error: "Post not found" });
        }
        let post = result[0];

        //แปลงค่า avgRating และ userRating ให้ถูกต้อง
        post.avgRating = post.avgRating ? parseFloat(post.avgRating).toFixed(2) : "0.00";
        post.userRating = post.userRating ? parseInt(post.userRating) : null;
        res.json(post);
    });
});
