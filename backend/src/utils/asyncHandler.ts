import { Request, Response, NextFunction } from "express"

// const asyncHandler = (func:(req: Request, res: Response, next: NextFunction) => any) => async (req:Request, res:Response, next:NextFunction) => {
//   try {
//     await func(req,res,next)
//   } catch (err: any)  {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message
//     })
//   }
// }

const asyncHandler = (requestHandler: (req: Request, res: Response, next: NextFunction) => any) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
  }

export { asyncHandler }