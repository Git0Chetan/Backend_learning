
const express=require("express");
const app=express();

app.set('view engine','pug');
app.set('views','./views');

app.get('/login',function(req,res){
    res.render("login");
});

app.listen(3000,function(){
    console.log("Server is running......");
});