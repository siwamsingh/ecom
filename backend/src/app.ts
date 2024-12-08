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

app.get("/",(req,res)=>{
  res.send("Hmm this is ok");
})

import userRouter from './routes/user.routes'
app.use("/api/v1/users",userRouter)

import otpRouter from './routes/otp.routes'
app.use("/api/v1/otp",otpRouter)

import categoryRoutes from './routes/categories.routes'
app.use("/api/v1/category",categoryRoutes)

import productRoutes from './routes/products.routes'
app.use('/api/v1/product',productRoutes)

import discountRoutes from './routes/discounts.routes'
app.use('/api/v1/discount',discountRoutes)

import cartRoutes from './routes/cart.routes'
app.use('/api/v1/cart',cartRoutes)

import addressRoutes from './routes/address.routes'
app.use('/api/v1/address',addressRoutes)

import orderRoutes from './routes/orders.routes'
app.use('/api/v1/orders',orderRoutes)

export default app