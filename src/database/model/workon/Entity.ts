import { Schema, model, Types } from 'mongoose';
import Account from './Account';
import Employee from './Employee';
const { String, Boolean, ObjectId } = Schema.Types

export const DOCUMENT_NAME = 'Entity';
export const COLLECTION_NAME = 'entites';

export enum EntityTypeEnum {
  COMPANY = 'Company',
  PERSON = 'Person',
}

export enum GenderTypeEnum {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHERS = 'Others'
}

interface KVMap {
  mkey: string;
  mvalue: string;
}

export default interface Entity {
  _id: Types.ObjectId;
  //主体名称 唯一 必填
  name: string; 
  //别称 用于公司内部识别 唯一 可选
  alias?: string;
  //种类，个人还是公司
  etype: EntityTypeEnum;
  //对于个人是所属的公司，对于公司就是所属的母公司，可选
  scompany?: Types.ObjectId | Entity; 
  personal?:{
    //职位
    jobTitle?: string;
    //性别
    sex?: string;
    //生日
    birth?: Date;
  };
  enterprise?:{
    //公司 管理员，用于管理系统内 公司信息及人员 的 ‘管理员’
    manager?: Types.ObjectId;
    //成立时间
    foundedAt?: Date;
    // 公司税务代码 用于识别公司机构 唯一
    taxNum?: string;
  };
  common?:{
    website?: string;
    //邮箱地址，个人-个人邮箱，公司-默认邮箱
    email?: string;
    //固话
    landline?: string;
    //手机
    mobilePhone?: string;
    //所在国家
    country?: string;
    //所在城市
    city?: string;
    //行业
    industry?: string;
    //内部备注
    internalNote?: string; 
  };
  //所有社交方式
  socialMedias?:KVMap[];
  //关联的登录账户 可选
  account?: Types.ObjectId | Account;
  //关联的员工账户 可选
  employee?: Types.ObjectId | Employee;
  meta:{
    //是否开启
    enabled?: boolean;
    //是否已通过认证
    verified?: boolean;
    //是否为我司供应商
    isSupplier?: boolean;
    //是否为我司客户
    isCustomer?: boolean;
    //是否为我司员工
    isEmployee?: boolean;
    //是否可以登录系统
    isUser?: boolean;
    //是否为工人
    isWorker?: boolean
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Entity>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    alias: {
      type: String,
      trim: true,
    },
    etype: {
      type: String,
      required:true,
      default: EntityTypeEnum.PERSON,
      enum: Object.values(EntityTypeEnum)
    },
    scompany:{
      type: ObjectId,
      ref:'Entity'
    },
    personal:{
      jobTitle: {
        type:String, trim: true
      },
      sex: {
        type:String, trim: true, enum: Object.values(GenderTypeEnum) 
      },
      birth: {
        type: Schema.Types.Date
      }
    },
    enterprise:{
      manager: {
        type: ObjectId,
        ref:'Entity'
      },
      foundedAt: {
        type: Schema.Types.Date
      },
      taxNum :{
        type: String,
        unique: true,
        trim: true,
        sparse:true
      }
    },
    common:{
      website: {
        type: String,trim: true
      },
      email: {
        type: String,trim: true
      },
      landline: {
        type: String,trim: true
      },
      mobilePhone: {
        type: String,trim: true
      },
      country: {
        type: String,trim: true
      },
      city: {
        type: String,trim: true
      },
      industry: {
        type: String,trim: true
      },
      internalNote: {
        type: String,trim: true
      }, 
    },
    socialMedias:[{
      mkey: { type: String, trim:true},
      mvalue: { type: String, trim: true}
    }],
    account: {
      type: ObjectId,
      ref: 'Account'
    },
    employee: {
      type: ObjectId,
      ref: 'Employee'
    },
    meta:{
      enabled: {
        type: Boolean,
        default: false,
      },
      verified:{
        type: Boolean
      },
      isSupplier:{
        type: Boolean
      },
      isCustomer:{
        type: Boolean
      },
      isEmployee:{
        type: Boolean
      },
      isUser:{
        type: Boolean
      },
      isWorker:{
        type: Boolean
      }
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      default: new Date(),
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      default: new Date(),
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ name: 1});

export const EntityModel = model<Entity>(DOCUMENT_NAME, schema, COLLECTION_NAME);
