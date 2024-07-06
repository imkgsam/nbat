import { Schema, model, Types } from 'mongoose';
const { String, Boolean, ObjectId, Number } = Schema.Types

export const DOCUMENT_NAME = 'SupplierInfo';
export const COLLECTION_NAME = 'SupplierInfos';


export default interface SupplierInfo {
  _id: Types.ObjectId;
  //关联主体 唯一 必填
  entity: Types.ObjectId;
  //采购员
  handler?: Types.ObjectId;
  currency?: Types.ObjectId;
  meta:{
    //当entity不再拥有供应商 身份时， 此供应商档案将停用，当用户重新被赋予供应商身份时，此档案将被重新启用
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<SupplierInfo>(
  {
    entity: {
      type: ObjectId,
      required: true,
      unique:true,
    },
    handler:{
      //只能是person，不能是公司entity
      type: ObjectId,
      ref: 'Entity'
    },
    currency: {
      type: ObjectId,
      ref: 'Currency'
    },
    meta:{
      enabled: {
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

schema.index({ entity: 1});


export const SupplierInfoModel = model<SupplierInfo>(DOCUMENT_NAME, schema, COLLECTION_NAME);