import { Schema, model, Types } from 'mongoose';
import AttributeValue from './AttributeValue';
const { String, Boolean } = Schema.Types
export const DOCUMENT_NAME = 'Attribute';
export const COLLECTION_NAME = 'attributes';


/**
 * attribute 属性,
 * todo:
 *  1. 选择显示类型
 *  2. 网页是否可见
 *  3. 选项是否可见
 */
export default interface Attribute {
  _id: Types.ObjectId;
  //属性名称，可以用任何语言，取决与创建人
  name: string;
  // code, 用于转换语言的，默认是英语
  code: string;
  meta:{
    enabled: boolean
  },
  values?: Array<AttributeValue>
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Attribute>(
  {
    name: {
      type: String,
      required: true,
      unique:true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique:true,
      trim: true
    },
    meta:{
      enabled: {
        type: Boolean,
        default: false
      }
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      default: new Date(),
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      default: new Date(),
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ name: 1 });
schema.index({ code: 1 });

export const AttributeModel = model<Attribute>(DOCUMENT_NAME, schema, COLLECTION_NAME);