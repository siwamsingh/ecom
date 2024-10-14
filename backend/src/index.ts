import express from 'express';
import { authenticateJWT, authorizeRole } from './middleware';
import { login } from './login';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import dotenv from "dotenv"
import { client } from './db/db.connect';

dotenv.config({
  path: '../.env'
})


import { Request, Response } from 'express';

interface CustomRequest extends Request {
  user?: any; // You can replace 'any' with a specific type if you know the structure of the decoded token
}


const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json({limit: "16kb"}));

app.use(express.urlencoded({extended:true, limit: "16kb"}))

app.use(express.static("public"))

app.use(cookieParser())


app.post('/login', (req, res) => { login(req, res) });


app.get('/', (req, res) => {
  res.send('Public endpoint, no token needed');
});

app.get('/profile', authenticateJWT as any, (req: CustomRequest, res: Response) => {
  res.send(`Welcome, user ID: ${req.user.id} with role: ${req.user.role}`);
});

app.get('/admin', (req: CustomRequest, res, next) => { authenticateJWT(req, res, next) }, (req, res, next) => { authorizeRole(req, res, next, 'admin') }, (req, res) => {
  res.send('This route is only accessible by admin users.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


client.connect(function (err: any) {
  if (err) {
    throw err;
  }
  else {
    console.log("postgress connected !!");

  }
});