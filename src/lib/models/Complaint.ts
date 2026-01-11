import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaint extends Document {
  orderId: mongoose.Types.ObjectId;
  section: 'newOrders' | 'sa' | 'sb' | 'sc' | 'packaging' | 'dispatched';
  description: string;
  createdBy: mongoose.Types.ObjectId;
  status: 'open' | 'resolved';
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema<IComplaint>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    section: { 
      type: String, 
      enum: ['newOrders', 'sa', 'sb', 'sc', 'packaging', 'dispatched'],
      required: true 
    },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', complaintSchema);
