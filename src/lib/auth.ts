import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import dbConnect from './mongodb';
import mongoose, { Document, Model } from 'mongoose';
import { compare } from 'bcrypt';

// Define a simplified User interface 
interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  _id: mongoose.Types.ObjectId;
}

// This is a temporary solution until we create our User model
let UserModel: Model<IUser>;

try {
  // Check if the model is already defined
  UserModel = mongoose.model<IUser>('User');
} catch {
  // If not, we'll use a placeholder until our actual model is created
  const userSchema = new mongoose.Schema<IUser>({
    email: String,
    password: String,
    name: String
  });

  if (mongoose.models.User) {
    UserModel = mongoose.model<IUser>('User');
  } else {
    UserModel = mongoose.model<IUser>('User', userSchema);
  }
}

// Create a MongoDB client for the adapter
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Make sure we only create a single client instance
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await dbConnect();

        try {
          // This will be replaced with actual code once we create the User model
          const user = await UserModel.findOne({ email: credentials.email }).exec();

          if (!user) {
            throw new Error('No user found with this email');
          }

          const isPasswordValid = user.password ?
            await compare(credentials.password, user.password) :
            false;

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// Typings for session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Typings for JWT token
declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
  }
} 