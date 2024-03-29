import { Schema, model, Types } from 'mongoose';
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
  EXPENSE = 'Expense'
}

/**
 * Item 是 款式SPU，单品SKU，服务Service， 原料Raw Mat。。。的集合
 */
export default interface Item {
  _id: Types.ObjectId;
  // 产品型号 如： MB-2062
  code: string;
  //所属的产品类别
  category: Types.ObjectId;
  etype: itemTypeEnum;
  attributes: Array<attributeOptions>;
  meta?: {
    //是否启用
    enabled: boolean;
    //是否跟踪库存
    isStockable: boolean;
    //是否能销售
    canBeSold: boolean;
    //是否能采购
    canBePurchased: boolean;
    //是否能生产
    canBenProduced: boolean;
    hasVariants: boolean;
    //是哪个款式的变体
    isVariantOf: Types.ObjectId;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Item>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true
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
      isStockable: {
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
      canBenProduced: {
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

schema.index({ code: 1 });

export const ItemModel = model<Item>(DOCUMENT_NAME, schema, COLLECTION_NAME);
