import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';

/**
 * POST /api/users
 * Creates a new user account
 */
export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const body = await req.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = await UserModel.findOne({ email }).exec();
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create a new user
    const newUser = await UserModel.create({
      name,
      email,
      password, // Password will be hashed by the pre-save hook in the User model
    });

    // Return the created user (without password)
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users
 * Returns a list of users (for admin purposes)
 * In a real app, this would be protected and paginated
 */
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get all users (excluding password field)
    const users = await UserModel.find({}, { password: 0 }).exec();

    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 