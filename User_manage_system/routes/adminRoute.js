const express=require("express");
const admin_route=express();

const session=require("express-session");
const config=require("../config/config");
admin_route.use(session({secret:config.sessionSecret,resave: true,saveUninitialized: true}));

const bodyparser=require("body-parser");
admin_route.use(bodyparser.json());
admin_route.use(bodyparser.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const auth=require("../middleware/adminauth");

const adminController=require('../controllers/adminController');

admin_route.get('/',auth.isLogout,adminController.loadLogin);
admin_route.post('/',adminController.verifyLogin);
admin_route.get('/home',auth.isLogin,adminController.loadDashboard);
admin_route.get('/logout',auth.isLogin,adminController.logout);
admin_route.get('/forget',auth.isLogout,adminController.forgetLoad);
admin_route.get('/forget',adminController.forgetVerify);
admin_route.get('/forgetPass',adminController.forgetpassLoad);
admin_route.get('/forgetPass',adminController.resetPassLoad);

admin_route.get('*',function(req,res){
    res.redirect('/admin');
});

module.exports=admin_route;



