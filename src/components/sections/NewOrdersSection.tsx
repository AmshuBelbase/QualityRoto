'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

  const filteredOrders = orders.filter(order => {
    if (filter === 'new') return order.status === 'NEW';
    if (filter === 'accepted') return order.status === 'ACCEPTED' || order.status.includes('PENDING') || order.status.includes('DONE');
    if (filter === 'rejected') return order.status === 'REJECTED';
    return true;
  });

  // Sort: NEW orders first, then by creation date
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (a.status === 'NEW' && b.status !== 'NEW') return -1;
    if (a.status !== 'NEW' && b.status === 'NEW') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">📋 New Orders - Review</h2>
          <p className="text-gray-600 mt-2">Accept or reject incoming orders</p>
        </div>
        <div className={`px-6 py-3 rounded-2xl font-bold text-lg ${
          permission === 'read_write' 
            ? 'bg-green-100 text-green-800 border-2 border-green-300' 
            : 'bg-blue-100 text-blue-800 border-2 border-blue-300'
        }`}>
          {permission.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="text-3xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'NEW').length}
          </div>
          <div className="text-gray-600 font-medium">New Orders</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-600">
            {orders.filter(o => o.status === 'ACCEPTED' || o.status.includes('PENDING') || o.status.includes('DONE')).length}
          </div>
          <div className="text-gray-600 font-medium">Accepted</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500">
          <div className="text-3xl font-bold text-red-600">
            {orders.filter(o => o.status === 'REJECTED').length}
          </div>
          <div className="text-gray-600 font-medium">Rejected</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-gray-500">
          <div className="text-3xl font-bold text-gray-600">
            {orders.length}
          </div>
          <div className="text-gray-600 font-medium">Total Orders</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {['new', 'accepted', 'rejected', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
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

      {/* Orders List */}
      <div className="grid gap-6">
        {sortedOrders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl shadow-xl p-6 border-2 ${
              order.status === 'NEW' ? 'border-blue-300 bg-blue-50/30' :
              order.status === 'REJECTED' ? 'border-red-300 bg-red-50/30' :
              'border-green-300 bg-green-50/30'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
  <div>
    <h3 className="text-xl font-bold text-gray-900">{order.customerName}</h3>
    <p className="text-gray-600">📞 {order.customerPhone}</p>
    <p className="text-sm text-gray-500">
      Created by: {order.createdBy?.fullName || 'Unknown User'}
    </p>
    <p className="text-xs text-gray-400">
      {new Date(order.createdAt).toLocaleString('en-IN', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      })}
    </p>
    {order.reviewedBy && (
      <p className="text-sm text-green-600 font-medium mt-1">
        ✅ Reviewed by: {order.reviewedBy.fullName}
      </p>
    )}
  </div>
  <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
    order.status === 'NEW' ? 'bg-blue-500 text-white' :
    order.status === 'ACCEPTED' || order.status.includes('PENDING') || order.status.includes('DONE') ? 'bg-green-500 text-white' :
    'bg-red-500 text-white'
  }`}>
    {order.status.replace(/_/g, ' ')}
  </span>
</div>


            {/* Items */}
            <div className="space-y-2 mb-4">
              <h4 className="font-semibold text-gray-700">Order Items:</h4>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#1B5FA6]">Type {item.itemType}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Qty: {item.quantity}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    {item.photoPath && (
                      <p className="text-xs text-gray-500 mt-1">📷 Photo: {item.photoPath}</p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-bold text-[#F15A29] text-lg">₹{item.price}</div>
                    <div className="text-xs text-gray-500">per unit</div>
                  </div>
                </div>
              ))}
              
              {/* Total */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 border-2 border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Order Total:</span>
                  <span className="font-bold text-[#F15A29] text-xl">
                    ₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {permission === 'read_write' && order.status === 'NEW' && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleAccept(order._id)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  ✅ Accept Order
                </button>
                <button
                  onClick={() => handleReject(order._id)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  ❌ Reject Order
                </button>
              </div>
            )}

            {permission === 'read_only' && (
              <div className="mt-4 text-center text-sm text-gray-500 font-medium bg-gray-50 py-3 rounded-xl">
                🔒 Read-only access - You can view orders but cannot accept or reject them
              </div>
            )}
          </motion.div>
        ))}

        {sortedOrders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600 font-medium">
              No {filter} orders found
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {filter === 'new' && 'New orders will appear here once created'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
