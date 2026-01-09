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
};

export default function StaffSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>();
  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    // TODO: Backend will receive: phone = data.phoneCountryCode + data.phoneNumber
    console.log('Signup data:', {
      ...data,
      fullPhone: `${data.phoneCountryCode}${data.phoneNumber}` // For backend
    });
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100 px-4 flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8">
          
          {/* Logo Header */}
          <div className="text-center space-y-4">
            <div className="w-60 h-20 rounded-2xl mx-auto flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="Quality Roto Packaging" 
                width={65} 
                height={30}
                className="w-22 h-auto"
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                Staff Portal
              </h1>
              <p className="text-xl text-gray-600">Join Quality Roto Packaging Team</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                id="fullName"
                {...register('fullName', { 
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gray-50/50 transition-all outline-none text-lg placeholder-gray-500"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <span className="text-lg">⚠️</span>
                  {errors.fullName.message}
                </motion.p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                id="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gray-50/50 transition-all outline-none text-lg placeholder-gray-500"
                placeholder="Enter your email address"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <span className="text-lg">⚠️</span>
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Phone Number Field - NEW */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              {/* Country Code Dropdown - FIXED DESIGN */}
              <div className="flex gap-2">
                {/* Country Code Select - Clean & Professional */}
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  id="phoneCountryCode"
                  {...register('phoneCountryCode', { 
                    required: 'Country code is required'
                  })}
                  defaultValue="+977"
                  className="w-28 px-4 py-4 rounded-2xl border-2 border-gray-200 
                              focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 
                              bg-white text-gray-900 text-lg font-medium 
                              appearance-none cursor-pointer hover:border-[#1B5FA6]/50
                              transition-all duration-200 shadow-sm"
                
                >
                  <option value="" disabled>+977</option>
                  <option value="+977">+977</option>
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                </motion.select>

                {/* Phone Number Input */}
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="tel"
                  id="phoneNumber"
                  {...register('phoneNumber', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\d{10}$/,
                      message: 'Enter 10-digit phone number'
                    }
                  })}
                  className="flex-1 px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-white text-gray-900 text-lg font-medium shadow-sm transition-all outline-none placeholder-gray-500"
                  placeholder="10-digit phone number"
                />
              </div>

              {errors.phoneCountryCode && (
                <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span className="text-lg">⚠️</span>
                  {errors.phoneCountryCode.message}
                </motion.p>
              )}
              {errors.phoneNumber && (
                <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span className="text-lg">⚠️</span>
                  {errors.phoneNumber.message}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                id="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gray-50/50 transition-all outline-none text-lg placeholder-gray-500"
                placeholder="Create strong password"
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <span className="text-lg">⚠️</span>
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                id="confirmPassword"
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gray-50/50 transition-all outline-none text-lg placeholder-gray-500"
                placeholder="Repeat your password"
              />
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <span className="text-lg">⚠️</span>
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('agreeToTerms', { 
                    required: 'You must agree to the terms' 
                  })}
                  className="w-5 h-5 text-[#1B5FA6] border-2 border-gray-300 rounded-lg focus:ring-[#1B5FA6] mt-0.5 flex-shrink-0 transition-all"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I agree to Quality Roto Packaging's{' '}
                  <button 
                    type="button"
                    className="text-[#1B5FA6] hover:text-[#F15A29] font-semibold transition-colors underline"
                    onClick={() => window.open('https://www.qualityroto.com/terms', '_blank')}
                  >
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button 
                    type="button"
                    className="text-[#1B5FA6] hover:text-[#F15A29] font-semibold transition-colors underline"
                    onClick={() => window.open('https://www.qualityroto.com/privacy', '_blank')}
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.agreeToTerms && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <span className="text-lg">⚠️</span>
                  {errors.agreeToTerms.message}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                'Create Staff Account'
              )}
            </motion.button>
          </form>

          {/* Staff Notice */}
          <div className="pt-6 border-t-2 border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-2">🔒 Staff Access Only</p>
            <p className="text-xs text-gray-400">
              Contact IT for approval • <button 
                className="text-[#1B5FA6] hover:text-[#F15A29] underline" 
                onClick={() => window.open('mailto:qualityroto2015@gmail.com?subject=Staff Account Request', '_blank')}
              >
                qualityroto2015@gmail.com
              </button>
            </p>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => window.location.href = '/internal/login'}
                className="text-[#1B5FA6] hover:text-[#F15A29] font-semibold transition-colors"
              >
                Log in instead
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div> 
  );
}
