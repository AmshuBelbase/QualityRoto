'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken } from '@/lib/jwt';
import Navbar from '@/components/Navbar';

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

type User = {
  _id: string;
  email: string;
  fullName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  role: 'ADMIN' | 'STAFF';
  permissions: Permissions;
};

const sectionLabels: Record<string, string> = {
  createOrder: 'Create Order',
  newOrders: 'New Orders',
  sa: 'Section A',
  sb: 'Section B',
  sc: 'Section C',
  packaging: 'Packaging',
  dispatched: 'Dispatched',
  complaints: 'Complaints'
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null); // ✅ NEW: Track expanded cards
  const [currentUser, setCurrentUser] = useState<{ fullName: string; role: 'admin' | 'staff' } | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = '/internal/login';
      return;
    }

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({
          fullName: decoded.fullName || 'Admin',
          role: decoded.role === 'admin' ? 'admin' : 'staff'
        });
      } catch (error) {
        console.error('Error decoding token');
      }
    }
    
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      if (decoded.role !== 'admin') {
        const currentPath = window.location.pathname;
        if (currentPath === '/internal/admin/users') {
          window.location.href = '/internal/dashboard';
        } else {
          alert('Admin access required for user management');
        }
      } else {
        fetchUsers();
      }
    } catch {
      window.location.href = '/internal/login';
    }
  }, []);

  const fetchUsers = async () => {
    const token = getToken();
    if (!token) {
      alert('Please login first');
      window.location.href = '/internal/login';
      return;
    }

    const res = await fetch('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('rememberMe');
      alert('Session expired. Please login again.');
      window.location.href = '/internal/login';
      return;
    }

    if (res.status === 403) {
      alert('Admin access required');
      return;
    }

    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
    setLoading(false);
  };

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

  const updatePermissions = async (userId: string, permissions: Permissions) => {
    const token = getToken();
    if (!token) {
      alert('Please login first');
      window.location.href = '/internal/login';
      return;
    }

    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, permissions }),
    });



    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('rememberMe');
      alert('Session expired or insufficient permissions');
      window.location.href = '/internal/login';
      return;
    }

    if (res.ok) {
      fetchUsers();
      setEditingUser(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-xl md:text-2xl">Loading users...</div>
      </div>
    );
  }

  const adminCount = users.filter(u => u.role.toUpperCase() === 'ADMIN').length;
  const staffCount = users.filter(u => u.role.toUpperCase() === 'STAFF').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      <Navbar 
        userFullName={currentUser?.fullName}
        userRole={currentUser?.role}
        onLogout={handleLogout}
      />

      <div className="p-3 sm:p-4 md:p-8">

      

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header - Mobile Responsive */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] bg-clip-text text-transparent mb-2 md:mb-4">
            Staff Management
          </h1>
          <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Manage access permissions for all staff members across order workflow sections
          </p>
        </div>

        {/* Stats - Mobile Responsive */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-12">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/50">
            <div className="text-2xl md:text-3xl font-bold text-[#1B5FA6]">{users.length}</div>
            <div className="text-xs md:text-base text-gray-600">Total Staff</div>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/50">
            <div className="text-2xl md:text-3xl font-bold text-green-600">{adminCount}</div>
            <div className="text-xs md:text-base text-gray-600">Admins</div>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/50">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">{staffCount}</div>
            <div className="text-xs md:text-base text-gray-600">Staff</div>
          </div>
        </div>

        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden lg:block bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] text-white">
                <tr>
                  <th className="p-4 xl:p-6 text-left font-bold text-sm xl:text-lg">Staff Info</th>
                  <th className="p-4 xl:p-6 text-center font-bold text-sm xl:text-base">Create</th>
                  <th className="p-4 xl:p-6 text-center font-bold text-sm xl:text-base">New</th>
                  <th className="p-4 xl:p-6 text-center font-bold text-sm xl:text-base">SA</th>
                  <th className="p-4 xl:p-6 text-center font-bold text-sm xl:text-base">SB</th>
                  <th className="p-4 xl:p-6 text-center font-bold text-sm xl:text-base">SC</th>
                  <th className="p-4 xl:p-6 text-center font-bold text-sm xl:text-base">Pack</th>
                  <th className="p-4 xl:p-6 text-center font-bold text-sm xl:text-base">Disp</th>
                  <th className="p-4 xl:p-6 text-center font-bold text-sm xl:text-base">Comp</th>
                  <th className="p-4 xl:p-6 text-center font-bold text-sm xl:text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <motion.tr 
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-gray-100 hover:bg-orange-50 transition-colors"
                  >
                    <td className="p-4 xl:p-6">
                      <div>
                        <div className="font-bold text-base xl:text-lg text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-blue-600 truncate">{user.email}</div>
                        <div className="text-xs text-gray-500">{user.phoneCountryCode}{user.phoneNumber}</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    
                    {(['createOrder', 'newOrders', 'sa', 'sb', 'sc', 'packaging', 'dispatched', 'complaints'] as const).map((section) => (
                      <td key={section} className="p-4 xl:p-6 text-center">
                        {editingUser?._id === user._id ? (
                          <select
                            value={editingUser.permissions[section]}
                            onChange={(e) => setEditingUser({
                              ...editingUser,
                              permissions: { ...editingUser.permissions, [section]: e.target.value as Permission }
                            })}
                            className="px-2 py-1.5 rounded-lg border border-gray-300 focus:border-[#1B5FA6] focus:ring-2 text-xs"
                            aria-label={`Permission for ${sectionLabels[section]}`}
                          >
                            <option value="no_access">No Access</option>
                            <option value="read_only">Read Only</option>
                            <option value="read_write">Read/Write</option>
                          </select>
                        ) : (
                          <span className={`px-2 xl:px-3 py-1 rounded-lg font-bold text-[10px] xl:text-xs whitespace-nowrap ${
                            user.permissions[section] === 'read_write' ? 'bg-green-100 text-green-800' :
                            user.permissions[section] === 'read_only' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {user.permissions[section]?.toUpperCase().replace('_', ' ')}
                          </span>
                        )}
                      </td>
                    ))}
                    
                    <td className="p-4 xl:p-6 text-center">
                      {editingUser?._id === user._id ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => updatePermissions(user._id, editingUser.permissions)}
                            className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-bold text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingUser(user)}
                          className="px-3 py-1.5 bg-[#1B5FA6] text-white rounded-lg hover:bg-[#F15A29] font-bold transition-all text-xs"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View with Collapsible Permissions */}
        <div className="lg:hidden space-y-4">
          {users.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-4"
            >
              {/* User Info Header */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 truncate">{user.fullName}</h3>
                  <p className="text-sm text-blue-600 truncate">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.phoneCountryCode}{user.phoneNumber}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-2 ${
                  user.role === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </div>

              {/* ✅ NEW: Collapsible Permissions Header */}
              <button
                onClick={() => setExpandedUserId(expandedUserId === user._id ? null : user._id)}
                className="w-full flex items-center justify-between bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-3 mb-3 hover:from-blue-100 hover:to-orange-100 transition-all"
              >
                <span className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                  🔐 Permissions
                  <span className="text-xs text-gray-500">
                    ({Object.values(user.permissions).filter(p => p !== 'no_access').length}/8 active)
                  </span>
                </span>
                <motion.div
                  animate={{ rotate: expandedUserId === user._id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl text-blue-600"
                >
                  ▼
                </motion.div>
              </button>

              {/* ✅ NEW: Animated Collapsible Permissions Grid */}
              <AnimatePresence initial={false}>
                {expandedUserId === user._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 mb-4">
                      {(['createOrder', 'newOrders', 'sa', 'sb', 'sc', 'packaging', 'dispatched', 'complaints'] as const).map((section) => (
                        <div key={section} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <span className="text-sm font-medium text-gray-700">{sectionLabels[section]}</span>
                          {editingUser?._id === user._id ? (
                            <select
                              value={editingUser.permissions[section]}
                              onChange={(e) => setEditingUser({
                                ...editingUser,
                                permissions: { ...editingUser.permissions, [section]: e.target.value as Permission }
                              })}
                              className="px-3 py-1.5 rounded-lg border border-gray-300 focus:border-[#1B5FA6] focus:ring-2 text-xs font-semibold"
                              aria-label={`Permission for ${sectionLabels[section]}`}
                            >
                              <option value="no_access">No Access</option>
                              <option value="read_only">Read Only</option>
                              <option value="read_write">Read/Write</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
                              user.permissions[section] === 'read_write' ? 'bg-green-100 text-green-800' :
                              user.permissions[section] === 'read_only' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                              {user.permissions[section]?.toUpperCase().replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              {editingUser?._id === user._id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => updatePermissions(user._id, editingUser.permissions)}
                    className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 font-bold text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="flex-1 px-4 py-2.5 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-bold text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingUser(user);
                    setExpandedUserId(user._id); // Automatically expand when editing
                  }}
                  className="w-full px-4 py-2.5 bg-[#1B5FA6] text-white rounded-xl hover:bg-[#F15A29] font-bold transition-all text-sm"
                >
                  Edit Permissions
                </button>

              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
    </div>
  );
}
