import mongoose from 'mongoose';
import express from 'express'
import conn from './database/connection.database.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express()
app.use(cors({
    origin: process.env.CORS,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser())


conn()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>
    {
        console.log(`Server is running at ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Failed Connection",err);
})  
import userRouter from './routes/user.routes.js';
import todoRouter from './routes/todo.routes.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/todos", todoRouter);
