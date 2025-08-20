import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userTable=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is required'],
        unique:true,
        trim:true,
        minlength:[5,'Username must be atleast of length 5'],
        maxlength:[15,'Username cannot exceed 20 characters'],
        match:[/^[a-zA-Z0-9_]+$/,'Username can only contain letters, numbers, and underscores'],
        index:true
    },
    email:{
      type:String,
      unique:true,
      lowercase:true,
      required:[true,'Email is required'],
      match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,'Please provide valid email']
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[6,'Password must be atleast 6 characters'],
        select:false,
         match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  ]
    }
},{
    timestamps:true
})
userTable.pre("save",async function (next){
  if(!this.isModified("password")) return next();
this.password=await bcrypt.hash(this.password,10)
next()
})

userTable.methods.comparePassword=async function(password){
  return await bcrypt.compare(password,this.password)
}

userTable.methods.generateAccessToken=function(){
return jwt.sign(
  {
    _id:this._id,
    email:this.email,
    username:this.username
  },process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  }
)
}
userTable.methods.generateRefreshToken=function(){
return jwt.sign(
  {
    _id:this._id,
  },process.env.REFRESH_TOKEN_SECRET,{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  }
)
}
export const User=mongoose.model("User",userTable)