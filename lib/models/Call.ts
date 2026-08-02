import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICall extends Document {
  shopName: string;
  shopNumber: string;
  callStatus: 'Answered' | 'Rejected' | 'Busy' | 'No Answer' | 'Switched Off' | 'Call Back Later';
  websiteDiscussed: 'Yes' | 'No';
  followUpDate?: string;
  followUpTime?: string;
  remarks?: string;
  addedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const CallSchema = new Schema<ICall>(
  {
    shopName: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
      index: true,
    },
    shopNumber: {
      type: String,
      required: [true, 'Shop number is required'],
      trim: true,
      index: true,
    },
    callStatus: {
      type: String,
      enum: ['Answered', 'Rejected', 'Busy', 'No Answer', 'Switched Off', 'Call Back Later'],
      required: [true, 'Call status is required'],
      index: true,
    },
    websiteDiscussed: {
      type: String,
      enum: ['Yes', 'No'],
      required: [true, 'Website discussed is required'],
    },
    followUpDate: {
      type: String,
      default: null,
      index: true,
    },
    followUpTime: {
      type: String,
      default: null,
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
    addedBy: {
      type: String,
      required: [true, 'Added by is required'],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for common queries
CallSchema.index({ callStatus: 1, followUpDate: 1 });
CallSchema.index({ addedBy: 1, createdAt: -1 });
CallSchema.index({ shopName: 'text', remarks: 'text' });

const Call: Model<ICall> =
  mongoose.models.Call || mongoose.model<ICall>('Call', CallSchema);

export default Call;
