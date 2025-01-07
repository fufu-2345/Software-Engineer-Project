const express= require('express');
const cors= require('cors');
const mysql= require('mysql2');
const app=express();

const port =5000;
app.use(cors());

app.get('/', (req, res) => {  
    res.json('111111');
});


app.get("/test",(req,res)=>{
    res.json('test1 test2 test3');
});

app.listen(port,()=>{console.log('\x1b[36m%s\x1b[0m is started/updated', `http://localhost:${port}`);})