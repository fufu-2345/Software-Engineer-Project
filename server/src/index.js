const express= require('express');
const cors= require('cors');
const app=express();

const port =5000;
app.use(cors());

app.get('/', (req, res) => {  
    res.json('111111');
});


app.get("/test",(req,res)=>{
    res.json('test1 test2 test3');
});

app.listen(port,()=>{console.log(`backend port: ${port} is started/updated`)})