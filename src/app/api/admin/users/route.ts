// app/api/admin/users/route.ts - JWT PROTECTED
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  // Get token from Authorization header
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  // Verify JWT token
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  await connectDB();
  const users = await User.find({}, '-password').lean();
  return NextResponse.json(users);
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const { userId, permissions } = await request.json();
  await connectDB();
  await User.findByIdAndUpdate(userId, { permissions });
  return NextResponse.json({ success: true });
}
