import express, { Request, Response } from 'express';

// Create an Express application
const app = express();

console.log(process.env.TEST);


// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

export default app