import { Schema, model, Types } from 'mongoose';
const { Boolean, String, Date: SDate, Number, ObjectId} = Schema.Types

export const DOCUMENT_NAME = 'MoldGroup';
export const COLLECTION_NAME = 'MoldGroups';

export enum MoldTypeEnum {
  ONFLOOR = 'OnFloor',
  HIGHPRESSURE = 'HighPressure',
  ONLINE = 'On-line'
}

export enum MoldGroupStatusEnum  {
  // 闲置, 没有安装模具的时候
  IDLE = 'Idle',
  //待命中， 已经安装上了
  STANDBY = 'Standby',
  // 维护中， 已经安装上，但是在维护中，不可生产
  MAINTENANCE = 'Maintenance',
  // 运行中， 正常生产中
  RUNNING = 'Running',
  // 报废停用中， 已经不再生产的
  SCRAPPED = 'Scrapped'
}


export default interface MoldGroup {
  _id: Types.ObjectId;
  //模具组名称
  name: string,
  //类型
  mtype: MoldTypeEnum,
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
    //状态
    status: MoldGroupStatusEnum
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
    mtype: {
      type: String,
      required: true,
      enum: Object.values(MoldTypeEnum),
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
      status: {
        type: String,
        required: true,
        enum: Object.values(MoldGroupStatusEnum)
      }
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ name: 1 });

export const MoldGroupModel = model<MoldGroup>(DOCUMENT_NAME, schema, COLLECTION_NAME);
