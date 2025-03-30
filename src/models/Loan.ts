import mongoose, { Document, Schema } from 'mongoose';

export enum LoanStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  APPROVED = 'approved'
}

export interface ILoan extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  purpose: string;
  term: number; // in months
  status: LoanStatus;
  fullName: string;
  employmentStatus: string;
  employmentAddress: string;
  verifiedBy?: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  rejectedBy?: mongoose.Types.ObjectId;
  verificationDate?: Date;
  approvalDate?: Date;
  rejectionDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please specify loan amount'],
    min: [100, 'Loan amount must be at least 100']
  },
  purpose: {
    type: String,
    required: [true, 'Please specify loan purpose'],
    trim: true
  },
  term: {
    type: Number,
    required: [true, 'Please specify loan term in months'],
    min: [1, 'Loan term must be at least 1 month']
  },
  fullName: {
    type: String,
    required: [true, 'Please provide your full name as it appears on bank account'],
    trim: true
  },
  employmentStatus: {
    type: String,
    required: [true, 'Please provide your employment status'],
    trim: true
  },
  employmentAddress: {
    type: String,
    required: [true, 'Please provide your employment address'],
    trim: true
  },
  status: {
    type: String,
    enum: Object.values(LoanStatus),
    default: LoanStatus.PENDING
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDate: {
    type: Date
  },
  approvalDate: {
    type: Date
  },
  rejectionDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Loan', LoanSchema);