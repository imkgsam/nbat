import { Schema, model, Types } from 'mongoose';
const { String,  ObjectId } = Schema.Types

export const DOCUMENT_NAME = 'Location';
export const COLLECTION_NAME = 'Locations';

export enum LocationTypeEnum {
  // 视图 - 虚拟，用于总览
  VIEW = 'View',
  // 客户
  CUSTOMER = 'Customer',
  // 供应商 - 
  VENDOR = 'Vendor',
  // 中转 - 用于不同区域间的调拨
  TRANSIT = 'Transit',
  // 折损 - 虚拟地址，用于产品破损销毁
  INVENTORY_LOST = 'Inventory Lost',
  // 内部 - 物理区域，能存货
  INTERNAL = "Internal",
  //生产区域 - 区域
}


export default interface Location {
  _id: Types.ObjectId;
  name: string;
  ltype: LocationTypeEnum;
  // 所属公司
  company?: Types.ObjectId | string;
  parent?: Types.ObjectId;
  meta?:{
    enabled: boolean;
    isProduction: boolean;
    isReturn: boolean;
    isScrap: boolean;
    isStorable: boolean;
    isRentable: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Location>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim:true,
      index:true
    },
    manager:{
      type: ObjectId,
      ref: 'Entity'
    },
    parent:{
      type: ObjectId,
      ref: 'Location'
    },
    meta:{
      enabled: {
        type: Schema.Types.Boolean,
        default: false,
      }
    },
    color: {
      type: String,
      trim: true
    },
    company: {
      type: ObjectId,
      ref: 'Entity',
      required:true
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      default: new Date(),
      select: false
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      default: new Date(),
      select: false
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ name: 1 });

export const LocationModel = model<Location>(DOCUMENT_NAME, schema, COLLECTION_NAME);
