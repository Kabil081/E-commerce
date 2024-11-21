const mongodb=require('mongoose')
const bcrypt=require('bcrypt')
const UserSchema =new mongodb.Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,unique:true},
})
const User=mongodb.model('User',UserSchema);
module.exports=User;