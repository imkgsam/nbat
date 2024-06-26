import { Schema, model, Types } from 'mongoose';

const { Boolean, String, Date: SDate} = Schema.Types

export const DOCUMENT_NAME = 'Facility';
export const COLLECTION_NAME = 'Facilities';

export default interface Facility {
  _id: Types.ObjectId;
  code: string;
  meta:{
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Facility>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    meta:{
      enabled: {
        type: Boolean,
        default: false,
      },
    },
    createdAt: {
      type: Date,
      required: true,
      default: new Date()
    },
    updatedAt: {
      type: SDate,
      required: true,
      default: new Date()
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

export const FacilityModel = model<Facility>(DOCUMENT_NAME, schema, COLLECTION_NAME);
