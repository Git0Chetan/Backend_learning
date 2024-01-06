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

const multer=require("multer");
const path=require("path");
admin_route.use(express.static('public'));

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename: function(req,file,cb){
        const name=Date.now().toString()+'-'+file.originalname;
        cb(null,name);
    }
});

const upload=multer({storage:storage});


const adminController=require('../controllers/adminController');

admin_route.get('/',auth.isLogout,adminController.loadLogin);
admin_route.post('/',adminController.verifyLogin);
admin_route.get('/home',auth.isLogin,adminController.loadDashboard);
admin_route.get('/logout',auth.isLogin,adminController.logout);
admin_route.get('/forget',auth.isLogout,adminController.forgetLoad);
admin_route.get('/forget',adminController.forgetVerify);
admin_route.get('/forgetPass',adminController.forgetpassLoad);
admin_route.get('/forgetPass',adminController.resetPassLoad);
admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard);
admin_route.get('/new_user',auth.isLogin,adminController.newuserLoad);
admin_route.post('/new_user',upload.single('image'),adminController.adduser);
admin_route.get('/edituser',auth.isLogin,adminController.edituserLoad);
admin_route.post('/edituser',adminController.updateUser);
admin_route.get('/deleteuser',adminController.deleteuser);

admin_route.get('*',function(req,res){
    res.redirect('/admin');
});

module.exports=admin_route;



