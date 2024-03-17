import { Schema, model, Types } from 'mongoose';
const { String,ObjectId } = Schema.Types

export const DOCUMENT_NAME = 'AttributeValue';
export const COLLECTION_NAME = 'attributeValues';

export default interface AttributeValue {
  _id?: Types.ObjectId;
  name: string;
  code: string;
  abbr: string;
  attribute: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<AttributeValue>(
  {
    name: {
      type: String,
      trim: true,
      required:true
    },
    code: {
      type: String,
      trim: true,
      required:true
    },
    abbr:{
      type: String,
      trim: true,
      required: true
    },
    attribute: {
      type: ObjectId,
      ref: 'Attribute',
      required:true
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

schema.index({ name:1, attribute: 1});
schema.index({ abbr:1, attribute: 1});
schema.index({ code:1, attribute: 1});
schema.index({ abbr:1,name:1, code:1, attribute: 1});


export const AttributeValueModel = model<AttributeValue>(DOCUMENT_NAME, schema, COLLECTION_NAME);