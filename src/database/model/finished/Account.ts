import { model, Schema, Types } from 'mongoose';
import Role from '../workon/Role';
import Entity from './Entity';
const { Boolean, String, Date: SDate } = Schema.Types;

export const DOCUMENT_NAME = 'Account';
export const COLLECTION_NAME = 'accounts';

export interface Question {
  question: string;
  answer: string;
}
export default interface Account {
  _id: Types.ObjectId;
  accountName: string;
  avatar?: string;
  binding:{
    email:{
      account: string;
      verified: boolean
    },
    phone?:{
      account: string;
      verified: boolean
    }
  },
  security:{
    password: string;
    // questions?
  },
  termianl: {
    web: {
      enabled: boolean,
    },
    // pc?:{
    //   enabled: boolean
    // },
    // pda?:{
    //   enabled: boolean
    // }
  },
  roles: Role[];
  linkedTo:{
    entity: Entity;
  },
  meta:{
    verified?: boolean;
    enabled?: boolean;
  },
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Account>(
  {
    accountName: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    avatar: {
      type: String,
      trim: true,
    },
    binding:{
      email: {
        account: {
          type: String,
          unique: true,
          trim: true
        },
        verified:{
          type: Boolean,
          default: false
        }
      },
      // phone: {
      //   account: {
      //     type: String,
      //     unique: true,
      //     trim: true,
      //     sparse:true
      //   },
      //   verified: {
      //     type: Boolean,
      //     default: false
      //   }
      // }
    },
    security:{
      password: {
        type: String,
        select: false,
      },
    },
    termianl:{
      web: {
        enabled: { type: Boolean, default: true},
      },
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
      required: true,
    },
    linkedTo:{
      entity: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
        unique:true
      },
    },
    meta:{
      verified: {
        type: Boolean,
        default: false,
      },
      enabled: {
        type: Boolean,
        default: false,
      },
    },
    createdAt: {
      type: SDate,
      default: new Date(),
      required: true,
    },
    updatedAt: {
      type: SDate,
      default: new Date(),
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ 'binding.email': 1 });


export const AccountModel = model<Account>(DOCUMENT_NAME, schema, COLLECTION_NAME);
