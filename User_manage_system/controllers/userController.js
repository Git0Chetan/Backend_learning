const User=require("../models/userModel");
const bcrypt=require("bcrypt");
const nodemailer=require("nodemailer");
const randomS=require("randomstring");
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

const sendVerifyMail=async(name,email,userid)=>{
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
            subject:"For Verfication Mail",
            html:'<p> Hii '+name+' , please click here to <a href="http://127.0.0.1:3000/verify?id='+userid+'">Verfiy</a>Your mail</p>'
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

// for reset passwrod send mail 
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

const loadRegister = async(req,res)=>{
    try{
        res.render('registration');
    }
    catch(error){
        console.log(error.message);
    }
}

const insertUser=async(req,res)=>{
    try{

        const spassword=await securePassword(req.body.password);
        const user= new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            image:req.file.filename,
            password:spassword,
            is_admin:0,
        });

        const userdata=await user.save();
        if(userdata){
            sendVerifyMail(req.body.name,req.body.email,userdata._id);
            res.render('registration',{message:"Your registration has been Successfully,please Verify your mail"});
        }
        else{
            res.render('registration',{message:"Your registration has been Failed"});
        }
    }
    catch(err){
        console.log(err.message);
    }
}

const verifyMail=async(req,res)=>{
    try{
        const updateInfo=await User.updateOne({_id:req.query.id},{$set:{is_varified:1}});

        console.log(updateInfo);
        res.render("email_verify");
    }
    catch(err){
        console.log(err.message);
    }
}


//Login user 
const loginLoad=async(req,res)=>{
    try{
        res.render('login');
    }
    catch(error){
        console.log(error.message);
    }
}

const verifyLogin=async(req,res)=>{
    try{
        const Email=req.body.email;
        const password=req.body.password;

        const userdata=await User.findOne({email:Email})

        if(userdata){
            const passMatch=await bcrypt.compare(password,userdata.password);
            if(passMatch){
                if(userdata.is_varified === 0){
                    res.render('login',{message:"Please Verify your Email"});
                }
                else{
                    req.session.user_id=userdata._id;
                    res.redirect('/home');
                }
            }
            else{
                res.render('login',{message:"Email and Password is incorrect "});
            }
        }
        else{
            res.render('login',{message:"Email and Password is incorrect "});
        }
    }
    catch(err){
        console.log(err.message);
    }
}

const loadHome=async(req,res)=>{
    try{
        res.render('home');
    }
    catch(error){
        console.log(error.message);
    }
}

const userLogout=async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/');
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

const forgetVerify=async(req,res)=>{
    try{
        mail=req.body.email;
        const Data=await User.findOne({email:mail});

        if(Data){
            if(Data.is_varified === 0){
                res.render('forget',{message:"Please verify Your Email"});
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


const forgetPassLoad=async(req,res)=>{
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

const resetPassword=async(req,res)=>{
    try{
        let password=req.body.password;
        let user_id=req.body.user_id;
        const secure_password=await securePassword(password);
        const user_data=await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password,token:''}});

        res.redirect('/');
    }
    catch(error){
        console.log(error.message);
    }
}


module.exports={
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPassLoad,
    resetPassword
}