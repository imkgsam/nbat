import { model, Schema, Types } from 'mongoose';
import Role from './Role';
import Entity from './Entity';

export const DOCUMENT_NAME = 'Account';
export const COLLECTION_NAME = 'accounts';

export interface Question {
  question: string;
  answer: string;
}

export default interface Account {
  _id: Types.ObjectId;
  accountName?: string;
  //用于登录，或接收邮件验证码
  email: string;
  //可用于接收短信验证码
  phone?: string;
  password: string;
  roles: Role[];
  entity: Entity;
  meta:{
    verified?: boolean;
    enabled?: boolean;
  },
  security:{
    questions?:{
      one: Question,
      two: Question,
      three: Question
    },
    bindedPhone?: string
  },
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Account>(
  {
    accountName: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      trim: true
    },
    phone: {
      type: Schema.Types.String,
      unique: true,
      trim: true,
      sparse:true
    },
    password: {
      type: Schema.Types.String,
      select: false,
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
      required: true,
      select: false,
    },
    entity: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      unique:true
    },
    meta:{
      verified: {
        type: Schema.Types.Boolean,
        default: false,
      },
      enabled: {
        type: Schema.Types.Boolean,
        default: false,
      },
    },
    security:{
      questions:{
        one: {
          question: {
            type: Schema.Types.String,
            trim:true
          },
          answer:{
            type: Schema.Types.String,
            trim:true
          }
        },
        two: {
          question: {
            type: Schema.Types.String,
            trim:true
          },
          answer:{
            type: Schema.Types.String,
            trim:true
          }
        },
        three: {
          question: {
            type: Schema.Types.String,
            trim:true
          },
          answer:{
            type: Schema.Types.String,
            trim:true
          }
        }
      },
      bindedPhone: {
          type: Schema.Types.String,
          trim: true,
          unique: true
      }
    },
    createdAt: {
      type: Schema.Types.Date,
      default: new Date(),
      required: true,
      select: false
    },
    updatedAt: {
      type: Schema.Types.Date,
      default: new Date(),
      required: true,
      select: false
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ email: 1 });


export const AccountModel = model<Account>(DOCUMENT_NAME, schema, COLLECTION_NAME);
