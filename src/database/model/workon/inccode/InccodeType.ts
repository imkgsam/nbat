import { Schema, model, Types } from 'mongoose';

const { Boolean, String, Date: SDate, Number} = Schema.Types

export const DOCUMENT_NAME = 'InccodeType';
export const COLLECTION_NAME = 'inccodeTypes';

export default interface InccodeType {
  _id: Types.ObjectId;
  //条码名称
  code: string;
  // 条码 起始符
  startsWith: string;
  // 中文 remark
  remark: string;
  // Inccode 总长度
  length: number;
  meta:{
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<InccodeType>(
  {
    code:{
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    startsWith: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    remark:{
      type: String,
      trim: true
    },
    length:{
      type: Number,
      default: 10,
    },
    meta:{
      enabled: {
        type: Boolean,
        default: false
      },
    }
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ code: 1 });

export const InccodeTypeModel = model<InccodeType>(DOCUMENT_NAME, schema, COLLECTION_NAME);
