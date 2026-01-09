import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { fullName, email, phoneCountryCode, phoneNumber, password, otp } = await request.json();
    
    // Validation
    if (!fullName || !email || !phoneCountryCode || !phoneNumber || !password || !otp) {
      return NextResponse.json({ error: 'All fields including OTP required' }, { status: 400 });
    }

    const fullPhone = `${phoneCountryCode}${phoneNumber}`;
    
    // Find pending user
    const pendingUser = await User.findOne({ 
      email: email.toLowerCase(),
      role: 'pending'
    });

    if (!pendingUser) {
      return NextResponse.json({ error: 'No OTP sent to this email. Please request OTP first.' }, { status: 400 });
    }

    // Verify OTP (compare with temp password)
    const isValidOTP = await bcrypt.compare(otp, pendingUser.password);
    if (!isValidOTP) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Check phone not used by others
    const phoneExists = await User.findOne({ phone: fullPhone, role: { $ne: 'pending' } });
    if (phoneExists) {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
    }

    // Admin check
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim().toLowerCase());
    const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'staff';

    // Update user with real data
    pendingUser.fullName = fullName;
    pendingUser.phone = fullPhone;
    pendingUser.password = await bcrypt.hash(password, 12);
    pendingUser.role = role;
    pendingUser.isActive = true;

    await pendingUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: pendingUser._id, email: pendingUser.email, role: pendingUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Account verified and created successfully!',
      user: {
        id: pendingUser._id,
        fullName: pendingUser.fullName,
        email: pendingUser.email,
        phone: pendingUser.phone,
        role: pendingUser.role
      },
      token
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
