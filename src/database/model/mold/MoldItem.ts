import { Schema, model, Types } from 'mongoose';
const { Boolean, Date: SDate, Number, ObjectId} = Schema.Types

export const DOCUMENT_NAME = 'MoldItem';
export const COLLECTION_NAME = 'MoldItems';

export default interface MoldItem {
  _id: Types.ObjectId;
  //模具厂家, Entity
  supplier: Types.ObjectId,
  // 对应的产品模具 sku
  mold: Types.ObjectId,
  // 对应的产品spu
  product: Types.ObjectId,
  // 所属模组(线)
  moldGroup: Types.ObjectId,
  //条码
  barcode: Types.ObjectId,
  //上线装载 时间戳
  loadTime: Date,
  //报废日期
  scrapDate: Date,
  //理论最大注浆次数
  maxGroutingTimes: number,
  //初始注浆次数
  initialGroutingTimes: number,
  // 预警 阈值
  warningThreadhold: number,
  // 累计注浆次数，不含初始次数
  cumulativeGroutingTimes: number,

  meta:{
    enabled: boolean;
    inProduction: boolean;
  };
  //创建时间，相当于模具的入库时间，因为模具入库的时候需要创建
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<MoldItem>(
  {
    supplier:{
      type: ObjectId,
      required: true,
      ref: 'Entity'
    },
    mold:{
      type: ObjectId,
      required: true,
      ref: 'Item'
    },
    product: {
      type: ObjectId,
      requied: true,
      ref: 'Item'
    },
    moldGroup: {
      type: ObjectId,
      required: true,
      ref: 'MoldGroup'
    },
    barcode: {
      type: ObjectId,
      required: true,
      unique: true,
      ref: 'Barcode'
    },
    loadTime: {
      type: SDate
    },
    scrapDate: {
      type: SDate
    },
    maxGroutingTimes: {
      type: Number,
      required: true,
      default: 100
    },
    initialGroutingTimes: {
      type: Number,
      default: 0
    },
    warningThreadhold: {
      type: Number,
      required: true,
      default: function(){
        return this.maxGroutingTimes * 0.8
      }
    },
    cumulativeGroutingTimes: {
      type: Number,
      required: true,
      ref: 'MoldGroup'
    },
    meta:{
      enabled: {
        type: Boolean,
        default: false
      },
      inProduction:{
        type: Boolean,
        default: false
      }
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ barcode: 1 });

export const MoldItemModel = model<MoldItem>(DOCUMENT_NAME, schema, COLLECTION_NAME);