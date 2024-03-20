import { Schema, model, Types } from 'mongoose';

const {  String, Date: SDate} = Schema.Types

export const DOCUMENT_NAME = 'RouteAuth';
export const COLLECTION_NAME = 'RouteAuths';


export default interface RouteAuth {
  _id?: Types.ObjectId;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<RouteAuth>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true
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

export const RouteAuthModel = model<RouteAuth>(DOCUMENT_NAME, schema, COLLECTION_NAME);
