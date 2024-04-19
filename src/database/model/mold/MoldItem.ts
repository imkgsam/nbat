import { Schema, model, Types } from 'mongoose';
const { Boolean, Date: SDate, Number, ObjectId} = Schema.Types
import { MoldTypeEnum } from './MoldGroup'

export const DOCUMENT_NAME = 'MoldItem';
export const COLLECTION_NAME = 'MoldItems';


// export enum MOLDSTATUSENUM {
// }

interface moldItemAttributeOptions {
  attribute: Types.ObjectId,
  options: Array<Types.ObjectId>
}


export default interface MoldItem {
  _id: Types.ObjectId;
  //模具厂家, Entity
  supplier: Types.ObjectId,
  // 对应的产品模具 sku，
  mold: Types.ObjectId,
  // 对应的产品spu 涉及属性
  product: Types.ObjectId,
  //模具所能添加的属性以及可选值， 创建模具的时候，可以从对应的mold上选取attribute和attribute option，并附加到模具上。
  attributes: Array<moldItemAttributeOptions>,
  // 模具类型， 地摊 高压 上线
  mtype: MoldTypeEnum,
  group:{
    // 所属模组(线), 1.安装上了，2.还没安装
    moldGroup: Types.ObjectId,
    // 模组的哪个位置
    index: number
  },
  //条码
  barcode: Types.ObjectId,
  //理论最大注浆次数
  maxGroutingTimes: number,
  //初始注浆次数
  initialGroutingTimes: number,
  // 预警 阈值
  warningThreadhold: number,
  // 累计注浆次数，不含初始次数
  cumulativeGroutingTimes: number,
  /**
   * 当前所处地点
   * 1. 外购
   *  1.1 未入库 x
   *  1.2 已入库 具体的地点
   * 2. 自己制作
   *  2.1 制作完成 具体地点（模具车间）
   *  2.2 入库到其他车间 （其他生产车间）
   */
  // location: Types.ObjectId,
  meta:{
    //是否启用
    enabled: boolean;
    //是否在使用中, 当使用中，则查看所在模组，当没在使用中，则查看所在地点
    inUse: boolean;
    // 是否已报废
    isScraped: boolean;
    //报废日期
    scrapDate: Date,
    //批次
    batch: string
  };
  // 内部备注，
  remark: string,
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<MoldItem>(
  {
    supplier:{
      type: ObjectId,
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
    mtype: {
      type: String,
      required: true,
      enum: Object.values(MoldTypeEnum),
      trim: true
    },
    attributes:[{
      attribute: {
        type: ObjectId,
        ref:'Attribute',
        required: true
      },
      options:[{
        type: ObjectId,
        required:true,
        ref:'AttributeValue'
      }]
    }],
    group:{
      moldGroup: {
        type: ObjectId,
        required: true,
        ref: 'MoldGroup',
        sparse: true
      },
      index: {
        type: Number,
        required: true,
        default: 0
      }
    },
    barcode: {
      type: ObjectId,
      required: true,
      unique: true,
      ref: 'Barcode'
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
      default: 0
    },
    meta:{
      enabled: {
        type: Boolean,
        default: false
      },
      inUse: {
        type: Boolean,
        default: false
      },
      isScraped: {
        type: Boolean,
        default: false
      },
      scrapDate: {
        type: SDate
      },
      batch:{
        type: String,
        required: true,
        trim: true
      }
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ barcode: 1 });
schema.index({ 'group.moldGroup': 1 ,'group.index':1 });

export const MoldItemModel = model<MoldItem>(DOCUMENT_NAME, schema, COLLECTION_NAME);
