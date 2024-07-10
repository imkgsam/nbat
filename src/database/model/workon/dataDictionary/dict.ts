import { Schema, model, Types } from 'mongoose';
const {  String, Date: SDate, ObjectId, Boolean} = Schema.Types

export const DOCUMENT_NAME = 'Dictionary';
export const COLLECTION_NAME = 'Dictionaries';

export enum DictTypeEnum {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean'
}

export default interface Dictionary {
  _id: Types.ObjectId;
  name: string; // 字典名称 唯一
  code: string; // 字典代号 唯一
  dtype: DictTypeEnum, // 字典类型，可以是数字，可以是string，也可以是boolean
  meta:{
    systemDep: boolean; // 是否是系统依赖字典， 如果是的话，不可删除
    enabled: boolean; // 是否启用
    modifiable: boolean; // 是否可修改
  },
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Dictionary>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    code: {
      type: String,
      reqired: true,
      unique: true
    },
    meta: {
      systemDep: {
        type: Boolean,
        default: false
      },
      enabled: {
        type: Boolean,
         default: false
      },
      modifiable:{
        type: Boolean,
        default: true
      }
    }
  },
  {
    versionKey: false,
    timestamps: true
  },
);

export const DictionaryModel = model<Dictionary>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
