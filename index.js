const mongoose=require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/company")
    .then(()=>{
        console.log("Connected Successfully");
    })
    .catch((err)=>console.log("errorrr"));


const express=require("express");
const app=express();

const employeeRoute=require("./routes/employeeRoute");
app.use('/',employeeRoute);

app.listen(3000,function(){
    console.log("Server is running......");
});