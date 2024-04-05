import { Schema, model, Types } from 'mongoose';
const { Boolean, String, Date: SDate, Number, ObjectId} = Schema.Types

export const DOCUMENT_NAME = 'MoldGroup';
export const COLLECTION_NAME = 'MoldGroups';

export default interface MoldGroup {
  _id: Types.ObjectId;
  //模具组名称
  name: string,
  // 操作工人s
  workers: Types.ObjectId[],
  //所属车间部门
  department: Types.ObjectId,
  //所在地点
  location: Types.ObjectId,
  // 管理人员
  manager: Types.ObjectId,
  meta:{
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<MoldGroup>(
  {
    name:{
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    workers:[{
      type: ObjectId,
      required: true,
      ref: 'Entity'
    }],
    department: {
      type: ObjectId,
      required: true,
      ref: 'Department'
    },
    location: {
      type: ObjectId,
      required: true,
      ref: 'Location'
    },
    manager:{
      type: ObjectId,
      required: true,
      ref: 'Entity'
    },
    meta:{
      enabled: {
        type: Boolean,
        default: false
      },
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ name: 1 });

export const MoldGroupModel = model<MoldGroup>(DOCUMENT_NAME, schema, COLLECTION_NAME);
