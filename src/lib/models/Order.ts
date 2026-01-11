import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  itemType: 'A' | 'B' | 'C';
  quantity: number;
  price: number;
  description: string;
  photoPath?: string; // file upload path
}

export interface IOrder extends Document {
  // Basic info
  customerName: string;
  customerPhone: string;
  items: IOrderItem[];
  createdBy: mongoose.Types.ObjectId; // staff who entered the order
  
  // Workflow status
  status: 
    | 'NEW' | 'ACCEPTED' | 'REJECTED'
    | 'SA_PENDING' | 'SA_DONE' | 'SA_FAILED'
    | 'SB_PENDING' | 'SB_DONE' | 'SB_FAILED'
    | 'SC_PENDING' | 'SC_DONE' | 'SC_FAILED'
    | 'PACKAGING_PENDING' | 'PACKAGING_DONE' | 'PACKAGING_FAILED'
    | 'DISPATCH_YET' | 'DISPATCH_REACHED' | 'DISPATCH_FAILED' | 'DISPATCH_COULD_NOT';
  
  // Audit trail (who did what at each stage)
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  saProcessedBy?: mongoose.Types.ObjectId;
  saProcessedAt?: Date;
  sbProcessedBy?: mongoose.Types.ObjectId;
  sbProcessedAt?: Date;
  scProcessedBy?: mongoose.Types.ObjectId;
  scProcessedAt?: Date;
  packagedBy?: mongoose.Types.ObjectId;
  packagedAt?: Date;
  dispatchedBy?: mongoose.Types.ObjectId;
  dispatchedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [
      {
        itemType: { type: String, enum: ['A', 'B', 'C'], required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        description: { type: String, required: true },
        photoPath: { type: String }
      }
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: [
        'NEW', 'ACCEPTED', 'REJECTED',
        'SA_PENDING', 'SA_DONE', 'SA_FAILED',
        'SB_PENDING', 'SB_DONE', 'SB_FAILED',
        'SC_PENDING', 'SC_DONE', 'SC_FAILED',
        'PACKAGING_PENDING', 'PACKAGING_DONE', 'PACKAGING_FAILED',
        'DISPATCH_YET', 'DISPATCH_REACHED', 'DISPATCH_FAILED', 'DISPATCH_COULD_NOT'
      ],
      default: 'NEW'
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    saProcessedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    saProcessedAt: { type: Date },
    sbProcessedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sbProcessedAt: { type: Date },
    scProcessedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    scProcessedAt: { type: Date },
    packagedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    packagedAt: { type: Date },
    dispatchedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    dispatchedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
