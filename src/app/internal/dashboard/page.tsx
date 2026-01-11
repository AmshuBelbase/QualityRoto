'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import NewOrdersSection from '@/components/sections/NewOrdersSection';
import SASection from '@/components/sections/SASection';
import SBSection from '@/components/sections/SBSection';
import SCSection from '@/components/sections/SCSection';
import PackagingSection from '@/components/sections/PackagingSection';
import DispatchedSection from '@/components/sections/DispatchedSection';
import ComplaintsSection from '@/components/sections/ComplaintsSection';
import CreateOrderSection from '@/components/sections/CreateOrderSection';

type Permission = 'read_only' | 'read_write' | 'no_access';
type Permissions = {
  createOrder: Permission;
  newOrders: Permission;
  sa: Permission;
  sb: Permission;
  sc: Permission;
  packaging: Permission;
  dispatched: Permission;
  complaints: Permission;
};

type UserProfile = {
  fullName: string;
  role: 'admin' | 'staff';
  permissions: Permissions;
};

const sections = [
  { id: 'createOrder', label: 'Create Order', icon: '➕', color: 'from-teal-400 to-teal-700' },
  { id: 'newOrders', label: 'New Orders', icon: '📋', color: 'from-[#1B5FA6] to-[#F15A29]' },
  { id: 'sa', label: 'Section A', icon: '⚙️', color: 'from-orange-300 to-orange-600' },
  { id: 'sb', label: 'Section B', icon: '🔧', color: 'from-green-300 to-green-600' },
  { id: 'sc', label: 'Section C', icon: '🔩', color: 'from-blue-300 to-blue-600' },
  { id: 'packaging', label: 'Packaging', icon: '📦', color: 'from-purple-300 to-purple-500' },
  { id: 'dispatched', label: 'Dispatched', icon: '🚚', color: 'from-indigo-300 to-indigo-500' },
  { id: 'complaints', label: 'Complaints', icon: '⚠️', color: 'from-red-400 to-red-600' },
];

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) {
      window.location.href = '/internal/login';
      return;
    }

    fetch('/api/auth/profile', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.fullName) {
        setUser({
          fullName: data.fullName,
          role: data.role === 'admin' ? 'admin' : 'staff',
          permissions: data.permissions
        });
      } else {
        throw new Error('No user data');
      }
    })
    .catch(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('rememberMe');
      window.location.href = '/internal/login';
    })
    .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    let local_level = sessionStorage.getItem('rememberMe') || localStorage.getItem('rememberMe');
    if(local_level === 'true'){
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
    } else {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('rememberMe');
    }
    window.location.href = '/internal/login';
  };

  const accessibleSections = sections.filter(section => 
    user?.permissions[section.id as keyof Permissions] !== 'no_access'
  );

  useEffect(() => {
    if (user && accessibleSections.length > 0 && !activeSection) {
      setActiveSection(accessibleSections[0].id);
    }
  }, [user, accessibleSections, activeSection]);

  const renderSectionContent = () => {
    if (!activeSection || !user) return null;

    const permission = user.permissions[activeSection as keyof Permissions];

    switch (activeSection) {
      case 'createOrder':
        return <CreateOrderSection permission={permission} />;
      case 'newOrders':
        return <NewOrdersSection permission={permission} />;
      case 'sa':
        return <SASection permission={permission} />;
      case 'sb':
        return <SBSection permission={permission} />;
      case 'sc':
        return <SCSection permission={permission} />;
      case 'packaging':
        return <PackagingSection permission={permission} />;
      case 'dispatched':
        return <DispatchedSection permission={permission} />;
      case 'complaints':
        return <ComplaintsSection permission={permission} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-xl md:text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <Navbar 
        userFullName={user?.fullName}
        userRole={user?.role}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 md:py-12">
        {accessibleSections.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 md:py-32 px-4"
          >
            <div className="text-4xl md:text-6xl mb-4 md:mb-8">🚫</div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">No Access</h1>
            <p className="text-base md:text-xl text-gray-600 max-w-md mx-auto">
              You don't have access to any sections. Please contact administrator.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-4 mb-6 md:mb-12 border border-white/50">
              <div className="flex overflow-x-auto gap-2 md:gap-4 pb-2 md:pb-4 -mb-2 md:-mb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {accessibleSections.map((section) => {
                  const permission = user!.permissions[section.id as keyof Permissions];
                  return (
                    <motion.button
                      key={section.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold shadow-lg transition-all whitespace-nowrap min-w-fit text-xs sm:text-base ${
                        activeSection === section.id
                          ? 'bg-gradient-to-br ' + section.color + ' text-white shadow-2xl'
                          : 'bg-white/50 hover:bg-white shadow-xl border border-gray-200'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl">{section.icon}</span>
                      <span className="text-center text-black sm:text-left">{section.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.div
              key={activeSection || 'welcome'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderSectionContent()}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
