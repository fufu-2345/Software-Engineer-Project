const express= require('express');
const cors= require('cors');
const mysql= require('mysql2');
const app=express();
require('dotenv').config({ path: '../.env' });

const port =5000;
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

app.get("/test",(req,res)=>{
    res.json('test1 test2 test3');
});

app.get("/getPost", (req,res) =>{
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

app.get("/getComment", (req,res) =>{
    const a = `SELECT * FROM comment`;
    pool.query(a, (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})


app.listen(port,()=>{console.log('\x1b[36m%s\x1b[0m is started/updated', `http://localhost:${port}`);})