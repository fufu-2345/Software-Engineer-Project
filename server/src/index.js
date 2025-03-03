const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
require('dotenv').config({ path: '../.env' });

const port = 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// อนุญาตให้เข้าถึงไฟล์ในโฟลเดอร์ uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

// ตรวจสอบและสร้างโฟลเดอร์ uploads 
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// ตั้งค่าการอัปโหลดรูปภาพ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// ดึงข้อมูลโปรไฟล์ผู้ใช้
app.get('/getUserProfile/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT userID, accName, accDescription, Instagram, X, Line, Phone, Other, profilePic FROM user WHERE userID = ?`;
    pool.query(query, [id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        if (data.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(data[0]);
    });
});

// อัปเดตข้อมูลโปรไฟล์ผู้ใช้
app.post('/updateProfile', upload.single('image'), (req, res) => {
    const { accName, accDescription, Instagram, X, Line, Phone, Other } = req.body;
    const profilePic = req.file ? req.file.filename : null; 
    const userId = req.body.userId ; 

    let query;
    let values;

    if (profilePic) {
        query = `
            UPDATE user 
            SET accName = ?, accDescription = ?, Instagram = ?, X = ?, Line = ?, Phone = ?, Other = ?, profilePic = ?
            WHERE userID = ?`;
        values = [accName, accDescription, Instagram, X, Line, Phone, Other, profilePic, userId];
    } else {
        query = `
            UPDATE user 
            SET accName = ?, accDescription = ?, Instagram = ?, X = ?, Line = ?, Phone = ?, Other = ?
            WHERE userID = ?`;
        values = [accName, accDescription, Instagram, X, Line, Phone, Other, userId];
    }

    pool.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Profile updated successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});