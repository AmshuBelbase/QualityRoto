'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getToken } from '@/lib/jwt';

type Permission = 'read_only' | 'read_write' | 'no_access';

type Complaint = {
  _id: string;
  orderId: { _id: string; customerName: string };
  section: string;
  description: string;
  status: 'open' | 'resolved';
  createdBy: { fullName: string; email: string };
  createdAt: string;
  resolvedBy?: { fullName: string };
  resolvedAt?: string;
};

export default function ComplaintsSection({ permission }: { permission: Permission }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState<'open' | 'resolved' | 'all'>('open');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    orderId: '',
    section: 'newOrders',
    description: ''
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const token = getToken();
    const res = await fetch('/api/complaints', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setComplaints(data);
    setLoading(false);
  };

  const handleResolve = async (complaintId: string) => {
    const token = getToken();
    await fetch('/api/complaints', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ complaintId, status: 'resolved' })
    });
    fetchComplaints();
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    await fetch('/api/complaints', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newComplaint)
    });
    setShowCreateForm(false);
    setNewComplaint({ orderId: '', section: 'newOrders', description: '' });
    fetchComplaints();
  };

  const filteredComplaints = complaints.filter(c => {
    if (filter === 'open') return c.status === 'open';
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  if (loading) return <div className="text-center py-12">Loading complaints...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">⚠️ Complaints & Issues</h2>
          <p className="text-gray-600 mt-2">Report and manage order-related problems</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-6 py-3 rounded-2xl font-bold text-lg ${
            permission === 'read_write' 
              ? 'bg-green-100 text-green-800 border-2 border-green-300' 
              : 'bg-blue-100 text-blue-800 border-2 border-blue-300'
          }`}>
            {permission.replace('_', ' ').toUpperCase()}
          </div>
          {permission === 'read_write' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-lg"
            >
              + Raise Complaint
            </motion.button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500">
          <div className="text-3xl font-bold text-red-600">
            {complaints.filter(c => c.status === 'open').length}
          </div>
          <div className="text-gray-600 font-medium">Open Complaints</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-600">
            {complaints.filter(c => c.status === 'resolved').length}
          </div>
          <div className="text-gray-600 font-medium">Resolved</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-gray-500">
          <div className="text-3xl font-bold text-gray-600">
            {complaints.length}
          </div>
          <div className="text-gray-600 font-medium">Total Complaints</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {['open', 'resolved', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === f 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Create Complaint Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-red-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Raise New Complaint</h3>
          <form onSubmit={handleCreateComplaint} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Order ID</label>
              <input
                type="text"
                required
                value={newComplaint.orderId}
                onChange={(e) => setNewComplaint({ ...newComplaint, orderId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 text-black"
                placeholder="Enter order ID"
              />
            </div>
            <div>
              <label htmlFor="complaint-section" className="block text-sm font-semibold text-gray-700 mb-2">
                Section
                </label>
              <select
                id="complaint-section"
                value={newComplaint.section}
                onChange={(e) => setNewComplaint({ ...newComplaint, section: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 text-black"
                >
                <option value="newOrders">New Orders</option>
                <option value="sa">Section A</option>
                <option value="sb">Section B</option>
                <option value="sc">Section C</option>
                <option value="packaging">Packaging</option>
                <option value="dispatched">Dispatched</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                required
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 text-black"
                placeholder="Describe the issue..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg"
              >
                Submit Complaint
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Complaints List */}
      <div className="grid gap-6">
        {filteredComplaints.map(complaint => (
          <motion.div
            key={complaint._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl shadow-xl p-6 border-2 ${
              complaint.status === 'open' ? 'border-red-300 bg-red-50/30' : 'border-green-300 bg-green-50/30'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Order: {complaint.orderId?.customerName || 'N/A'}
                </h3>
                <p className="text-sm text-gray-600">Section: <span className="font-semibold">{complaint.section.toUpperCase()}</span></p>
                <p className="text-sm text-gray-500">Raised by: {complaint.createdBy.fullName}</p>
                {complaint.resolvedBy && (
                  <p className="text-sm text-green-600 font-medium mt-1">
                    ✅ Resolved by: {complaint.resolvedBy.fullName}
                  </p>
                )}
              </div>
              <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                complaint.status === 'open' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {complaint.status.toUpperCase()}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-gray-800">{complaint.description}</p>
            </div>

            <div className="text-xs text-gray-500">
              Raised: {new Date(complaint.createdAt).toLocaleString()}
            </div>

            {permission === 'read_write' && complaint.status === 'open' && (
              <button
                onClick={() => handleResolve(complaint._id)}
                className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                ✅ Mark as Resolved
              </button>
            )}
          </motion.div>
        ))}

        {filteredComplaints.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-xl text-gray-600 font-medium">No {filter} complaints</p>
          </div>
        )}
      </div>
    </div>
  );
}
