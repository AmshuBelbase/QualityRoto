import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/lib/models/Complaint';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  await connectDB();
  const complaints = await Complaint.find()
    .populate('orderId', 'customerName')
    .populate('createdBy', 'fullName email')
    .sort({ createdAt: -1 });

  return NextResponse.json(complaints);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const body = await request.json();
  await connectDB();

  const complaint = await Complaint.create({
    ...body,
    createdBy: decoded.id,
    status: 'open'
  });

  return NextResponse.json({ success: true, complaint });
}
