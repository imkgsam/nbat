import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';

export enum RoleCodeEnum {
  LEARNER = 'learner',
  WRITER = 'writer',
  EDITOR = 'editor',
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
      type: Schema.Types.String,
      required: true,
    },
    meta:{
      enabled: {
        type: Schema.Types.Boolean,
        default: false,
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

schema.index({ code: 1, 'meta.enabled': 1 });

export const RoleModel = model<Role>(DOCUMENT_NAME, schema, COLLECTION_NAME);
