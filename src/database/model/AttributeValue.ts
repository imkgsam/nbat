import { Schema, model, Types } from 'mongoose';
const { String,ObjectId } = Schema.Types

export const DOCUMENT_NAME = 'AttributeValue';
export const COLLECTION_NAME = 'attributeValues';

export default interface AttributeValue {
  _id: Types.ObjectId;
  value: string;
  abbr: string;
  attribute: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<AttributeValue>(
  {
    value: {
      type: String,
      trim: true
    },
    abbr:{
      type: String,
      trim: true
    },
    attribute: {
      type: ObjectId,
      ref: 'Attribute'
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

schema.index({ value:1, attribute: 1});
schema.index({ abbr:1, attribute: 1});
schema.index({ abbr:1,value:1,attribute: 1});


export const AttributeValueModel = model<AttributeValue>(DOCUMENT_NAME, schema, COLLECTION_NAME);