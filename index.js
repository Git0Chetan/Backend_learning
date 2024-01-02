const mongoose=require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/company")
    .then(()=>{
        console.log("Connected Successfully");
    })
    .catch((err)=>console.log(errorrr));