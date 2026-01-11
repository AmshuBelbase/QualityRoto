'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getToken } from '@/lib/jwt';

type Permission = 'read_only' | 'read_write' | 'no_access';

type Order = {
  _id: string;
  customerName: string;
  customerPhone: string;
  items: { itemType: string; quantity: number; price: number; description: string }[];
  status: string;
  createdAt: string;
  createdBy: { fullName: string; email: string };
  scProcessedBy?: { fullName: string };
  scProcessedAt?: string;
};

export default function SCSection({ permission }: { permission: Permission }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'pending' | 'done' | 'failed' | 'all'>('pending');
  const [loading, setLoading] = useState(true);

  const [showComplaintForm, setShowComplaintForm] = useState<string | null>(null);
  const [complaintDescription, setComplaintDescription] = useState('');
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = getToken();
    const res = await fetch('/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  const handleMarkDone = async (orderId: string) => {
    const token = getToken();
    await fetch('/api/orders', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderId, status: 'PACKAGING_PENDING', section: 'sc' })
    });
    fetchOrders();
  };

  const handleMarkFailed = async (orderId: string) => {
    const token = getToken();
    await fetch('/api/orders', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderId, status: 'SC_FAILED', section: 'sc' })
    });
    fetchOrders();
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
          section: 'sc',
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
    if (filter === 'pending') return order.status === 'SC_PENDING';
    if (filter === 'done') return order.status === 'SC_DONE' || order.status.includes('PACKAGING') || order.status.includes('DISPATCH');
    if (filter === 'failed') return order.status === 'SC_FAILED';
    return order.status.includes('SC_') || order.status.includes('PACKAGING') || order.status.includes('DISPATCH');
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 md:py-32 px-4">
        <div className="text-center">
          <div className="text-4xl md:text-6xl mb-4">⏳</div>
          <p className="text-base md:text-xl text-gray-600 font-medium">Loading Section C orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">🔩 Section C Processing</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Process orders from Section B</p>
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
            {orders.filter(o => o.status === 'SC_PENDING').length}
          </div>
          <div className="text-xs md:text-base text-gray-600 font-medium">Pending</div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-cyan-500">
          <div className="text-2xl md:text-3xl font-bold text-cyan-600">
            {orders.filter(o => o.status === 'SC_DONE' || o.status.includes('PACKAGING') || o.status.includes('DISPATCH')).length}
          </div>
          <div className="text-xs md:text-base text-gray-600 font-medium">Completed</div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-red-500">
          <div className="text-2xl md:text-3xl font-bold text-red-600">
            {orders.filter(o => o.status === 'SC_FAILED').length}
          </div>
          <div className="text-xs md:text-base text-gray-600 font-medium">Failed</div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-indigo-500 col-span-1 lg:col-span-1">
          <div className="text-2xl md:text-3xl font-bold text-indigo-600">
            {orders.filter(o => o.status.includes('SC_') || o.status.includes('PACKAGING') || o.status.includes('DISPATCH')).length}
          </div>
          <div className="text-xs md:text-base text-gray-600 font-medium">Total Orders</div>
        </div>
      </div>

      {/* Filters - Mobile Responsive */}
      <div className="flex flex-row sm:flex-row gap-2 md:gap-4">
        {['pending', 'done', 'failed', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all ${
              filter === f 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List - Mobile Responsive */}
      <div className="grid gap-4 md:gap-6">
        {filteredOrders.map(order => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 border-2 ${
              order.status === 'SC_PENDING' ? 'border-blue-300 bg-blue-50/30' :
              order.status === 'SC_FAILED' ? 'border-red-300 bg-red-50/30' :
              'border-cyan-300 bg-cyan-50/30'
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
                  <p className="text-xs md:text-base text-gray-600 truncate">
                    📞 {order.customerPhone}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                <span className={`px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-bold text-[10px] md:text-sm whitespace-nowrap ${
                  order.status === 'SC_PENDING' ? 'bg-blue-500 text-white' :
                  order.status === 'SC_FAILED' ? 'bg-red-500 text-white' :
                  'bg-cyan-500 text-white'
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
                    <span className="font-semibold text-sm md:text-base text-blue-600">Type {item.itemType}</span>
                    <p className="text-gray-600 text-xs md:text-sm break-words">{item.description}</p>
                  </div>
                  <div className="flex sm:flex-col justify-between sm:text-right gap-2">
                    <div className="text-xs md:text-base text-gray-700">Qty: <span className="font-bold">{item.quantity}</span></div>
                    <div className="font-bold text-sm md:text-base text-[#F15A29]">₹{item.price}</div>
                  </div>
                </div>
              ))}
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
            {permission === 'read_write' && order.status === 'SC_PENDING' && (
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-3 md:pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleMarkDone(order._id)}
                  className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base hover:shadow-lg transition-all"
                >
                  ✅ Mark as Done
                </button>
                <button
                  onClick={() => handleMarkFailed(order._id)}
                  className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base hover:shadow-lg transition-all"
                >
                  ❌ Mark as Failed
                </button>
              </div>
            )}

            {permission === 'read_only' && (
              <div className="mt-3 md:mt-4 text-center text-xs md:text-sm text-gray-500 font-medium bg-gray-50 py-2.5 md:py-3 rounded-lg md:rounded-xl">
                🔒 Read-only access - Actions disabled
              </div>
            )}
          </motion.div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-lg px-4">
            <div className="text-4xl md:text-6xl mb-4">📭</div>
            <p className="text-lg md:text-xl text-gray-600 font-medium">
              No {filter} orders in Section C
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
