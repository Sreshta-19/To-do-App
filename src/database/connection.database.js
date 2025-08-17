import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();
const DB_NAME="todoApp"
console.log("MONGODB_URL from .env:", process.env.MONGODB_URL);
const conn=async ()=>{
    try{
         const connection=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    console.log(`\n MongoDB Connected ${connection}`)
        }catch(e){
        console.log("Coonection Error",e);
        process.exit(1)
    }
}
export default conn