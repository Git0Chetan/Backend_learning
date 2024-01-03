const Employee=require("../models/employeeModel");


const insertEmployee=async(req,res)=>{
    try{
        const employee=new Employee({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            password:req.body.password
        });

        let result= await employee.save();
        res.send("Registration has been Successfull." + result);
    }
    catch(error){
        res.send(error.message);
    }
}



module.exports={
    insertEmployee
}