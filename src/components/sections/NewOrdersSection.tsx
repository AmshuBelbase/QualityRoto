'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getToken } from '@/lib/jwt';

type Permission = 'read_only' | 'read_write' | 'no_access';

type Order = {
  _id: string;
  customerName: string;
  customerPhone: string;
  items: { itemType: string; quantity: number; price: number; description: string; photoPath?: string }[];
  status: string;
  createdAt: string;
  createdBy: { fullName: string; email: string };
  reviewedBy?: { fullName: string };
  reviewedAt?: string;
};

export default function NewOrdersSection({ permission }: { permission: Permission }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'new' | 'accepted' | 'rejected' | 'all'>('new');
  const [loading, setLoading] = useState(true);

  const [showComplaintForm, setShowComplaintForm] = useState<string | null>(null);
  const [complaintDescription, setComplaintDescription] = useState('');
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = getToken();
    if (!token) {
      alert('Please login first');
      window.location.href = '/internal/login';
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) {
        alert('Session expired. Please login again.');
        window.location.href = '/internal/login';
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (orderId: string) => {
    if (!confirm('Accept this order and move to Section A?')) return;

    const token = getToken();
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, status: 'SA_PENDING', section: 'review' })
      });

      if (res.ok) {
        alert('✅ Order accepted and moved to Section A');
        fetchOrders();
      } else {
        alert('❌ Failed to accept order');
      }
    } catch (error) {
      alert('❌ Network error');
    }
  };

  const handleReject = async (orderId: string) => {
    if (!confirm('Reject this order? This action cannot be undone.')) return;

    const token = getToken();
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, status: 'REJECTED', section: 'review' })
      });

      if (res.ok) {
        alert('✅ Order rejected');
        fetchOrders();
      } else {
        alert('❌ Failed to reject order');
      }
    } catch (error) {
      alert('❌ Network error');
    }
  };

  const handleRaiseComplaint = async (orderId: string) => {
    if (!complaintDescription.trim()) {
      alert('Please enter complaint description');
      return;
    }

    setSubmittingComplaint(true);
    const token = getToken();
    
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          section: 'newOrders',
          description: complaintDescription
        })
      });

      if (res.ok) {
        alert('✅ Complaint raised successfully!');
        setShowComplaintForm(null);
        setComplaintDescription('');
      } else {
        alert('❌ Failed to raise complaint');
      }
    } catch (error) {
      alert('❌ Network error');
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'new') return order.status === 'NEW';
    if (filter === 'accepted') return order.status === 'ACCEPTED' || order.status.includes('PENDING') || order.status.includes('DONE');
    if (filter === 'rejected') return order.status === 'REJECTED';
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (a.status === 'NEW' && b.status !== 'NEW') return -1;
    if (a.status !== 'NEW' && b.status === 'NEW') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 md:py-32 px-4">
        <div className="text-center">
          <div className="text-4xl md:text-6xl mb-4">⏳</div>
          <p className="text-base md:text-xl text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">📋 New Orders - Review</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Accept or reject incoming orders</p>
        </div>
        {/* <div className={`px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg text-center ${
          permission === 'read_write' 
            ? 'bg-green-100 text-green-800 border-2 border-green-300' 
            : 'bg-blue-100 text-blue-800 border-2 border-blue-300'
        }`}>
          {permission.replace('_', ' ').toUpperCase()}
        </div> */}
      </div>

      {/* Stats - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-blue-500">
          <div className="text-2xl md:text-3xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'NEW').length}
          </div>
          <div className="text-xs md:text-base text-gray-600 font-medium">New Orders</div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-green-500">
          <div className="text-2xl md:text-3xl font-bold text-green-600">
            {orders.filter(o => o.status === 'ACCEPTED' || o.status.includes('PENDING') || o.status.includes('DONE')).length}
          </div>
          <div className="text-xs md:text-base text-gray-600 font-medium">Accepted</div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-red-500">
          <div className="text-2xl md:text-3xl font-bold text-red-600">
            {orders.filter(o => o.status === 'REJECTED').length}
          </div>
          <div className="text-xs md:text-base text-gray-600 font-medium">Rejected</div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-gray-500 col-span-1 lg:col-span-1">
          <div className="text-2xl md:text-3xl font-bold text-gray-600">
            {orders.length}
          </div>
          <div className="text-xs md:text-base text-gray-600 font-medium">Total Orders</div>
        </div>
      </div>

      {/* Filters - Mobile Responsive */}
      <div className="flex flex-row sm:flex-row gap-2 md:gap-4 overflow-x-auto pb-2">
        {['new', 'accepted', 'rejected', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all whitespace-nowrap ${
              filter === f 
                ? 'bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] text-white shadow-lg' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({
              f === 'new' ? orders.filter(o => o.status === 'NEW').length :
              f === 'accepted' ? orders.filter(o => o.status !== 'NEW' && o.status !== 'REJECTED').length :
              f === 'rejected' ? orders.filter(o => o.status === 'REJECTED').length :
              orders.length
            })
          </button>
        ))}
      </div>

      {/* Orders List - Mobile Responsive */}
      <div className="grid gap-4 md:gap-6">
        {sortedOrders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 border-2 ${
              order.status === 'NEW' ? 'border-blue-300 bg-blue-50/30' :
              order.status === 'REJECTED' ? 'border-red-300 bg-red-50/30' :
              'border-green-300 bg-green-50/30'
            }`}
          >
            {/* Header with Order ID - Compact Single Line */}
            <div className="flex items-start justify-between gap-2 mb-3 md:mb-4 overflow-x-auto pb-1">
              <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
                <div className="bg-gray-100 px-2 md:px-4 py-1.5 md:py-2 rounded-lg border-2 border-gray-300 flex-shrink-0">
                  <div className="text-[10px] md:text-xs text-gray-500 font-medium">Order ID</div>
                  <div className="font-mono font-bold text-xs md:text-base text-gray-900 whitespace-nowrap">
                    #{order._id.slice(-8).toUpperCase()}
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm md:text-xl font-bold text-gray-900 truncate">
                    {order.customerName}
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-400 truncate">
                    Created: {new Date(order.createdAt).toLocaleString('en-IN', { 
                      dateStyle: 'short', 
                      timeStyle: 'short' 
                    })}
                  </p>
                  {order.reviewedBy && (
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium truncate">
                      Reviewed by: {order.reviewedBy.fullName}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                <span className={`px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-bold text-[10px] md:text-sm whitespace-nowrap ${
                  order.status === 'NEW' ? 'bg-blue-500 text-white' :
                  order.status === 'ACCEPTED' || order.status.includes('PENDING') || order.status.includes('DONE') ? 'bg-green-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {order.status.replace(/_/g, ' ')}
                </span>

                {/* Raise Complaint Button */}
                {permission !== 'read_only' && showComplaintForm !== order._id && (
                  <button
                    onClick={() => setShowComplaintForm(order._id)}
                    className="px-2 md:px-4 py-1 md:py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg md:rounded-xl border-2 border-yellow-300 transition-all font-bold text-[10px] md:text-sm whitespace-nowrap"
                  >
                    ⚠️ Raise Complaint
                  </button>
                )}
              </div>
            </div>

            {/* Items - Mobile Responsive */}
            <div className="space-y-2 mb-3 md:mb-4">
              <h4 className="font-semibold text-sm md:text-base text-gray-700">Order Items:</h4>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:justify-between gap-2 bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm md:text-base text-[#1B5FA6]">Type {item.itemType}</span>
                      <span className="text-[10px] md:text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">Qty: {item.quantity}</span>
                    </div>
                    <p className="text-gray-600 text-xs md:text-sm mt-1 break-words">{item.description}</p>
                    {item.photoPath && (
                      <p className="text-[10px] md:text-xs text-gray-500 mt-1 truncate">📷 Photo: {item.photoPath}</p>
                    )}
                  </div>
                  <div className="flex sm:flex-col justify-between sm:text-right sm:ml-4 gap-2">
                    <div className="font-bold text-sm md:text-lg text-[#F15A29]">₹{item.price}</div>
                    <div className="text-[10px] md:text-xs text-gray-500">per unit</div>
                  </div>
                </div>
              ))}
              
              {/* Total - Mobile Responsive */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 border-2 border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm md:text-base text-gray-900">Order Total:</span>
                  <span className="font-bold text-base md:text-xl text-[#F15A29]">
                    ₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Complaint Form - Mobile Responsive */}
            <AnimatePresence>
              {showComplaintForm === order._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3 md:mb-4 bg-red-50 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-red-200"
                >
                  <h4 className="font-bold text-sm md:text-base text-gray-900 mb-2">
                    ⚠️ Raise Complaint for Order #{order._id.slice(-8).toUpperCase()}
                  </h4>
                  <textarea
                    value={complaintDescription}
                    onChange={(e) => setComplaintDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border-2 border-gray-200 focus:border-red-500 text-black text-sm md:text-base mb-3"
                    placeholder="Describe the issue with this order..."
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleRaiseComplaint(order._id)}
                      disabled={submittingComplaint}
                      className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-bold text-sm md:text-base hover:bg-red-600 disabled:opacity-50"
                    >
                      {submittingComplaint ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                    <button
                      onClick={() => {
                        setShowComplaintForm(null);
                        setComplaintDescription('');
                      }}
                      className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-bold text-sm md:text-base hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions - Mobile Responsive */}
            {permission === 'read_write' && order.status === 'NEW' && (
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-3 md:pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleAccept(order._id)}
                  className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base hover:shadow-lg transition-all"
                >
                  ✅ Accept Order
                </button>
                <button
                  onClick={() => handleReject(order._id)}
                  className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base hover:shadow-lg transition-all"
                >
                  ❌ Reject Order
                </button>
              </div>
            )}

            {permission === 'read_only' && (
              <div className="mt-3 md:mt-4 text-center text-xs md:text-sm text-gray-500 font-medium bg-gray-50 py-2.5 md:py-3 rounded-lg md:rounded-xl">
                🔒 Read-only access - You can view orders but cannot accept or reject them
              </div>
            )}
          </motion.div>
        ))}

        {sortedOrders.length === 0 && (
          <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-lg px-4">
            <div className="text-4xl md:text-6xl mb-4">📭</div>
            <p className="text-lg md:text-xl text-gray-600 font-medium">
              No {filter} orders found
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              {filter === 'new' && 'New orders will appear here once created'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
