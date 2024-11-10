const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const User=require('./UserSchema');
const jwt = require('jsonwebtoken');
const mongoose=require('mongoose');
const bodyparser=require('body-parser')
const bcrypt=require('bcrypt')
const cookieParser=require('cookie-parser');
dotenv.config();
const mongodb_uri=process.env.MONGODB_URI;
mongoose.connect(mongodb_uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB:', err);
});
const app=express()
app.use(cors())
app.use(bodyparser.json())
app.use(cookieParser())
const authenticate=(req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
app.post('/signup',async(req,res)=>{
    const {email,password}=req.body;
    const existingUser=await User.findOne({email});
    if(existingUser){
        res.status(400).json({message:'User Already Exists'});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const newUser=await User({email,password:hashedPassword});
    await newUser.save();
    res.status(201).json({message:'USer Registration Successfull'});
})
app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const existingUser=await User.findOne({email});
    if(!existingUser){
        res.status(400).json({message:'User Doesnt Exist'});
    }
    const token=jwt.sign(
        {userId:existingUser._id,email:existingUser.email},
        process.env.JWT_KEY,
        {expiresIn:'1h'}
    )
    const isMatch=await bcrypt.compare(password,existingUser.password);
    if(!isMatch){
        res.status(400).json({message:'Invalid Password!'});
    }
    res.cookie('token',token,{
        httpOnly:true,
        secure:false,
        sameSite:true,
        maxAge:60*60*1000,
    });
    res.status(200).json({message:'Login Successfull!'});
})
app.post('/logout',(req,res)=>{
    res.clearCookie('token');
    res.status(200).json({message:'Logout Successfully!'});
})
app.listen(5000,()=>{
    console.log("Server running on port 5000");
});