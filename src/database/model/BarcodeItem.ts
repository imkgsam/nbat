import { Schema, model, Types } from 'mongoose';

const { Boolean, String, Date: SDate, Number, ObjectId} = Schema.Types

export const DOCUMENT_NAME = 'BarcodeItem';
export const COLLECTION_NAME = 'barcodeItems';

export default interface BarcodeItem {
  _id: Types.ObjectId;
  // barcode type
  btype: Types.ObjectId;
  num: number;
  item: Types.ObjectId;
  meta:{
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<BarcodeItem>(
  {
    btype:{
      type: ObjectId,
      required: true,
      ref: 'BarcodeType'
    },
    num:{
      type: Number,
      required: true
    },
    item: {
      type: ObjectId,
      required: true,
      ref:'Item'
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

schema.index({ num: 1, btype: 1 });

export const BarcodeItemModel = model<BarcodeItem>(DOCUMENT_NAME, schema, COLLECTION_NAME);
