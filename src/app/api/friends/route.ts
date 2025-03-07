import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import FriendModel from '@/models/Friend';
import UserModel, { IUser } from '@/models/User';
import { randomBytes } from 'crypto';
import mongoose from 'mongoose';

// Interface for populated friend document
interface PopulatedFriend {
  _id: mongoose.Types.ObjectId;
  userId: IUser & { _id: mongoose.Types.ObjectId };
  friendId: IUser & { _id: mongoose.Types.ObjectId };
  status: 'pending' | 'accepted' | 'rejected';
  inviteLink?: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * GET /api/friends
 * Returns the list of friends for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Find all friendships where the user is involved
    const userId = session.user.id;
    const friends = await FriendModel.find({
      $or: [{ userId }, { friendId: userId }],
    })
      .populate('userId', 'name email profilePicture')
      .populate('friendId', 'name email profilePicture')
      .exec() as unknown as PopulatedFriend[];

    // Transform the data to a more user-friendly format
    const transformedFriends = friends.map((friendship) => {
      const isFriendInitiator = friendship.userId._id.toString() === userId;
      const friend = isFriendInitiator ? friendship.friendId : friendship.userId;

      return {
        id: friendship._id,
        friendId: friend._id,
        name: friend.name,
        email: friend.email,
        profilePicture: friend.profilePicture,
        status: friendship.status,
        // If user is the initiator and balance is positive, friend owes user
        // If user is not the initiator and balance is negative, friend owes user
        balance: isFriendInitiator ? friendship.balance : -friendship.balance,
        createdAt: friendship.createdAt,
      };
    });

    return NextResponse.json(transformedFriends);
  } catch (error: any) {
    console.error('Error fetching friends:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch friends' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/friends
 * Creates a new friend request
 */
export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Parse the request body
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Friend email is required' },
        { status: 400 }
      );
    }

    // Find the friend by email
    const friend = await UserModel.findOne({ email }).exec();
    if (!friend) {
      return NextResponse.json(
        { error: 'User with this email not found' },
        { status: 404 }
      );
    }

    // Check if the user is trying to add themselves
    const friendId = friend._id as mongoose.Types.ObjectId;
    if (friendId.toString() === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot add yourself as a friend' },
        { status: 400 }
      );
    }

    // Check if a friendship already exists
    const existingFriendship = await FriendModel.findOne({
      $or: [
        { userId: session.user.id, friendId: friendId },
        { userId: friendId, friendId: session.user.id },
      ],
    }).exec();

    if (existingFriendship) {
      return NextResponse.json(
        { error: 'Friendship already exists', status: existingFriendship.status },
        { status: 409 }
      );
    }

    // Generate a unique invite link
    const inviteToken = randomBytes(16).toString('hex');
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/friends/invite/${inviteToken}`;

    // Create a new friendship
    const newFriendship = await FriendModel.create({
      userId: session.user.id,
      friendId: friendId,
      status: 'pending',
      inviteLink,
      balance: 0,
    });

    // Return the created friendship
    return NextResponse.json(
      {
        id: newFriendship._id,
        friendId: friendId,
        name: friend.name,
        email: friend.email,
        status: newFriendship.status,
        inviteLink: newFriendship.inviteLink,
        balance: 0,
        createdAt: newFriendship.createdAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating friend request:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create friend request' },
      { status: 500 }
    );
  }
} 