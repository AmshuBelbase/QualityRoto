'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

type ForgotPasswordFormData = {
  email: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ForgotPasswordFormData>();

  // Step 1: Send OTP to reset password
  const sendResetOTP = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });
      
      const result = await res.json();
      
      if (result.success) {
        setUserEmail(data.email);
        setStep(2);
        alert('✅ Reset code sent! Check inbox/spam.');
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and set new password
  const resetPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          otp: data.otp,
          newPassword: data.newPassword
        })
      });
      
      const result = await res.json();
      
      if (result.success) {
        alert('🎉 Password reset successful! Redirecting to login...');
        reset();
        window.location.href = '/internal/login';
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setStep(1);
    setUserEmail('');
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100 px-4 flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-60 h-20 rounded-2xl mx-auto flex items-center justify-center">
              <Image src="/logo.png" alt="Quality Roto" width={65} height={30} className="w-22 h-auto" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Reset Password</h1>
              <p className="text-xl text-gray-600">
                {step === 1 ? 'Enter email to reset' : 'Enter verification code'}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-200 rounded-full">
              <div className={`h-2 rounded-full transition-all duration-500 ${
                step === 1 ? 'w-1/2 bg-gradient-to-r from-[#1B5FA6] to-[#F15A29]' : 'w-full bg-gradient-to-r from-[#1B5FA6] to-[#F15A29]'
              }`} />
            </div>
            <div className="text-sm font-medium text-gray-500">Step {step} of 2</div>
          </div>

          {/* STEP 1: Email Input */}
          {step === 1 ? (
            <form onSubmit={handleSubmit(sendResetOTP)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gray-50/50 transition-all text-lg text-black outline-none placeholder-gray-500"
                  placeholder="your@email.com"
                  {...register('email', { 
                    required: 'Email required',
                    pattern: { 
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                      message: 'Invalid email' 
                    }
                  })}
                />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                  >
                    <span className="text-lg">⚠️</span> {errors.email.message}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  '📧 Send Reset Code'
                )}
              </motion.button>
            </form>

          // STEP 2: OTP + New Password
          ) : (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] rounded-3xl mx-auto flex flex-col items-center justify-center text-white shadow-2xl mb-6">
                  <span className="text-3xl">🔐</span>
                  <span className="text-sm font-bold mt-1">Reset</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Password</h2>
                <p className="text-gray-600 mb-2">Code sent to: <strong>{userEmail}</strong></p>
                <p className="text-sm text-gray-500">Enter 6-digit code and new password</p>
              </div>

              <form onSubmit={handleSubmit(resetPassword)} className="space-y-6">
                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Verification Code *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full text-center text-2xl font-bold tracking-widest py-5 px-6 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl transition-all outline-none text-black"
                    placeholder="000000"
                    {...register('otp', { 
                      required: 'Enter 6-digit code',
                      pattern: { value: /^\d{6}$/, message: 'Enter exactly 6 digits' }
                    })}
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-2 text-center flex items-center justify-center gap-2 bg-red-50 border border-red-200 rounded-xl py-2 px-3">
                      <span className="text-lg">⚠️</span> {errors.otp.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="password"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gray-50/50 transition-all text-lg text-black outline-none placeholder-gray-500"
                    placeholder="Minimum 8 characters"
                    {...register('newPassword', { 
                      required: 'New password required',
                      minLength: { value: 8, message: 'Minimum 8 characters' }
                    })}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span> {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="password"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gray-50/50 transition-all text-lg text-black outline-none placeholder-gray-500"
                    placeholder="Repeat new password"
                    {...register('confirmPassword', {
                      required: 'Confirm new password',
                      validate: value => 
                        value === (document.querySelector('input[name="newPassword"]') as HTMLInputElement)?.value || 
                        'Passwords must match'
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span> {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={goBack}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-5 px-8 rounded-2xl font-bold text-lg border-2 border-gray-200 transition-all shadow-md"
                  >
                    ← Back
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Reset Password...
                      </>
                    ) : (
                      '✅ Reset Password'
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="pt-8 border-t-2 border-gray-100 text-center space-y-2">
            <p className="text-sm text-gray-500">🔒 Staff Access Only</p> 
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button 
                onClick={() => window.location.href = '/internal/login'} 
                className="text-[#1B5FA6] hover:text-[#F15A29] font-semibold transition-colors"
              >
                Login →
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
