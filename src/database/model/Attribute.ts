import { Schema, model, Types } from 'mongoose';
const { String, Boolean } = Schema.Types
import AttributeValue from './AttributeValue';
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
  //属性名称，英文
  name: string;
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

schema.index({ name: 1 });


export const AttributeModel = model<Attribute>(DOCUMENT_NAME, schema, COLLECTION_NAME);