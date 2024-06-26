import { Schema, model, Types } from 'mongoose';
const { String, Boolean} = Schema.Types

export const DOCUMENT_NAME = 'Currency';
export const COLLECTION_NAME = 'Currencies';


export default interface Currency {
  _id: Types.ObjectId;
  code: string; //iso 4217
  name: string;
  symbol: string;
  unit: string;
  subunit: string;
  meta?: {
    isActive: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Currency>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    code: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    symbol: {
      type: String,
      trim: true,
      required: true,
    },
    unit: {
      type: String,
      trim: true,
      required: true
    },
    subunit: {
      type: String,
      trim: true,
      required: true
    },
    meta: {
      isActive: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    versionKey: false,
    timestamps: true
  },
);

export const LocationModel = model<Currency>(DOCUMENT_NAME, schema, COLLECTION_NAME);
