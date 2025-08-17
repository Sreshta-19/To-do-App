
import {ApiError} from '../utils/ApiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const registerUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body
    if(
[username,email,password].some((field)=>field?.trim()==="")
     ){
        throw new ApiError(400,"All fields are required")
     }
    const exists=await User.findOne({
    $or:[{email},{username}]
})
if(exists){
    throw new ApiError(409,"Already exists")
}
const user=await User.create({username:username.toLowerCase(),
email,password})
const createduser=await User.findById(user._id).select(
    "-password"
)
if(!createduser){
    throw new ApiError(500,"Something went wrong while registering user")
}

return res.status(201).json(new ApiResponse(201,createduser,"User registered successfully"))
})


export {registerUser}