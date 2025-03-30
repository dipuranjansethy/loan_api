import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';
import User from '../models/User';
import config from '../config/config';

interface JwtPayload {
  id: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userId?: string;
      userRole?: UserRole;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
)=> {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      req.userId = decoded.id;
      req.userRole = decoded.role;

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
      return;
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
    return;
  }
};