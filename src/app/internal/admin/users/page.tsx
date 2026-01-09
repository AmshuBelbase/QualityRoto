'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

type User = {
  _id: string;
  email: string;
  fullName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  role: 'ADMIN' | 'STAFF';
  permissions: Permissions;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
    setLoading(false);
  };

  const updatePermissions = async (userId: string, permissions: Permissions) => {
    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, permissions }),
    });
    
    if (res.ok) {
      fetchUsers();
      setEditingUser(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading users...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] bg-clip-text text-transparent mb-4">
            Staff Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage access permissions for all staff members across order workflow sections
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="text-3xl font-bold text-[#1B5FA6]"> {users.length} </div>
            <div className="text-gray-600">Total Staff</div>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="text-3xl font-bold text-green-600">{users.filter(u => u.role === 'ADMIN').length}</div>
            <div className="text-gray-600">Admins</div>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="text-3xl font-bold text-blue-600">{users.filter(u => u.role === 'STAFF').length}</div>
            <div className="text-gray-600">Staff</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] text-white">
                <tr>
                  <th className="p-6 text-left font-bold text-lg">Staff Info</th>
                  <th className="p-6 text-center font-bold text-lg">New Orders</th>
                  <th className="p-6 text-center font-bold text-lg">SA</th>
                  <th className="p-6 text-center font-bold text-lg">SB</th>
                  <th className="p-6 text-center font-bold text-lg">SC</th>
                  <th className="p-6 text-center font-bold text-lg">Packaging</th>
                  <th className="p-6 text-center font-bold text-lg">Dispatched</th>
                  <th className="p-6 text-center font-bold text-lg">Complaints</th>
                  <th className="p-6 text-center font-bold text-lg">Actions</th>
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
                    <td className="p-6 font-semibold">
                      <div>
                        <div className="font-bold text-lg text-gray-900">{user.fullName}</div>
                        <div className="text-blue-600">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phoneCountryCode}{user.phoneNumber}</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    
                    {(['newOrders', 'sa', 'sb', 'sc', 'packaging', 'dispatched', 'complaints'] as const).map((section) => (
                        <td key={section} className="p-6 text-center">
                            {editingUser?._id === user._id ? (
                            <select
                                value={editingUser.permissions[section]}
                                onChange={(e) => setEditingUser({
                                ...editingUser,
                                permissions: { ...editingUser.permissions, [section]: e.target.value as Permission }
                                })}
                                className="px-3 py-2 rounded-xl border border-gray-300 focus:border-[#1B5FA6] focus:ring-2"
                                aria-label={`Permission for ${section === 'newOrders' ? 'New Orders' : 
                                            section.toUpperCase().replace('SA', 'Section A').replace('SB', 'Section B').replace('SC', 'Section C')}`}
                            >
                                <option value="no_access">No Access</option>
                                <option value="read_only">Read Only</option>
                                <option value="read_write">Read/Write</option>
                            </select>
                            ) : (
                            <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                                user.permissions[section] === 'read_write' ? 'bg-green-100 text-green-800' :
                                user.permissions[section] === 'read_only' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-500'
                            }`}>
                                {user.permissions[section]?.toUpperCase().replace('_', ' ')}
                            </span>
                            )}
                        </td>
                        ))}

                    
                    <td className="p-6 text-center">
                      {editingUser?._id === user._id ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => updatePermissions(user._id, editingUser.permissions)}
                            className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingUser(user)}
                          className="px-6 py-2 bg-[#1B5FA6] text-white rounded-xl hover:bg-[#F15A29] font-bold transition-all"
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
      </motion.div>
    </div>
  );
}
