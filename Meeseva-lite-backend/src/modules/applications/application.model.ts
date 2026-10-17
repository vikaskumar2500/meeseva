import { Schema, model, type HydratedDocument, type Types } from 'mongoose';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'approved'
  | 'rejected';

export interface Application {
  userId: Types.ObjectId;
  applicationType: string;
  title: string;
  status: ApplicationStatus;
  payload: Record<string, unknown>;
}

export type ApplicationDocument = HydratedDocument<Application>;

const applicationSchema = new Schema<Application>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    applicationType: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'in_review', 'approved', 'rejected'],
      default: 'draft',
    },
    payload: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const ApplicationModel = model<Application>(
  'Application',
  applicationSchema
);
