import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
const TOKEN_EXPIRATION = '24h'; // Example expiration time

// Mock user data (replace this with a database in a real-world scenario)
const users: any = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('admin123', 8), role: 'admin' },
  { id: 2, username: 'user', password: bcrypt.hashSync('user123', 8), role: 'user' }
];

// Login route
export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  const user = users.find((u: any) => u.username === username);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });

  // Send token as a response (it could also be set in cookies)
  return res.status(200).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
};
