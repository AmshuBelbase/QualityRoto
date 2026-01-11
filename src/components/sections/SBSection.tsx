'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  sbProcessedBy?: { fullName: string };
  sbProcessedAt?: string;
};

export default function SBSection({ permission }: { permission: Permission }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'pending' | 'done' | 'failed' | 'all'>('pending');
  const [loading, setLoading] = useState(true);

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
      body: JSON.stringify({ orderId, status: 'SC_PENDING', section: 'sb' })
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
      body: JSON.stringify({ orderId, status: 'SB_FAILED', section: 'sb' })
    });
    fetchOrders();
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'pending') return order.status === 'SB_PENDING';
    if (filter === 'done') return order.status === 'SB_DONE' || order.status.includes('SC_') || order.status.includes('PACKAGING') || order.status.includes('DISPATCH');
    if (filter === 'failed') return order.status === 'SB_FAILED';
    return order.status.includes('SB_') || order.status.includes('SC_') || order.status.includes('PACKAGING') || order.status.includes('DISPATCH');
  });

  if (loading) return <div className="text-center py-12">Loading Section B orders...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">🔧 Section B Processing</h2>
          <p className="text-gray-600 mt-2">Process orders from Section A</p>
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
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-600">
            {orders.filter(o => o.status === 'SB_PENDING').length}
          </div>
          <div className="text-gray-600 font-medium">Pending</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-emerald-500">
          <div className="text-3xl font-bold text-emerald-600">
            {orders.filter(o => o.status === 'SB_DONE' || o.status.includes('SC_') || o.status.includes('PACKAGING') || o.status.includes('DISPATCH')).length}
          </div>
          <div className="text-gray-600 font-medium">Completed</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500">
          <div className="text-3xl font-bold text-red-600">
            {orders.filter(o => o.status === 'SB_FAILED').length}
          </div>
          <div className="text-gray-600 font-medium">Failed</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="text-3xl font-bold text-blue-600">
            {orders.filter(o => o.status.includes('SB_') || o.status.includes('SC_') || o.status.includes('PACKAGING') || o.status.includes('DISPATCH')).length}
          </div>
          <div className="text-gray-600 font-medium">Total SB Orders</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {['pending', 'done', 'failed', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === f 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid gap-6">
        {filteredOrders.map(order => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl shadow-xl p-6 border-2 ${
              order.status === 'SB_PENDING' ? 'border-green-300 bg-green-50/30' :
              order.status === 'SB_FAILED' ? 'border-red-300 bg-red-50/30' :
              'border-emerald-300 bg-emerald-50/30'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{order.customerName}</h3>
                <p className="text-gray-600">📞 {order.customerPhone}</p>
                <p className="text-sm text-gray-500">Ordered by: {order.createdBy.fullName}</p>
                {order.sbProcessedBy && (
                  <p className="text-sm text-green-600 font-medium mt-1">
                    ✅ Processed by: {order.sbProcessedBy.fullName}
                  </p>
                )}
              </div>
              <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                order.status === 'SB_PENDING' ? 'bg-green-500 text-white' :
                order.status === 'SB_FAILED' ? 'bg-red-500 text-white' :
                'bg-emerald-500 text-white'
              }`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              <h4 className="font-semibold text-gray-700">Order Items:</h4>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between bg-white rounded-lg p-3 border border-gray-200">
                  <div>
                    <span className="font-semibold text-green-600">Type {item.itemType}</span>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-700">Qty: <span className="font-bold">{item.quantity}</span></div>
                    <div className="font-bold text-[#F15A29]">₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            {permission === 'read_write' && order.status === 'SB_PENDING' && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleMarkDone(order._id)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  ✅ Mark as Done
                </button>
                <button
                  onClick={() => handleMarkFailed(order._id)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  ❌ Mark as Failed
                </button>
              </div>
            )}

            {permission === 'read_only' && (
              <div className="mt-4 text-center text-sm text-gray-500 font-medium">
                🔒 Read-only access - Actions disabled
              </div>
            )}
          </motion.div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600 font-medium">No {filter} orders in Section B</p>
          </div>
        )}
      </div>
    </div>
  );
}
