import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import TransactionModel from '@/models/Transaction';
import FriendModel from '@/models/Friend';
import mongoose from 'mongoose';

/**
 * GET /api/transactions
 * Returns the list of transactions for the authenticated user
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

    const userId = session.user.id;

    // Find all transactions where the user is involved (either as creator or participant)
    const transactions = await TransactionModel.find({
      $or: [
        { createdBy: userId },
        { 'participants.userId': userId }
      ]
    })
      .populate('createdBy', 'name email')
      .populate('participants.userId', 'name email')
      .sort({ date: -1 })
      .exec();

    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transactions
 * Creates a new transaction
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
    const {
      title,
      description,
      totalAmount,
      category,
      date,
      participants
    } = body;

    // Validate required fields
    if (!title || !totalAmount || !category || !participants || !Array.isArray(participants)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate participants
    if (participants.length === 0) {
      return NextResponse.json(
        { error: 'At least one participant is required' },
        { status: 400 }
      );
    }

    // Ensure the current user is included in participants
    const userIncluded = participants.some(
      (p: any) => p.userId === session.user.id
    );

    if (!userIncluded) {
      return NextResponse.json(
        { error: 'Current user must be included in participants' },
        { status: 400 }
      );
    }

    // Calculate total of participant amounts to ensure it matches totalAmount
    const participantTotal = participants.reduce(
      (sum: number, p: any) => sum + (parseFloat(p.amount) || 0),
      0
    );

    if (Math.abs(participantTotal - totalAmount) > 0.01) {
      return NextResponse.json(
        { error: 'Sum of participant amounts must equal total amount' },
        { status: 400 }
      );
    }

    // Create the transaction
    const transaction = await TransactionModel.create({
      createdBy: session.user.id,
      title,
      description,
      totalAmount,
      category,
      date: date || new Date(),
      participants: participants.map((p: any) => ({
        userId: p.userId,
        amount: parseFloat(p.amount),
        isPaid: p.userId === session.user.id, // Mark the creator's portion as paid
      })),
      isSettled: false,
    });

    // Update balances between friends
    await updateFriendBalances(session.user.id, transaction);

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

/**
 * Updates friend balances based on a transaction
 */
async function updateFriendBalances(
  currentUserId: string,
  transaction: any
) {
  const creatorId = transaction.createdBy.toString();

  // Only update balances if the current user created the transaction
  if (currentUserId !== creatorId) return;

  for (const participant of transaction.participants) {
    const participantId = participant.userId.toString();

    // Skip the creator
    if (participantId === creatorId) continue;

    // Find the friendship between creator and participant
    const friendship = await FriendModel.findOne({
      $or: [
        { userId: creatorId, friendId: participantId },
        { userId: participantId, friendId: creatorId },
      ],
    }).exec();

    if (!friendship) continue;

    // Update the balance
    const amount = participant.amount;

    if (friendship.userId.toString() === creatorId) {
      // Creator is the userId in the friendship
      // Positive balance means the friend owes the creator
      friendship.balance += amount;
    } else {
      // Creator is the friendId in the friendship
      // Negative balance means the creator owes the friend
      friendship.balance -= amount;
    }

    await friendship.save();
  }
} 