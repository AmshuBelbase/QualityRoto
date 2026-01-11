'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getToken } from '@/lib/jwt';

type Permission = 'read_only' | 'read_write' | 'no_access';

export default function CreateOrderSection({ permission }: { permission: Permission }) {
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    items: [{ itemType: 'A' as 'A' | 'B' | 'C', quantity: 1, price: 0, description: '', photoPath: '' }]
  });
  const [submitting, setSubmitting] = useState(false);

  const addItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { itemType: 'A', quantity: 1, price: 0, description: '', photoPath: '' }]
    });
  };

  const removeItem = (index: number) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const token = getToken();
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
      });

      if (res.ok) {
        alert('✅ Order created successfully!');
        // Reset form
        setNewOrder({
          customerName: '',
          customerPhone: '',
          items: [{ itemType: 'A', quantity: 1, price: 0, description: '', photoPath: '' }]
        });
      } else {
        alert('❌ Failed to create order');
      }
    } catch (error) {
      alert('❌ Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (permission === 'read_only') {
    return (
      <div className="text-center py-32 bg-white rounded-3xl shadow-xl">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Read-Only Access</h2>
        <p className="text-lg text-gray-600">You can view this section but cannot create orders.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">➕ Create New Order</h2>
          <p className="text-gray-600 mt-2">Enter order details from phone calls</p>
        </div>
        <div className="px-6 py-3 rounded-2xl font-bold text-lg bg-green-100 text-green-800 border-2 border-green-300">
          {permission.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 border-2 border-teal-200">
        <div className="flex items-start gap-4">
          <div className="text-4xl">📞</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Order Entry Instructions</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Take customer details over the phone</li>
              <li>• Enter items (A, B, or C) with quantity, price, and description</li>
              <li>• Add photo path if customer provides reference image</li>
              <li>• Submit order for review by supervisors</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-teal-200"
      >
        <form onSubmit={handleCreateOrder} className="space-y-6">
          {/* Customer Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                id="customerName"
                type="text"
                required
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-black"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Phone *
              </label>
              <input
                id="customerPhone"
                type="tel"
                required
                value={newOrder.customerPhone}
                onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-black"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-900">Order Items</h4>
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-4">
              {newOrder.items.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-teal-50 rounded-xl p-6 border-2 border-teal-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-900 text-lg">Item {index + 1}</span>
                    {newOrder.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-all"
                      >
                        ✖ Remove
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`itemType-${index}`} className="block text-xs font-semibold text-gray-600 mb-1">
                        Item Type *
                      </label>
                      <select
                        id={`itemType-${index}`}
                        value={item.itemType}
                        onChange={(e) => updateItem(index, 'itemType', e.target.value)}
                        className="w-full px-3 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-500 text-black font-semibold"
                        required
                      >
                        <option value="A">Type A</option>
                        <option value="B">Type B</option>
                        <option value="C">Type C</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor={`quantity-${index}`} className="block text-xs font-semibold text-gray-600 mb-1">
                        Quantity *
                      </label>
                      <input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                        className="w-full px-3 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-500 text-black"
                      />
                    </div>

                    <div>
                      <label htmlFor={`price-${index}`} className="block text-xs font-semibold text-gray-600 mb-1">
                        Price (₹) *
                      </label>
                      <input
                        id={`price-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                        className="w-full px-3 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-500 text-black"
                      />
                    </div>

                    <div>
                      <label htmlFor={`description-${index}`} className="block text-xs font-semibold text-gray-600 mb-1">
                        Description *
                      </label>
                      <input
                        id={`description-${index}`}
                        type="text"
                        required
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-3 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-500 text-black"
                        placeholder="Item details"
                      />
                    </div>
                  </div>

                  {/* Photo Path */}
                  <div className="mt-3">
                    <label htmlFor={`photo-${index}`} className="block text-xs font-semibold text-gray-600 mb-1">
                      Photo Path (Optional)
                    </label>
                    <input
                      id={`photo-${index}`}
                      type="text"
                      value={item.photoPath || ''}
                      onChange={(e) => updateItem(index, 'photoPath', e.target.value)}
                      className="w-full px-3 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-500 text-black"
                      placeholder="Photo URL or file path"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating Order...' : '✅ Create Order'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
