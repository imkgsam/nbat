import { Schema, model, Types } from 'mongoose';
const { String, ObjectId, Boolean} = Schema.Types

export const DOCUMENT_NAME = 'Pricelist';
export const COLLECTION_NAME = 'Pricelists';


export default interface Pricelist {
  _id: Types.ObjectId;
  name: string;
  currency: Types.ObjectId;
  company: Types.ObjectId;
  creator: Types.ObjectId;
  meta?: {
    isPublic: boolean;
    isEnabled: boolean;
    isAvchived: boolean;
    //如果不是公开的，则需要看是否某些人可见
    visiableTo: Types.ObjectId[]
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Pricelist>(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    currency: {
      type: ObjectId,
      ref: 'Currency',
      required:true
    },
    company: {
      type: ObjectId,
      ref: 'Entity',
      required: true
    },
    creator: {
      type: ObjectId,
      ref: 'Entity',
      required: true
    },
    meta: {
      isPublic: {
        type: Boolean,
        default: true
      },
      isEnabled: {
        type: Boolean,
        default: false
      },
      isArchived: {
        type: Boolean,
        default: false
      },
      visiableTo:[{
        type: ObjectId,
        ref: 'Entity',
        required: true
      }]
    }
  },
  {
    versionKey: false,
    timestamps: true
  },
);

export const LocationModel = model<Pricelist>(DOCUMENT_NAME, schema, COLLECTION_NAME);
