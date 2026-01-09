import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, otp, newPassword } = await request.json();

    // Validation
    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Email, OTP, and new password required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check OTP expiry
    if (!user.resetOTPExpiry || user.resetOTPExpiry < new Date()) {
      return NextResponse.json({ error: 'Reset code expired. Request a new one.' }, { status: 400 });
    }

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, user.resetOTP!);
    if (!isValidOTP) {
      return NextResponse.json({ error: 'Invalid reset code' }, { status: 400 });
    }

    // Update password and clear OTP
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.',
    });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
