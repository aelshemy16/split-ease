import mongoose, { Schema, Document, Model } from 'mongoose';
import { hashSync } from 'bcrypt';

/**
 * Represents a User in the application
 * @interface IUser
 * @extends Document
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User schema definition
 */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password should be at least 6 characters long'],
    },
    profilePicture: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to hash the password when a new user is created or password is modified
 */
UserSchema.pre('save', function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();

  try {
    // Hash the password with a salt factor of 10
    this.password = hashSync(this.password, 10);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Check if model exists before creating it to avoid model overwrite errors in dev
let UserModel: Model<IUser>;

try {
  // Try to get existing model
  UserModel = mongoose.model<IUser>('User');
} catch {
  // If no model exists, create it
  UserModel = mongoose.model<IUser>('User', UserSchema);
}

export default UserModel; 