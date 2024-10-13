import express from 'express';
import { authenticateJWT, authorizeRole } from './middleware';
import { login } from './login';

import { Request, Response } from 'express';

interface CustomRequest extends Request {
  user?: any; // You can replace 'any' with a specific type if you know the structure of the decoded token
}


const app = express();
app.use(express.json());

app.post('/login', (req, res) => { login(req, res) });

// Public route
app.get('/', (req, res) => {
  res.send('Public endpoint, no token needed');
});

// Protected route for authenticated users
app.get('/profile', authenticateJWT as any, (req: CustomRequest, res: Response) => {
  res.send(`Welcome, user ID: ${req.user.id} with role: ${req.user.role}`);
});

// Admin-only route
app.get('/admin', (req:CustomRequest,res,next)=>{ authenticateJWT(req,res,next)}, (req,res,next)=>{authorizeRole(req,res,next,'admin')}, (req, res) => {
  res.send('This route is only accessible by admin users.');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
