
const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/UMS");

const express=require("express");
const app=express();

const user_route=require('./routes/userRoute');
app.use('/',user_route);

app.listen(3000,function(){
    console.log("Server is Running ......");
})