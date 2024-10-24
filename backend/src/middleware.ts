import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Extend the Request interface to include the user property
interface CustomRequest extends Request {
  user?: any; // Define a more specific type for your user if you prefer
}

// Middleware to authenticate the token
// export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
//   const token = req.headers['authorization'];


//   if (!token) {
//     return res.status(403).json({ message: 'Token is required' });
//   }

  
  
//   try {
//     console.log("here->");
//     const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);
//     req.user = decoded; // Attach user data to the request object
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Token is required or invalid format' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token part after 'Bearer'
  
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Make sure SECRET_KEY is correct
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (err) {
    console.log("error->",err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};


// Middleware for role-based access control
export const authorizeRole = (req:CustomRequest, res:Response, next: NextFunction ,role: string) => {
  // return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  // };
};

// import { Request, Response } from 'express';

// interface CustomRequest extends Request {
//   user?: any; // You can replace 'any' with a specific type if you know the structure of the decoded token
// }


// app.post('/login', (req, res) => { login(req, res) });


// app.get('/', (req, res) => {
//   res.send('Public endpoint, no token needed');
// });

// app.get('/profile', authenticateJWT as any, (req: CustomRequest, res: Response) => {
//   res.send(`Welcome, user ID: ${req.user.id} with role: ${req.user.role}`);
// });

// app.get('/admin', (req: CustomRequest, res, next) => { authenticateJWT(req, res, next) }, (req, res, next) => { authorizeRole(req, res, next, 'admin') }, (req, res) => {
//   res.send('This route is only accessible by admin users.');
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
