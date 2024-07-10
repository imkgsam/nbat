import { Schema, model, Types } from 'mongoose';
const {  String, Date: SDate, ObjectId} = Schema.Types

export const DOCUMENT_NAME = 'DictValue';
export const COLLECTION_NAME = 'DictValues';



export default interface DictValue {
  _id: Types.ObjectId;
  dict: Types.ObjectId; 

  code: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<DictValue>(
  {
    
    code: {
      type: String,
      reqired: true,
    },
    
  },
  {
    versionKey: false,
    timestamps: true
  },
);

export const DictValueModel = model<DictValue>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
