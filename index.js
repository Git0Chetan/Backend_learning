const mongoose=require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/company")
    .then(()=>{
        console.log("Connected Successfully");
    })
    .catch((err)=>console.log(errorrr));


const express=require("express");
const app=express();

const bodyparser=require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

const employee=require("./controllers/employeeController");

app.set('view engine','pug');
app.set('views','./views');

app.get('/register',function(req,res){
    res.render('Register');
});

app.post('/register',employee.insertEmployee)

app.listen(3000,function(){
    console.log("Server is running......");
});