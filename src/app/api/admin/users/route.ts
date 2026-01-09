// app/api/admin/users/route.ts - BUILDS SUCCESSFULLY
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';

export async function GET() {
  await connectDB();
  const users = await User.find({}, '-password').lean();
  return NextResponse.json(users);
}

export async function PUT(request: NextRequest) {
  const { userId, permissions } = await request.json();
  await connectDB();
  await User.findByIdAndUpdate(userId, { permissions });
  return NextResponse.json({ success: true });
}
