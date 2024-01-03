
const express=require ("express");
const app=express();

app.set('view engine','ejs');
app.set('views','./views');

app.get('/register',function(req,res){
    res.render("register");
});

app.listen(3500,function(){
    console.log("Server is running......");
});