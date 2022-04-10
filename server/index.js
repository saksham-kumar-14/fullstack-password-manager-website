const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userModel = require("./models/user");


mongoose.connect("mongodb+srv://saksham:saksham@cluster0.1kkxc.mongodb.net/password-manager?retryWrites=true&w=majority");

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.get("/getUsers",(req,res)=>{
    userModel.find({}, (err,result)=>{
        if(err){
            console.log("ERROR OCCURED!")
            res.json(err)
        }
        else{
            console.log("WORKED SUCCESSFULLY!")
            res.json(result)
        }
    })
})

app.post("/createUser" , async (req,res)=>{

    try{
        const newPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = newPassword
        const user = new userModel(req.body);
        await user.save();
        res.json({ status:"ok" , user:user })
    }catch(err){
        res.json({ status:404 , error:err })
    }

})

app.post("/login" , async (req,res)=>{

    try{
        const user = await userModel.findOne(
            {email:req.body.email,}
        );

        if(!user){
            return res.json({ status: 404 , error:"invalid email" })
        }

        const isPasswordValid = await bcrypt.compare( req.body.password , user.password );

        if(isPasswordValid){
            const token = jwt.sign({
                email : user.email,
                name : user.name,
                password : user.password,
                storedPasswords : user.storedPasswords,
                darkMode : user.darkMode
            } , "secret")
            return res.json({ status:"ok" , user:token })
        }else{
            return res.json({ status:404 , user:false })
        }
    }catch(err){
        return res.json({ status:404 , error:err })
    }

})

app.post("/updateUser" , async(req,res)=>{

    try{
        await userModel.findOneAndUpdate(
            { email:req.body.email , password:req.body.password },
            { storedPasswords:req.body.storedPasswords , darkMode:req.body.darkMode }
        )

        res.json({ status:"ok" , updated:true })
    }catch(err){
        res.json({ status:404 , error:err })
    }
})


app.post("/deleteUser", async (req,res)=>{
    
    await userModel.deleteOne(
        {"email" : req.body.email,
        "password" : req.body.password}
    ).then(()=>{
        return res.json({ status:"ok", updated:true })
    }).catch((err)=>{
        console.log(err);
        return res.json({ status:404 , updated:false })
    })
})

app.get("/api/login" , async(req,res)=>{
    
    try{
        const token = req.headers["user-token"];
        const decoded = jwt.verify(token, 'secret');
        const user = await userModel.findOne({ email:decoded.email , password:decoded.password });

        if(user){
            return res.json({ status:"ok" , userExists:true })
        }else{
            return res.json({ status:404 , userExists:false })
        }
    }catch{
        return res.json({ status:404 , userExists:false });
    }
})

app.listen(3001,()=>{
    console.log("The server is running at http://localhost:3001")
})
