import { Schema, model, Types } from 'mongoose';

const { Boolean, String, Date: SDate, Number} = Schema.Types

export const DOCUMENT_NAME = 'BarcodeType';
export const COLLECTION_NAME = 'barcodeTypes';

export default interface BarcodeType {
  _id: Types.ObjectId;
  startsWith: string;
  code: string;
  // 中文 remark
  remark: string;
  length: number;
  meta:{
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<BarcodeType>(
  {
    code:{
      type:String,
      required: true,
      trim: true,
      unique: true
    },
    remark:{
      type: String,
      trim: true
    },
    startsWith: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    length:{
      type: Number,
      default: 10,
    },
    meta:{
      enabled: {
        type: Boolean,
        default: false
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

schema.index({ code: 1 });

export const BarcodeTypeModel = model<BarcodeType>(DOCUMENT_NAME, schema, COLLECTION_NAME);
