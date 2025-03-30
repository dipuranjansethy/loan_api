import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Loan, { LoanStatus, ILoan } from '../models/Loan';
import { UserRole } from '../models/User';
import mongoose from 'mongoose';


export const applyForLoan = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { amount, purpose, term, fullName, employmentStatus, employmentAddress } = req.body;

    const loan = await Loan.create({
      user: req.userId,
      amount,
      purpose,
      term,
      fullName,
      employmentStatus,
      employmentAddress,
      status: LoanStatus.PENDING
    });

    res.status(201).json({
      success: true,
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


export const getLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    let query = {};

    // If user role is USER, only return their loans
    if (req.userRole === UserRole.USER) {
      query = { user: req.userId };
    }
    // If Verifier, show only pending loans
    else if (req.userRole === UserRole.VERIFIER) {
      query = { status: LoanStatus.PENDING };
    }
    // Admin can see all loans

    const loans = await Loan.find(query)
      .populate('user', 'name email')
      .populate('verifiedBy', 'name')
      .populate('approvedBy', 'name')
      .populate('rejectedBy', 'name');

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get loan by ID
// @route   GET /api/loans/:id
// @access  Private
export const getLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('user', 'name email')
      .populate('verifiedBy', 'name')
      .populate('approvedBy', 'name')
      .populate('rejectedBy', 'name') as unknown as ILoan & { user: { _id: mongoose.Types.ObjectId } };

    if (!loan) {
      res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
      return;
    }

    // Make sure user is loan owner or admin/verifier
    if (
      req.userRole !== UserRole.ADMIN &&
      req.userRole !== UserRole.VERIFIER &&
      loan.user._id.toString() !== req.userId
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this loan'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Verify a loan
// @route   PUT /api/loans/:id/verify
// @access  Private/Verifier
export const verifyLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    let loan = await Loan.findById(req.params.id);

    if (!loan) {
      res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
      return;
    }

    // Check if loan is already verified
    if (loan.status !== LoanStatus.PENDING) {
      res.status(400).json({
        success: false,
        message: `Loan is already ${loan.status}`
      });
      return;
    }

    // Update loan status
    loan = await Loan.findByIdAndUpdate(
      req.params.id,
      {
        status: LoanStatus.VERIFIED,
        verifiedBy: req.userId,
        verificationDate: new Date(),
        notes: req.body.notes || loan.notes
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Reject a loan
// @route   PUT /api/loans/:id/reject
// @access  Private/Verifier/Admin
export const rejectLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    let loan = await Loan.findById(req.params.id);

    if (!loan) {
      res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
      return;
    }

    // Check if loan is already rejected
    if (loan.status === LoanStatus.REJECTED) {
      res.status(400).json({
        success: false,
        message: 'Loan is already rejected'
      });
      return;
    }

    // Update loan status
    loan = await Loan.findByIdAndUpdate(
      req.params.id,
      {
        status: LoanStatus.REJECTED,
        rejectedBy: req.userId,
        rejectionDate: new Date(),
        notes: req.body.notes || loan.notes
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


export const approveLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    let loan = await Loan.findById(req.params.id);

    if (!loan) {
      res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
      return;
    }

    // Check if loan is verified
    if (loan.status !== LoanStatus.VERIFIED) {
      res.status(400).json({
        success: false,
        message: 'Loan must be verified before approval'
      });
      return;
    }

    loan = await Loan.findByIdAndUpdate(
      req.params.id,
      {
        status: LoanStatus.APPROVED,
        approvedBy: req.userId,
        approvalDate: new Date(),
        notes: req.body.notes || loan.notes
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};