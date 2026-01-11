import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { verifyToken } from '@/lib/jwt';

// GET all orders (filtered by permission)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  await connectDB();
  
  // ✅ FIX: Populate all user references
  const orders = await Order.find()
    .populate('createdBy', 'fullName email')
    .populate('reviewedBy', 'fullName email')
    .populate('saProcessedBy', 'fullName email')
    .populate('sbProcessedBy', 'fullName email')
    .populate('scProcessedBy', 'fullName email')
    .populate('packagedBy', 'fullName email')
    .populate('dispatchedBy', 'fullName email')
    .sort({ createdAt: -1 })
    .lean();
  
  return NextResponse.json(orders);
}

// POST new order
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const body = await request.json();
  await connectDB();

  const order = await Order.create({
    ...body,
    createdBy: decoded.id, // ✅ Ensure this is set
    status: 'NEW'
  });

  // ✅ Populate before returning
  await order.populate('createdBy', 'fullName email');

  return NextResponse.json({ success: true, order });
}

// PUT update order status
export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { orderId, status, section } = await request.json();
  await connectDB();

  const updateFields: any = { status };
  
  // Track who processed at each section
  if (section === 'review') {
    updateFields.reviewedBy = decoded.id;
    updateFields.reviewedAt = new Date();
  } else if (section === 'sa') {
    updateFields.saProcessedBy = decoded.id;
    updateFields.saProcessedAt = new Date();
  } else if (section === 'sb') {
    updateFields.sbProcessedBy = decoded.id;
    updateFields.sbProcessedAt = new Date();
  } else if (section === 'sc') {
    updateFields.scProcessedBy = decoded.id;
    updateFields.scProcessedAt = new Date();
  } else if (section === 'packaging') {
    updateFields.packagedBy = decoded.id;
    updateFields.packagedAt = new Date();
  } else if (section === 'dispatch') {
    updateFields.dispatchedBy = decoded.id;
    updateFields.dispatchedAt = new Date();
  }

  const order = await Order.findByIdAndUpdate(orderId, updateFields, { new: true })
    .populate('createdBy', 'fullName email')
    .populate('reviewedBy', 'fullName email')
    .populate('saProcessedBy', 'fullName email')
    .populate('sbProcessedBy', 'fullName email')
    .populate('scProcessedBy', 'fullName email')
    .populate('packagedBy', 'fullName email')
    .populate('dispatchedBy', 'fullName email');
    
  return NextResponse.json({ success: true, order });
}
