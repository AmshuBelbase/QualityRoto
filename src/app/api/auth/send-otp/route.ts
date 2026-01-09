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

    // Check if email exists and active
    const existingUser = await User.findOne({ 
      email: email.toLowerCase(),
      role: { $ne: 'pending' }
    });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ FIXED: createTransport (not createTransporter)
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
      subject: 'Quality Roto Packaging - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>🔐 Verify Your Staff Account</h2>
          <div style="background: linear-gradient(135deg, #1B5FA6, #F15A29); color: white; padding: 20px; border-radius: 12px; text-align: center;">
            <h1 style="margin: 0; font-size: 48px;">${otp}</h1>
            <p>Your verification code expires in 10 minutes</p>
          </div>
          <p style="color: #666;">
            Enter this code in the Quality Roto Packaging Staff Portal to complete signup.
          </p>
        </div>
      `,
    };

    // Create pending user
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        fullName: 'OTP_PENDING',
        email: email.toLowerCase(),
        phone: `OTP_${otp}_${Date.now()}`,
        password: await bcrypt.hash(otp, 12),
        role: 'pending',
        isActive: false,
      },
      { upsert: true, new: true }
    );

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${email}`,
    });

  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
