'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function StaffLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      
      if (result.success) {
        // Store token in localStorage/cookies
        localStorage.setItem('token', result.token);
        alert('Login successful! Redirecting...');
        window.location.href = '/dashboard'; // Create this later
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100 px-4 flex items-center justify-center py-12">
      {/* Background gradient decoration */}
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
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
              <p className="text-xl text-gray-600">Login Here</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
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
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gray-50/50 transition-all outline-none text-lg placeholder-gray-500 text-black"
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
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#1B5FA6] focus:ring-4 focus:ring-[#1B5FA6]/10 bg-gray-50/50 transition-all outline-none text-lg placeholder-gray-500 text-black"
                placeholder="Enter your password"
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

            {/* Remember Me & Help */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-5 h-5 text-[#1B5FA6] border-2 border-gray-300 rounded-lg focus:ring-[#1B5FA6] transition-all"
                />
                <span className="text-sm font-medium text-gray-700">Remember me</span>
              </label>
              <button 
                type="button"
                className="text-sm text-[#1B5FA6] hover:text-[#F15A29] font-semibold transition-colors"
                onClick={() => window.open('mailto:qualityroto2015@gmail.com?subject=Staff Portal Access Help', '_blank')}
              >
                Need Help?
              </button>
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
                  Signing In...
                </>
              ) : (
                'Log In to Portal'
              )}
            </motion.button>
          </form>

          {/* Staff Notice */}
          <div className="pt-6 border-t-2 border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-2">🔒 Staff Access Only</p>
            {/* <p className="text-xs text-gray-400">
              Contact IT if you need access • qualityroto2015@gmail.com
            </p> */}
          </div>
          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={() => window.location.href = '/internal/signup'}
                className="text-[#1B5FA6] hover:text-[#F15A29] font-semibold transition-colors"
              >
                Create an Account instead
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
