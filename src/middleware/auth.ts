import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'You have no access to this route' });
  }

  try {
    const decoded: any = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded._id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'You have no access to this route' });
    }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: 'You have no access to this route' });
  }
};

export default auth;
