import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    if (!roles.includes(req.userRole)) {
      res.status(403).json({
        success: false,
        message: `User role ${req.userRole} is not authorized to access this route`
      });
      return;
    }
    next();
  };
};