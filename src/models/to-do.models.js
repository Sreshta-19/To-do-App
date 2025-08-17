import mongoose from "mongoose";
const todoTable=new mongoose.Schema({
     title:{
        type:String,
        required:[true,'Title is required'],
        trim:true,
        maxlength:[100,'cannot exceed length 100'],
        validate:{
            validator:function(val){
                return val.trim().length>0;
            },
            message:'Title cannot be empty or just spaces'
        }
     },
     priority:{
        type:String,
        enum:['LOW','MEDIUM','HIGH'],
        default:'MEDIUM'
     },
     status:{
        type:Boolean,
        default:false
     },
     dueDate:{
type:Date
     },
     userId:{
        type:mongoose.Schema.Types.ObjectId,
ref:'User',
required:true
     }
     
},{
    timestamps:true
});
export const Todo=mongoose.model("Todo",todoTable)