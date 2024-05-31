import { Schema, model, Types } from 'mongoose';
import { MoldTypeEnum } from '../mold/MoldGroup';
const { String, ObjectId, Boolean } = Schema.Types

export const DOCUMENT_NAME = 'Item';
export const COLLECTION_NAME = 'items';


interface attributeOptions {
  attribute: Types.ObjectId;
  options: Array<Types.ObjectId>
}

export enum itemTypeEnum {
  PRODUCT = 'Product',
  SERVICE = 'Service',
  // 模具
  MOLD = 'Mold'
  
  //关联到场地，就能出租了
  // LOCATION = 'Location'，
  // 纸箱
  // CARTON = 'Carton'
  // 集合
  // COMB = 'Combination' 
}

/**
 * Item 是 款式SPU，单品SKU，服务Service， 原料Raw Mat。。。的集合
 */
export default interface Item {
  _id: Types.ObjectId;
  // 对外产品型号 如： MB-2062
  code: string;
  //内部的别称
  alias: string;
  //所属的产品类别
  category: Types.ObjectId;
  etype: itemTypeEnum;
  meta?: {
    //是否启用
    enabled: boolean;
    //是否跟踪库存
    canBeStocked: boolean;
    //是否能销售
    canBeSold: boolean;
    //是否能采购
    canBePurchased: boolean;
    //是否能生产, 说明是 - 空瓷 或 自产品
    canBeProduced: boolean;
    //是否能出租
    canBeRented: boolean;
    // 是否有变体
    hasVariants: boolean;
    //是哪个款式的变体 parent
    isVariantOf?: Types.ObjectId;
    attributeTags?: Array<Types.ObjectId>;
  };
  attributes?: Array<attributeOptions>;
  //模具相关
  mold?:{
    //理论最高注浆次数
    maxGroutingTimes: number,
    // 预警 阈值
    warningThreadhold: number,
    // 对应的产品spu
    product: Types.ObjectId,
    // 对应模具的类型
    mtype: MoldTypeEnum
  }
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Item>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    alias: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true
    },
    etype: {
      type: String,
      required:true,
      enum: Object.values(itemTypeEnum)
    },
    meta: {
      enabled: {
        type: Boolean,
        default: false,
      },
      canBeStocked: {
        type: Boolean,
        default: false
      },
      canBeSold: {
        type: Boolean,
        default: false
      },
      canBePurchased: {
        type: Boolean,
        default: false
      },
      canBeProduced: {
        type: Boolean,
        default: false
      },
      hasVariants: {
        type: Boolean,
        default: false
      },
      isVariantOf: {
        type: ObjectId,
        ref: 'Item'
      },
      attributeTags:{
        type: ObjectId,
        ref: 'AttributeValue'
      }
    },
    attributes: [{
      attribute: {
        type: ObjectId,
        ref: 'Attribute',
        required: true
      },
      options: [{
        type: ObjectId,
        ref: 'AttributeOption',
        required: true
      }]
    }],
    mold:{
      maxGroutingTimes: {
        type: Number
      },
      warningThreadhold: {
        type: Number
      },
      product: {
        type: ObjectId,
        ref:'Item'
      },
      mtype: {
        type:String,
        enum: Object.values(MoldTypeEnum)
      }
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

schema.index({ code: 1 ,category: 1});
schema.index({ alias: 1 ,category: 1});

export const ItemModel = model<Item>(DOCUMENT_NAME, schema, COLLECTION_NAME);
