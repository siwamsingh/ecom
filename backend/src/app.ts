import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import

import userRouter from './routes/user.routes'
app.use("/api/v1/users",userRouter)

import otpRouter from './routes/otp.routes'
app.use("/api/v1/otp",otpRouter)

import categoryRoutes from './routes/categories.routes'
app.use("/api/v1/category",categoryRoutes)

export default app