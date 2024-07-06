import { Schema, model, Types } from 'mongoose';
const { Boolean, String, Date: SDate} = Schema.Types

export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';

export enum RoleCodeEnum {
  ADMIN = 'admin',
}

export default interface Role {
  _id: Types.ObjectId;
  code: string;
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

schema.index({ code: 1, 'meta.enabled': 1 });

export const RoleModel = model<Role>(DOCUMENT_NAME, schema, COLLECTION_NAME);
