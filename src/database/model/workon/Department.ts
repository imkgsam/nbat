import { Schema, model, Types } from 'mongoose';
const { String,  ObjectId } = Schema.Types

export const DOCUMENT_NAME = 'Department';
export const COLLECTION_NAME = 'departments';

export default interface Department {
  _id: Types.ObjectId;
  // 部门名称
  name: string;
  manager?: Types.ObjectId | string;
  parent?: Types.ObjectId | string;
  meta?:{
    enabled: boolean;
  };
  //部门颜色
  color?: string;
  //所属公司
	company?: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Department>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim:true,
      index:true
    },
    manager:{
      type: ObjectId,
      ref: 'Entity'
    },
    parent:{
      type: ObjectId,
      ref: 'Department'
    },
    meta:{
      enabled: {
        type: Schema.Types.Boolean,
        default: false,
      }
    },
    color: {
      type: String,
      trim: true
    },
    company: {
      type: ObjectId,
      ref: 'Entity',
      required:true
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

schema.index({ name: 1,company:1, 'meta.enabled': 1 });

export const DepartmentModel = model<Department>(DOCUMENT_NAME, schema, COLLECTION_NAME);
