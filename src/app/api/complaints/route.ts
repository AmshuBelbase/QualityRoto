import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/lib/models/Complaint';
import { verifyToken } from '@/lib/jwt';

// GET all complaints
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  await connectDB();
  
  const complaints = await Complaint.find()
    .populate('orderId', 'customerName customerPhone')
    .populate('createdBy', 'fullName email')
    .populate('resolvedBy', 'fullName email')
    .sort({ createdAt: -1 })
    .lean();
  
  return NextResponse.json(complaints);
}

// POST new complaint
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { orderId, section, description } = await request.json();
  await connectDB();

  const complaint = await Complaint.create({
    orderId,
    section,
    description,
    createdBy: decoded.id,
    status: 'open'
  });

  await complaint.populate('orderId', 'customerName customerPhone');
  await complaint.populate('createdBy', 'fullName email');

  return NextResponse.json({ success: true, complaint });
}

// PUT update complaint (resolve)
export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  try {
    const { complaintId, status } = await request.json();
    
    if (!complaintId) {
      return NextResponse.json({ error: 'Complaint ID is required' }, { status: 400 });
    }

    await connectDB();

    const updateFields: any = { status };
    
    if (status === 'resolved') {
      updateFields.resolvedBy = decoded.id;
      updateFields.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId, 
      updateFields, 
      { new: true }
    )
      .populate('orderId', 'customerName customerPhone')
      .populate('createdBy', 'fullName email')
      .populate('resolvedBy', 'fullName email');

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, complaint });
  } catch (error) {
    console.error('Error resolving complaint:', error);
    return NextResponse.json({ error: 'Failed to resolve complaint' }, { status: 500 });
  }
}
