import { Schema, model, Types } from 'mongoose';
const { String, ObjectId, Boolean, Number, Date : MDate} = Schema.Types

export const DOCUMENT_NAME = 'PricelistItem';
export const COLLECTION_NAME = 'PricelistItems';


export default interface PricelistItem {
  _id: Types.ObjectId;
  template: Types.ObjectId;
  variant?: Types.ObjectId;
  quantity: number;
  price: number;
  currency: Types.ObjectId ;

  //供应商价目
  supplier?: Types.ObjectId;
  supplierProductName?: string;
  supplierProductCode?: string;

  //客户价目
  customer?: Types.ObjectId;
  customerProductName?: string;
  customerProductCode?: string;

  //所属价目表
  pricelist?: Types.ObjectId;

  validity:{
    from: Date;
    to: Date;
  }

  // 所属公司
  company: Types.ObjectId;
  creator: Types.ObjectId;

  meta?: {
    isArchived: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<PricelistItem>(
  {
    template: {
      type: ObjectId,
      ref:'Product',
      required: true
    },
    variant: {
      type: ObjectId,
      ref: 'Product',
      required: false
    },
    quantity: {
      type: Number,
      required: true,
      min:0
    },
    price: {
      type: Number,
      required: true,
      min:0
    },
    currency: {
      type: ObjectId,
      ref: 'Currency',
      required: true
    },
    supplier: {
      type: ObjectId,
      ref: 'Entity',
      required: true
    },
    supplierProductName: {
      type: String,
      required: false,
      trim: true
    },
    supplierProductCode:{
      type: String,
      required:false,
      trim:true
    },
    customer: {
      type: ObjectId,
      ref: 'Entity',
      required: true
    },
    customerProductName: {
      type: String,
      required: false,
      trim: true
    },
    customerProductCode:{
      type: String,
      required:false,
      trim:true
    },
    pricelist: {
      type: ObjectId,
      ref: 'Pricelist',
      required:false
    },
    validity:{
      from: {
        type: MDate,
        required: false
      },
      to: {
        type: MDate,
        required: false
      }
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
      isArchived: {
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

export const LocationModel = model<PricelistItem>(DOCUMENT_NAME, schema, COLLECTION_NAME);
