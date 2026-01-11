'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  const [infoExpanded, setInfoExpanded] = useState(false);

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
    if (!confirm('Mark this complaint as resolved?')) return;

    const token = getToken();
    try {
      const res = await fetch('/api/complaints', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ complaintId, status: 'resolved' })
      });

      if (res.ok) {
        alert('✅ Complaint resolved successfully');
        fetchComplaints();
      } else {
        alert('❌ Failed to resolve complaint');
      }
    } catch (error) {
      alert('❌ Network error');
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (filter === 'open') return c.status === 'open';
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 md:py-32 px-4">
        <div className="text-center">
          <div className="text-4xl md:text-6xl mb-4">⏳</div>
          <p className="text-base md:text-xl text-gray-600 font-medium">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">⚠️ Complaints & Issues</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Manage and resolve order-related problems</p>
        </div>
        {/* <div className={`px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg text-center ${
          permission === 'read_write' 
            ? 'bg-green-100 text-green-800 border-2 border-green-300' 
            : 'bg-blue-100 text-blue-800 border-2 border-blue-300'
        }`}>
          {permission.replace('_', ' ').toUpperCase()}
        </div> */}
      </div>

      {/* Info Card - Mobile Responsive with Expand/Collapse */}
<div className="bg-gradient-to-r from-yellow-50 to-red-50 rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-yellow-200">
  <button
    onClick={() => setInfoExpanded(!infoExpanded)}
    className="w-full flex items-start gap-3 md:gap-4 text-left hover:opacity-80 transition-opacity"
  >
    <div className="text-2xl md:text-4xl flex-shrink-0">💡</div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-bold text-gray-900">How to Raise Complaints</h3>
        <motion.div
          animate={{ rotate: infoExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl md:text-2xl text-yellow-600 flex-shrink-0 ml-2"
        >
          ▼
        </motion.div>
      </div>
      
      <AnimatePresence initial={false}>
        {infoExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-xs md:text-sm text-gray-700 mt-1 md:mt-2">
              Complaints can be raised directly from any order in other sections (New Orders, Section A/B/C, Packaging, Dispatched). 
              </p><p className="text-xs md:text-sm text-gray-700 mt-1 md:mt-2">Look for the <span className="font-bold text-yellow-700">"⚠️ Raise Complaint"</span> button on each order card.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </button>
</div>


      {/* Stats - Mobile Responsive Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-red-500">
          <div className="text-2xl md:text-3xl font-bold text-red-600">
            {complaints.filter(c => c.status === 'open').length}
          </div>
          <div className="text-sm md:text-base text-gray-600 font-medium">Open</div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-green-500">
          <div className="text-2xl md:text-3xl font-bold text-green-600">
            {complaints.filter(c => c.status === 'resolved').length}
          </div>
          <div className="text-sm md:text-base text-gray-600 font-medium">Resolved</div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-gray-500">
          <div className="text-2xl md:text-3xl font-bold text-gray-600">
            {complaints.length}
          </div>
          <div className="text-sm md:text-base text-gray-600 font-medium">Total</div>
        </div>
      </div>

      {/* Filters - Mobile Responsive */}
      <div className="flex flex-row sm:flex-row gap-3 md:gap-4">
        {['open', 'resolved', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all ${
              filter === f 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({
              f === 'open' ? complaints.filter(c => c.status === 'open').length :
              f === 'resolved' ? complaints.filter(c => c.status === 'resolved').length :
              complaints.length
            })
          </button>
        ))}
      </div>

      {/* Complaints List - Mobile Responsive */}
      <div className="grid gap-4 md:gap-6">
        {filteredComplaints.map(complaint => (
          <motion.div
            key={complaint._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 border-2 ${
              complaint.status === 'open' ? 'border-red-300 bg-red-50/30' : 'border-green-300 bg-green-50/30'
            }`}
          >
          {/* Header with Order ID - Compact Single Line */}
          <div className="flex items-start justify-between gap-2 mb-3 md:mb-4 overflow-x-auto pb-1">
            <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
              <div className="bg-gray-100 px-2 md:px-4 py-1.5 md:py-2 rounded-lg border-2 border-gray-300 flex-shrink-0">
                <div className="text-[10px] md:text-xs text-gray-500 font-medium">Order ID</div>
                <div className="font-mono font-bold text-xs md:text-base text-gray-900 whitespace-nowrap">
                  #{complaint.orderId?._id?.slice(-8).toUpperCase() || 'N/A'}
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm md:text-xl font-bold text-gray-900 truncate">
                  {complaint.orderId?.customerName || 'Unknown Customer'}
                </h3>
                <p className="text-[10px] md:text-sm text-gray-600 truncate">
                  Section: <span className="font-semibold uppercase">{complaint.section.replace(/_/g, ' ')}</span>
                </p>
              </div>
            </div>
            
            <span className={`px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-bold text-[10px] md:text-sm flex-shrink-0 ${
              complaint.status === 'open' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}>
              {complaint.status.toUpperCase()}
            </span>
          </div>



            {/* User Info - Mobile Responsive */}
            <div className="mb-3 md:mb-4">
              <p className="text-xs md:text-sm text-gray-500">Raised by: {complaint.createdBy?.fullName || 'Unknown User'}</p>
              <p className="text-[10px] md:text-xs text-gray-400">
                {new Date(complaint.createdAt).toLocaleString('en-IN', { 
                  dateStyle: 'medium', 
                  timeStyle: 'short' 
                })}
              </p>
              {complaint.resolvedBy && (
                <p className="text-xs md:text-sm text-green-600 font-medium mt-1">
                  ✅ Resolved by: {complaint.resolvedBy.fullName}
                  {complaint.resolvedAt && ` on ${new Date(complaint.resolvedAt).toLocaleString('en-IN', { 
                    dateStyle: 'medium', 
                    timeStyle: 'short' 
                  })}`}
                </p>
              )}
            </div>

            {/* Description - Mobile Responsive */}
            <div className="bg-gray-50 rounded-lg md:rounded-xl p-3 md:p-4 mb-3 md:mb-4 border border-gray-200">
              <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-2">Issue Description:</h4>
              <p className="text-sm md:text-base text-gray-800 break-words">{complaint.description}</p>
            </div>

            {/* Actions - Mobile Responsive */}
            {permission === 'read_write' && complaint.status === 'open' && (
              <button
                onClick={() => handleResolve(complaint._id)}
                className="w-full px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg md:rounded-xl text-sm md:text-base font-bold hover:shadow-lg transition-all"
              >
                ✅ Mark as Resolved
              </button>
            )}

            {permission === 'read_only' && complaint.status === 'open' && (
              <div className="text-center text-xs md:text-sm text-gray-500 font-medium bg-gray-50 py-2.5 md:py-3 rounded-lg md:rounded-xl">
                🔒 Read-only access - Cannot resolve complaints
              </div>
            )}
          </motion.div>
        ))}

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-lg px-4">
            <div className="text-4xl md:text-6xl mb-4">
              {filter === 'open' ? '🎉' : '📭'}
            </div>
            <p className="text-lg md:text-xl text-gray-600 font-medium">
              No {filter} complaints
            </p>
            {filter === 'open' && (
              <p className="text-xs md:text-sm text-gray-500 mt-2">
                All issues have been resolved! Great work!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
