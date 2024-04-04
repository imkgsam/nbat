import { Schema, model, Types } from 'mongoose';
const { String, ObjectId, Boolean } = Schema.Types

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
  //生产区域 - 区域, 不能存货
  PRODUCTION = "Production",
  //退回 区域
  RETURN = 'Return',

}


export default interface Location {
  _id: Types.ObjectId;
  name: string;
  ltype: LocationTypeEnum;
  // 所属公司
  company?: Types.ObjectId;
  parent?: Types.ObjectId;
  meta?: {
    // 地区是否开启
    enabled: boolean;
    // 地区是否可存货
    isStorable: boolean;
    // 地区是否可出租
    // isRentable: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Location>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    ltype: {
      type: String,
      enum: Object.values(LocationTypeEnum),
      required: true
    },
    parent: {
      type: ObjectId,
      ref: 'Location',
      sparse: true
    },
    company: {
      type: ObjectId,
      ref: 'Entity',
      required: true
    },
    meta: {
      enabled: {
        type: Boolean,
        default: false,
      },
      isStorable: {
        type: Boolean,
        default: false,
      }
    }
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ name: 1, parent: 1 });

export const LocationModel = model<Location>(DOCUMENT_NAME, schema, COLLECTION_NAME);
