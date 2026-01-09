// app/api/auth/profile/route.ts - FIXED
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // ✅ VERIFY JWT TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (!decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
