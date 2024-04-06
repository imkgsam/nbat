import { Schema, model, Types } from 'mongoose';
const { String,ObjectId } = Schema.Types

export const DOCUMENT_NAME = 'Category';
export const COLLECTION_NAME = 'categories';

export default interface Category {
  _id: Types.ObjectId;
  //类别名称，英文
  name: string;
  parent?: Types.ObjectId;
  meta?:{
    enabled?: boolean;
  }
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Category>(
  {
    name: {
      type: String,
      required: true,
      unique:true,
      trim: true
    },
    parent: {
      type: ObjectId,
      ref: 'Category'
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
      default: new Date()
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      default: new Date()
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ name: 1});


export const CategoryModel = model<Category>(DOCUMENT_NAME, schema, COLLECTION_NAME);