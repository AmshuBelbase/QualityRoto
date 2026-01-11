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
  dispatchedBy?: { fullName: string };
  dispatchedAt?: string;
};

export default function DispatchedSection({ permission }: { permission: Permission }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'yet' | 'reached' | 'failed' | 'could_not' | 'all'>('yet');
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

  const handleDispatch = async (orderId: string, status: string) => {
    const token = getToken();
    await fetch('/api/orders', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderId, status, section: 'dispatch' })
    });
    fetchOrders();
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'yet') return order.status === 'DISPATCH_YET';
    if (filter === 'reached') return order.status === 'DISPATCH_REACHED';
    if (filter === 'failed') return order.status === 'DISPATCH_FAILED';
    if (filter === 'could_not') return order.status === 'DISPATCH_COULD_NOT';
    return order.status.includes('DISPATCH');
  });

  if (loading) return <div className="text-center py-12">Loading Dispatch orders...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">🚚 Dispatch & Delivery</h2>
          <p className="text-gray-600 mt-2">Manage order dispatch and delivery status</p>
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
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-indigo-500">
          <div className="text-3xl font-bold text-indigo-600">
            {orders.filter(o => o.status === 'DISPATCH_YET').length}
          </div>
          <div className="text-gray-600 font-medium">Yet to Dispatch</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="text-3xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'DISPATCH_REACHED').length}
          </div>
          <div className="text-gray-600 font-medium">Delivered</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500">
          <div className="text-3xl font-bold text-red-600">
            {orders.filter(o => o.status === 'DISPATCH_FAILED').length}
          </div>
          <div className="text-gray-600 font-medium">Failed</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
          <div className="text-3xl font-bold text-orange-600">
            {orders.filter(o => o.status === 'DISPATCH_COULD_NOT').length}
          </div>
          <div className="text-gray-600 font-medium">Could Not Dispatch</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-gray-500">
          <div className="text-3xl font-bold text-gray-600">
            {orders.filter(o => o.status.includes('DISPATCH')).length}
          </div>
          <div className="text-gray-600 font-medium">Total Orders</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        {[
          { key: 'yet', label: 'Yet to Dispatch' },
          { key: 'reached', label: 'Delivered' },
          { key: 'failed', label: 'Failed' },
          { key: 'could_not', label: 'Could Not Dispatch' },
          { key: 'all', label: 'All' }
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === f.key
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.label}
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
              order.status === 'DISPATCH_YET' ? 'border-indigo-300 bg-indigo-50/30' :
              order.status === 'DISPATCH_REACHED' ? 'border-green-300 bg-green-50/30' :
              order.status === 'DISPATCH_FAILED' ? 'border-red-300 bg-red-50/30' :
              'border-orange-300 bg-orange-50/30'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{order.customerName}</h3>
                <p className="text-gray-600">📞 {order.customerPhone}</p>
                <p className="text-sm text-gray-500">Ordered by: {order.createdBy.fullName}</p>
                {order.dispatchedBy && (
                  <p className="text-sm text-indigo-600 font-medium mt-1">
                    ✅ Dispatched by: {order.dispatchedBy.fullName}
                  </p>
                )}
              </div>
              <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                order.status === 'DISPATCH_YET' ? 'bg-indigo-500 text-white' :
                order.status === 'DISPATCH_REACHED' ? 'bg-green-500 text-white' :
                order.status === 'DISPATCH_FAILED' ? 'bg-red-500 text-white' :
                'bg-orange-500 text-white'
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
                    <span className="font-semibold text-indigo-600">Type {item.itemType}</span>
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
            {permission === 'read_write' && order.status === 'DISPATCH_YET' && (
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDispatch(order._id, 'DISPATCH_REACHED')}
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm"
                >
                  ✅ Delivered
                </button>
                <button
                  onClick={() => handleDispatch(order._id, 'DISPATCH_FAILED')}
                  className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm"
                >
                  ❌ Failed
                </button>
                <button
                  onClick={() => handleDispatch(order._id, 'DISPATCH_COULD_NOT')}
                  className="px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm"
                >
                  ⚠️ Could Not
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
            <p className="text-xl text-gray-600 font-medium">No {filter.replace('_', ' ')} orders</p>
          </div>
        )}
      </div>
    </div>
  );
}
