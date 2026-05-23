import { Schema, model, type HydratedDocument, type Types } from 'mongoose';

export interface TrackingEntry {
  applicationId: Types.ObjectId;
  status: string;
  note?: string;
  updatedBy: Types.ObjectId;
}

export type TrackingDocument = HydratedDocument<TrackingEntry>;

const trackingSchema = new Schema<TrackingEntry>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    status: { type: String, required: true, trim: true },
    note: { type: String, trim: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const TrackingModel = model<TrackingEntry>('Tracking', trackingSchema);