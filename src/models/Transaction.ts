import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Represents a transaction split between users
 * @interface ISplitParticipant
 */
interface ISplitParticipant {
  userId: mongoose.Types.ObjectId;
  amount: number;
  isPaid: boolean;
}

/**
 * Represents a transaction in the application
 * @interface ITransaction
 * @extends Document
 */
export interface ITransaction extends Document {
  createdBy: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  totalAmount: number;
  category: string;
  date: Date;
  receiptImage?: string;
  participants: ISplitParticipant[];
  isSettled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Transaction schema definition
 */
const TransactionSchema = new Schema<ITransaction>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Transaction title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Rent', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Shopping', 'Other'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    receiptImage: {
      type: String,
    },
    participants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: [0, 'Amount cannot be negative'],
        },
        isPaid: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isSettled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Check if model exists before creating it to avoid model overwrite errors in dev
let TransactionModel: Model<ITransaction>;

try {
  // Try to get existing model
  TransactionModel = mongoose.model<ITransaction>('Transaction');
} catch {
  // If no model exists, create it
  TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);
}

export default TransactionModel; 