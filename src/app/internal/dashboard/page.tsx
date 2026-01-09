'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type Permission = 'read_only' | 'read_write' | 'no_access';
type Permissions = {
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
  { id: 'newOrders', label: 'New Orders', icon: '📋', color: 'from-[#1B5FA6] to-[#F15A29]' },
  { id: 'sa', label: 'Section A', icon: '⚙️', color: 'from-orange-500 to-orange-600' },
  { id: 'sb', label: 'Section B', icon: '🔧', color: 'from-green-500 to-green-600' },
  { id: 'sc', label: 'Section C', icon: '🔩', color: 'from-blue-500 to-blue-600' },
  { id: 'packaging', label: 'Packaging', icon: '📦', color: 'from-purple-500 to-purple-600' },
  { id: 'dispatched', label: 'Dispatched', icon: '🚚', color: 'from-indigo-500 to-indigo-600' },
  { id: 'complaints', label: 'Complaints', icon: '⚠️', color: 'from-red-500 to-red-600' },
];

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user permissions from token on load
useEffect(() => {
  let token = sessionStorage.getItem('token') || localStorage.getItem('token');
  if (!token) {
    window.location.href = '/internal/login';
    return;
  }

  // Fetch real user profile
  fetch('/api/auth/profile', {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log('Profile data:', data); // DEBUG
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
  .catch((error) => {
    console.error('Profile fetch error:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('rememberMe');
    window.location.href = '/internal/login';
  })
  .finally(() => setLoading(false));
}, []);

  const handleLogout = () => {
    // Clear ALL storage
    let local_level = sessionStorage.getItem('rememberMe') || localStorage.getItem('rememberMe');
    // alert(token_level);
    if(local_level === 'true'){
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
    } else {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('rememberMe');
    }
    window.location.href = '/internal/login';
  };

  // Filter accessible sections (no_access excluded)
  const accessibleSections = sections.filter(section => 
    user?.permissions[section.id as keyof Permissions] !== 'no_access'
  );

  const SectionContent = ({ sectionId }: { sectionId: string }) => {
    const section = sections.find(s => s.id === sectionId);
    return (
      <div className="h-96 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-12 flex items-center justify-center text-center">
        <div>
          <div className="text-8xl mb-8">{section?.icon}</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{section?.label}</h2>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            {section?.label} Content Area
            <br />
            <span className="font-semibold text-[#1B5FA6] mt-4 block">
              Permission: {user?.permissions[sectionId as keyof Permissions]?.replace('_', ' ').toUpperCase()}
            </span>
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3"> 
                <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
                >
                <Image 
                    src="/logo.png" 
                    alt="Quality Roto Packaging" 
                    width={180} 
                    height={60}
                    className={`h-15 w-auto transition-all duration-300`}
                    priority
                />
                </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] bg-clip-text text-transparent">
                Staff Portal
              </span>
            </div>

            <div className="flex items-center space-x-3">
            {/* User Profile - Single Line */}
            <div className="flex items-center space-x-2">
                <div className={`w-10 h-10 ${user?.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'} rounded-full flex items-center justify-center shadow-md flex-shrink-0`}>
                <span className="font-bold text-white text-sm">
                    {user?.fullName?.charAt(0).toUpperCase() || 'S'}
                </span>
                </div>
                <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-gray-900 truncate">
                    {user?.fullName || 'Loading...'}
                </div>
                </div>
                <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                user?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                {user?.role ? user.role.toUpperCase() : 'LOADING'}
                </div>
            </div>

            {/* Logout */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl whitespace-nowrap flex-shrink-0"
            >
                Logout
            </motion.button>
            </div>

          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Navbar Sections */}
        {accessibleSections.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="text-6xl mb-8">🚫</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-6">No Access</h1>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              You don't have access to any sections. Please contact administrator.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Horizontal Navbar */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-4 mb-12 border border-white/50">
              <div className="flex overflow-x-auto gap-4 pb-4 -mb-4">
                {accessibleSections.map((section) => {
                  const permission = user!.permissions[section.id as keyof Permissions];
                  return (
                    <motion.button
                      key={section.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold shadow-lg transition-all whitespace-nowrap min-w-fit ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r ' + section.color + ' text-white shadow-2xl'
                          : 'bg-white/50 hover:bg-white shadow-xl border border-gray-200'
                      }`}
                    >
                      <span className="text-2xl">{section.icon}</span>
                      <span>{section.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        permission === 'read_write' ? 'bg-green-500/20 text-green-700 border border-green-500/30' :
                        'bg-blue-500/20 text-blue-700 border border-blue-500/30'
                      }`}>
                        {permission.replace('_', ' ').toUpperCase()}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Active Section Content */}
            <motion.div
              key={activeSection || 'welcome'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection ? (
                <SectionContent sectionId={activeSection} />
              ) : (
                <div className="text-center py-32">
                  <div className="text-6xl mb-8">🚀</div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Dashboard</h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Click on any section above to view content. Only sections you have access to are shown.
                  </p>
                  <p className="text-lg text-gray-500 mt-4 font-semibold">
                    Accessible sections: {accessibleSections.length} / 7
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
