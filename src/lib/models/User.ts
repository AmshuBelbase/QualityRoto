// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

// 1. TypeScript Interface (matches your existing fields + NEW permissions)
export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string; // Note: matches your existing 'phone' field
  password: string;
  role: 'admin' | 'staff';
  isActive: boolean;
  permissions: {
    newOrders: 'read_only' | 'read_write' | 'no_access';
    sa: 'read_only' | 'read_write' | 'no_access';
    sb: 'read_only' | 'read_write' | 'no_access';
    sc: 'read_only' | 'read_write' | 'no_access';
    packaging: 'read_only' | 'read_write' | 'no_access';
    dispatched: 'read_only' | 'read_write' | 'no_access';
    complaints: 'read_only' | 'read_write' | 'no_access';
  };
  createdAt: Date;
  updatedAt: Date;
}

// 2. Schema with default permissions
const userSchema: Schema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff', 'pending'], default: 'pending' },
    isActive: { type: Boolean, default: true },
    permissions: {
      newOrders: { type: String, enum: ['read_only', 'read_write', 'no_access'], default: 'no_access' },
      sa: { type: String, enum: ['read_only', 'read_write', 'no_access'], default: 'no_access' },
      sb: { type: String, enum: ['read_only', 'read_write', 'no_access'], default: 'no_access' },
      sc: { type: String, enum: ['read_only', 'read_write', 'no_access'], default: 'no_access' },
      packaging: { type: String, enum: ['read_only', 'read_write', 'no_access'], default: 'no_access' },
      dispatched: { type: String, enum: ['read_only', 'read_write', 'no_access'], default: 'no_access' },
      complaints: { type: String, enum: ['read_only', 'read_write', 'no_access'], default: 'no_access' },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
