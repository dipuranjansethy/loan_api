import { Request, Response } from 'express';
import User, { UserRole, IUser } from '../models/User';
import { validationResult } from 'express-validator';
import mongoose, { Document } from 'mongoose';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response)  => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req: Request, res: Response)  => {
  try {
    const user = await User.findById(req.params.id) as unknown as IUser;

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create a new admin
// @route   POST /api/users/admin
// @access  Private/Admin
export const createAdmin = async (req: Request, res: Response)  => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'User already exists'
      });
      return;
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: UserRole.ADMIN
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create a new verifier
// @route   POST /api/users/verifier
// @access  Private/Admin
export const createVerifier = async (req: Request, res: Response)  => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'User already exists'
      });
      return;
    }

    // Create verifier user
    const user = await User.create({
      name,
      email,
      password,
      role: UserRole.VERIFIER
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response)  => {
  try {
    const user = await User.findById(req.params.id) as Document & IUser;

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.userId) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
      return;
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
