import { Schema, model, Types } from 'mongoose';
const { String, Boolean, ObjectId, Number } = Schema.Types

export const DOCUMENT_NAME = 'CustomerInfo';
export const COLLECTION_NAME = 'CustomerInfos';


export default interface CustomerInfo {
  _id: Types.ObjectId;
  //关联主体 唯一 必填
  entity: Types.ObjectId;

  //销售员
  salesman?: Types.ObjectId;
  //默认跟单员
  merchandiser? : Types.ObjectId;
  meta:{
    enabled: boolean
  }
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<CustomerInfo>(
  {
    entity: {
      type: ObjectId,
      required: true,
      unique:true,
    },
    salesman:{
      //只能是person，不能是公司entity
      type: ObjectId,
      ref: 'Entity'
    },
    merchandiser: {
      type: ObjectId,
      ref: 'Entity'
    },
    meta:{
      enabled: {
        type: Boolean,
        default: false,
      }
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ entity: 1});


export const CustomerInfoModel = model<CustomerInfo>(DOCUMENT_NAME, schema, COLLECTION_NAME);