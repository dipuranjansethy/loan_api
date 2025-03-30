import { LoanStatus } from '../models/Loan';

export interface LoanDTO {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  term: number;
  status: LoanStatus;
  verifiedById?: string;
  approvedById?: string;
  rejectedById?: string;
  verificationDate?: Date;
  approvalDate?: Date;
  rejectionDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLoanDTO {
  amount: number;
  purpose: string;
  term: number;
}

export interface UpdateLoanDTO {
  notes?: string;
}