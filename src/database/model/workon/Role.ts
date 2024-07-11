import { Schema, model, Types } from 'mongoose';
const { Boolean, String, Date: SDate} = Schema.Types

export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';

export enum RoleCodeEnum {
  ADMIN = 'admin',
}

export enum RoleTypeEnum {
  // 角色分类： 采购类
  PURCHASE = 'purchasing',
}

export default interface Role {
  _id: Types.ObjectId;
  code: string;
  rtype: RoleTypeEnum;
  meta:{
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Role>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    code: {
      type: String,
      required: true,
      enum: Object.values(RoleTypeEnum)
    },
    meta:{
      enabled: {
        type: Boolean,
        default: false,
      },
    },
    createdAt: {
      type: Date,
      required: true,
      default: new Date()
    },
    updatedAt: {
      type: SDate,
      required: true,
      default: new Date()
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ code: 1});

export const RoleModel = model<Role>(DOCUMENT_NAME, schema, COLLECTION_NAME);
