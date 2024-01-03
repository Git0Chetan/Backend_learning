const express =require("express");
const employeeRoute=express();

const bodyparser=require("body-parser");
employeeRoute.use(bodyparser.json());
employeeRoute.use(bodyparser.urlencoded({extended:true}));

employeeRoute.set("view engine","pug");
employeeRoute.set('views','./views');

const employeeController=require("../controllers/employeeController");

employeeRoute.get('/register',function(req,res){
    res.render('Register');
});

employeeRoute.post('/register',employeeController.insertEmployee);


module.exports=employeeRoute;