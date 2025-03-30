import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Adjust path as needed
import cookieParser from 'cookie-parser'; // Import cookie-parser
import config from '../config/config';

// Interface for JWT payload
interface JwtPayload {
  id: string;
  role: string;
}

// Extend the Express Request type to include our custom properties
declare global {
  namespace Express {
    interface Request {
      user?: any;
      userId?: string;
      userRole?: string;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookies (cookie-parser middleware makes this simple)
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, jwt cookie not found'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    console.log("decoded:", decoded);
    
    // Get user from the token
    req.user = await User.findById(decoded.id).select('-password');
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};