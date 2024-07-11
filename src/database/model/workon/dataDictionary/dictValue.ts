import { Schema, model, Types } from 'mongoose';
const {  String, Date: SDate, ObjectId} = Schema.Types

export const DOCUMENT_NAME = 'DictValue';
export const COLLECTION_NAME = 'DictValues';



export default interface DictValue {
  _id: Types.ObjectId;
  dict: Types.ObjectId;
  rank: number;   //字典内排序
  value: string;  //数值
  label: string;  //中文显示内容，后期需要改成 i18n 支持的
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<DictValue>(
  {
    dict: {
      type: ObjectId,
      reqired: true,
      ref:'Dictionary'
    },
    rank: {
      type: Number,
      reqired: true
    },
    value: {
      type: String,
      reqired: true,
      trim: true
    },
    label: {
      type: String,
      reqired: true,
      trim: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ dict:1, rank: 1});
schema.index({ dict:1, value: 1});
schema.index({ dict:1, label: 1});

export const DictValueModel = model<DictValue>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
