
import { Schema, model, Types } from 'mongoose';
const { Boolean, Date: SDate, ObjectId} = Schema.Types

export const DOCUMENT_NAME = 'GroutHistoryRecord';
export const COLLECTION_NAME = 'GroutHistoryRecords';



export default interface GroutHistoryRecord {
  _id: Types.ObjectId;
  moldItem: Types.ObjectId,
  groudTime: Date;
  meta:{
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<GroutHistoryRecord>(
  {
    moldItem:{
      type: ObjectId,
      required: true,
      ref: 'moldItem'
    },
    groudTime: {
      type: SDate,
      required: true
    },
    meta:{
      enabled: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ groudTime: 1 , moldItem:1 });

export const GroutHistoryRecordModel = model<GroutHistoryRecord>(DOCUMENT_NAME, schema, COLLECTION_NAME);
