import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Represents a friendship relationship between two users
 * @interface IFriend
 * @extends Document
 */
export interface IFriend extends Document {
  userId: mongoose.Types.ObjectId;
  friendId: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  inviteLink?: string;
  balance: number; // Positive means friend owes user, negative means user owes friend
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Friend schema definition
 */
const FriendSchema = new Schema<IFriend>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    friendId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    inviteLink: {
      type: String,
      default: '',
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure uniqueness of friendships
FriendSchema.index({ userId: 1, friendId: 1 }, { unique: true });

// Check if model exists before creating it to avoid model overwrite errors in dev
let FriendModel: Model<IFriend>;

try {
  // Try to get existing model
  FriendModel = mongoose.model<IFriend>('Friend');
} catch {
  // If no model exists, create it
  FriendModel = mongoose.model<IFriend>('Friend', FriendSchema);
}

export default FriendModel; 