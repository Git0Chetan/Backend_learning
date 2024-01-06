
const User=require("../models/userModel");
const bcrypt= require("bcrypt");
const randomS=require("randomstring");
const nodemailer=require("nodemailer");
const dotenv = require("dotenv")
dotenv.config();



const securePassword=async(password)=>{
    try{
        const passwordHash=bcrypt.hash(password,10);
        return passwordHash;
    }
    catch(error){
        console.log(error.message);
    }
}

const loadLogin=async(req,res)=>{
    try{
        res.render('loginview');
    }
    catch(error){
        console.log(error.message);
    }
}

const verifyLogin=async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;

        const userdata=await User.findOne({email:email});
        if(userdata){
            const passMatch=bcrypt.compare(password,userdata.password);
            if(passMatch){
                if(userdata.is_admin === 0){
                    res.render('login',{message:"Email And Password Are Incoreect"});
                }
                else{
                    req.session.user_id=userdata._id;
                    res.redirect('/admin/home');
                }
            }
            else{
                res.render('loginview',{message:"Email And Password Are Incoreect"});
            }
        }
        else{
            res.render('loginview',{message:"Email and password is Incorrect"});
        }
    }
    catch(error){
        console.log(error.message);
    }
}

const loadDashboard=async(req,res)=>{
    try{
        const userdata=await User.findById({_id:req.session.user_id});
        res.render('home',{admin:userdata});
    }
    catch(error){
        console.log(error.message);
    }
}

const logout=async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/admin');
    }
    catch(error){
        console.log(error.message);
    }
}

const forgetLoad=async(req,res)=>{
    try{
        res.render('forget');
    }
    catch(error){
        console.log(error.message);
    }
}

const sendResetMail=async(name,email,token)=>{
    try{
        const transporter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.Email,
                pass: process.env.EmailPass
            }
        });

        const mailoptions={
            from: process.env.Email,
            to:email,
            subject:"For Reset Password Mail",
            html:'<p> Hii '+name+' , please click here to <a href="http://127.0.0.1:3000/forgetPass?token='+token+'">Reset Your Password</a>Your mail</p>'
        }
        transporter.sendMail(mailoptions,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been Sent: - ",info.response);
            }
        })
    }
    catch(error){
        console.log(error.message);
    }
};

const forgetVerify=async(req,res)=>{
    try{
        mail=req.body.email;
        const Data=await User.findOne({email:mail});

        if(Data){
            if(Data.is_admin === 0){
                res.render('forget',{message:"Email is Incorrect"});
            }
            else{
                const randomString=randomS.generate();
                const updated=await User.updateOne({email:mail},{$set:{token:randomString}});
                sendResetMail(Data.name,Data.email,randomString);
                res.render('forget',{message:"Please check your mail To reset your Password"});
            }
        }
        else{
            res.render('forget',{message:"User Mail is Incorrect"});
        }

    }
    catch(error){
        console.log(error.message);
    }
}

const forgetpassLoad=async(req,res)=>{
    try{
        const token=req.query.token;
        const tokendata=await User.findOne({token:token});

        if(tokendata){
            res.render('forgetPass',{user_id:tokendata._id});
        }
        else{
            res.render('404',{message:"Token is Invalid"});
        }

    }
    catch(error){
        console.log(error.message);
    }
}

const resetPassLoad=async(req,res)=>{
    try{
        let password=req.body.password;
        let user_id=req.body.user_id;
        const secure_password=await securePassword(password);
        const user_data=await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password,token:''}});

        res.redirect('/admin');
    }
    catch(error){
        console.log(error.message);
    }
}

const adminDashboard=async(req,res)=>{
    try{
        const userdata=await User.find({is_admin:0});
        res.render('dashboard',{users:userdata});
    }
    catch(error){
        console.log(error.message);
    }
}


module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    forgetLoad,
    forgetVerify,
    forgetpassLoad,
    resetPassLoad,
    adminDashboard
} 