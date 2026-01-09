'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

type SignupFormData = {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  otp?: string;
};

export default function StaffSignup() {
  const [step, setStep] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState<SignupFormData>({});
  
  // ✅ FIXED: Added watch to destructuring
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<SignupFormData>();
  const password = watch('password'); // Now works!

  // Step 1: Send OTP
  const sendOTP = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });
      
      const result = await res.json();
      
      if (result.success) {
        setUserEmail(data.email);
        setFormData(data);
        setStep(2);
        alert('✅ OTP sent! Check inbox/spam.');
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOTP = async (data: Partial<{otp: string}>) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          otp: data.otp
        })
      });
      
      const result = await res.json();
      
      if (result.success) {
        alert(`🎉 Account created! Role: ${result.user.role.toUpperCase()}`);
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
    setFormData({});
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Staff Portal</h1>
              <p className="text-xl text-gray-600">{step === 1 ? 'Join Team' : 'Enter OTP'}</p>
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

          {/* STEP 1: Complete Form */}
          {step === 1 ? (
            <form onSubmit={handleSubmit(sendOTP)} className="space-y-6">
              {/* All your existing form fields - same as before */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gray-50/50 transition-all text-lg text-black"
                  placeholder="Enter full name"
                  {...register('fullName', { 
                    required: 'Full name required',
                    minLength: { value: 2, message: 'Minimum 2 characters' }
                  })}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gray-50/50 transition-all text-lg text-black"
                  placeholder="your@email.com"
                  {...register('email', { 
                    required: 'Email required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.email.message}
                  </p>
                )}
              </div>

             <div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
  <div className="flex gap-2">
    {/* Fixed width country code */}
    <motion.select
      whileFocus={{ scale: 1.02 }}
      className="w-24 px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-white text-lg text-black shadow-sm"
      {...register('phoneCountryCode', { required: 'Country code required' })}
      defaultValue="+977"
    >
      <option value="+977">+977</option>
      <option value="+91">+91</option>
      <option value="+1">+1</option>
    </motion.select>
    
    {/* Fixed max-width phone input */}
    <motion.input
      whileFocus={{ scale: 1.02 }}
      type="tel"
      className="flex-1 max-w-[280px] min-w-0 px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-white text-lg text-black shadow-sm"
      placeholder="10 digit Phone Number"
      {...register('phoneNumber', { 
        required: 'Phone number required',
        pattern: { 
          value: /^\d{10}$/, 
          message: 'Enter 10-digit number only' 
        }
      })}
    />
  </div>
  {(errors.phoneCountryCode || errors.phoneNumber) && (
    <motion.p 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-red-500 text-sm mt-2 flex items-center gap-1"
    >
      <span className="text-lg">⚠️</span> 
      {errors.phoneCountryCode?.message || errors.phoneNumber?.message}
    </motion.p>
  )}
</div>


              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gray-50/50 transition-all text-lg text-black"
                  placeholder="Minimum 8 characters"
                  {...register('password', { 
                    required: 'Password required',
                    minLength: { value: 8, message: 'Minimum 8 characters' }
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gray-50/50 transition-all text-lg text-black"
                  placeholder="Repeat password"
                  {...register('confirmPassword', { 
                    required: 'Confirm password',
                    validate: value => value === password || 'Passwords must match'
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-[#1B5FA6] border-2 border-gray-300 rounded-lg mt-0.5 flex-shrink-0"
                  {...register('agreeToTerms', { required: 'You must agree to terms' })}
                />
                <label className="text-sm text-gray-700 leading-relaxed cursor-pointer flex-1">
                  I agree to <a href="https://www.qualityroto.com/terms" target="_blank" className="text-[#1B5FA6] hover:text-[#F15A29] font-semibold underline">Terms</a> and <a href="https://www.qualityroto.com/privacy" target="_blank" className="text-[#1B5FA6] hover:text-[#F15A29] font-semibold underline">Privacy Policy</a>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span>⚠️</span> {errors.agreeToTerms.message}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  '📧 Send OTP'
                )}
              </motion.button>
            </form>

          // STEP 2: OTP ONLY (SIMPLE SINGLE INPUT)
          ) : (
            <div className="space-y-8">
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] rounded-3xl mx-auto flex flex-col items-center justify-center text-white shadow-2xl mb-6">
                  <span className="text-3xl">📧</span>
                  <span className="text-sm font-bold mt-1">Verify</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter 6-digit code</h2>
                <p className="text-gray-600 mb-2">Sent to: <strong>{userEmail}</strong></p>
                <p className="text-sm text-gray-500">Check inbox/spam (expires in 10 min)</p>
              </div>

              <form onSubmit={handleSubmit(verifyOTP)} className="space-y-6">
                {/* SINGLE OTP INPUT - PERFECT VALIDATION */}
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-6 text-center">Verification Code</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    {...register('otp', { 
                      required: 'Enter 6-digit code',
                      pattern: {
                        value: /^\d{6}$/,
                        message: 'Enter exactly 6 digits'
                      }
                    })}
                    className="w-full text-center text-3xl font-bold tracking-widest py-8 px-6 rounded-3xl border-4 border-gray-200 focus:border-[#1B5FA6] focus:ring-8 focus:ring-[#1B5FA6]/20 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-2xl transition-all outline-none text-black"
                    placeholder="Enter OTP"
                  />
                  {errors.otp && (
                    <motion.p 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-red-500 text-sm mt-4 text-center flex items-center justify-center gap-2 bg-red-50 border border-red-200 rounded-2xl py-3 px-4"
                    >
                      <span className="text-xl">⚠️</span>
                      {errors.otp.message}
                    </motion.p>
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
                        Creating Account...
                      </>
                    ) : (
                      '✅ Create Account'
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          )}


          <div className="pt-8 border-t-2 border-gray-100 text-center space-y-2">
            <p className="text-sm text-gray-500">🔒 Staff Access Only</p>
            <p className="text-xs text-gray-400">
              Contact: <a href="mailto:qualityroto2015@gmail.com" className="text-[#1B5FA6] hover:text-[#F15A29]">qualityroto2015@gmail.com</a>
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Have account? <button onClick={() => window.location.href = '/internal/login'} className="text-[#1B5FA6] hover:text-[#F15A29] font-semibold">Login →</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
