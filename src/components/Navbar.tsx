'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type NavbarProps = {
  userFullName?: string;
  userRole?: 'admin' | 'staff';
  onLogout: () => void;
};

export default function Navbar({ userFullName, userRole, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
            <Link href="/internal" className="flex items-center flex-shrink-0">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                <Image 
                  src="/logo.png" 
                  alt="Quality Roto Packaging" 
                  width={140} 
                  height={47}
                  className="h-10 md:h-15 w-auto transition-all duration-300"
                  priority
                />
              </motion.div>
            </Link>
            <span className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] bg-clip-text text-transparent hidden xs:block truncate">
              Staff Portal
            </span>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {userRole === 'admin' && (
              <Link href="/internal/admin/users">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl whitespace-nowrap flex items-center gap-2"
                >
                   Admin Panel ➡️
                </motion.button>
              </Link>
            )}

            <div className="flex items-center space-x-2">
              <div className={`w-10 h-10 ${userRole === 'admin' ? 'bg-purple-500' : 'bg-green-500'} rounded-full flex items-center justify-center shadow-md`}>
                <span className="font-bold text-white text-sm">
                  {userFullName?.charAt(0).toUpperCase() || 'S'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-gray-900 truncate">
                  {userFullName || 'Loading...'}
                </div>
              </div>
              <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                userRole === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {userRole ? userRole.toUpperCase() : 'LOADING'}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Logout
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-black transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-3 grid grid-rows-1 gap-3 border-t border-gray-200 pt-4"
          >
            <div className="flex items-center space-x-3 gap-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 ${userRole === 'admin' ? 'bg-purple-500' : 'bg-green-500'} rounded-full flex items-center justify-center shadow-md flex-shrink-0`}>
                <span className="font-bold text-white text-sm">
                  {userFullName?.charAt(0).toUpperCase() || 'S'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-gray-900 truncate">
                  {userFullName || 'Loading...'}
                </div>
                <div className={`text-xs font-semibold inline-block px-2 py-0.5 rounded-full mt-1 ${
                  userRole === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {userRole ? userRole.toUpperCase() : 'LOADING'}
                </div>
              </div>
            </div>

            {userRole === 'admin' && (
              <Link href="/internal/admin/users">
                <button
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold text-sm rounded-xl shadow-lg"
                >
                   Admin Panel ➡️
                </button>
              </Link>
            )}

            <button
              onClick={onLogout}
              className="w-full h-10 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm rounded-xl shadow-lg"
            >
            ⬅️ Logout
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
