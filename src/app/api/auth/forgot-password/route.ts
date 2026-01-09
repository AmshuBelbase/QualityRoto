import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await connectDB();

    // Check if user exists and is active
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });
    
    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in user record (hashed, expires in 10 minutes)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.resetOTP = await bcrypt.hash(otp, 12);
    user.resetOTPExpiry = otpExpiry;
    await user.save();

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER!,
        pass: process.env.GMAIL_PASS!,
      },
    });

    // Email template
    const mailOptions = {
      from: process.env.GMAIL_USER!,
      to: email,
      subject: 'Quality Roto Packaging - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>🔐 Reset Your Password</h2>
          <div style="background: linear-gradient(135deg, #1B5FA6, #F15A29); color: white; padding: 20px; border-radius: 12px; text-align: center;">
            <h1 style="margin: 0; font-size: 48px;">${otp}</h1>
            <p>This code expires in 10 minutes</p>
          </div>
          <p style="color: #666;">
            Use this code on the Quality Roto Packaging Staff Portal to reset your password.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            If you didn't request this, ignore this email.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Password reset code sent successfully',
    });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to send reset code' }, { status: 500 });
  }
}
