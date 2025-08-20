import mongoose from 'mongoose';
import express from 'express'
import conn from './database/connection.database.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
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
const generatePin = () => Math.floor(1000 + Math.random() * 9000);

// setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// API to send email with PIN
app.post("/send-pin", async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ success: false, message: "Recipient email required" });
  }

  const pin = generatePin();

  const mailOptions = {
    from: `"From Sreshta" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Verification PIN",
    text: `Your 4-digit verification PIN is: ${pin}`,
    html: `<p>Hi This is Sreshta, You should show your grattitude towards me for sending the PIN.Your 4-digit verification PIN is: <b>${pin}</b></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent", pin }); 
    // ⚠️ in production you usually DO NOT send the pin back in response
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});