import { Schema, model, Types } from 'mongoose';
const { Boolean, String, Date: SDate, Number, ObjectId} = Schema.Types

export const DOCUMENT_NAME = 'InccodeItem';
export const COLLECTION_NAME = 'inccodeItems';

export default interface InccodeItem {
  _id: Types.ObjectId;
  // Inccode 类型
  btype: Types.ObjectId;
  // schema 类型
  ttype: string;
  num: number;
  item: Types.ObjectId;
  meta:{
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<InccodeItem>(
  {
    btype:{
      type: ObjectId,
      required: true,
      ref: 'InccodeType'
    },
    num:{
      type: Number,
      required: true,
      min: 1
    },
    ttype: {
      type: String,
      requied: true,
      trim:true
    },
    item: {
      type: ObjectId,
      required: true,
      ref: function(){
        return this.ttype
      }
    },
    meta:{
      enabled: {
        type: Boolean,
        default: false
      },
    },
    createdAt: {
      type: Date,
      required: true,
      default: new Date()
    },
    updatedAt: {
      type: SDate,
      required: true,
      default: new Date()
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ num: 1, btype: 1 });
schema.index({ num: 1, item: 1 });

export const InccodeItemModel = model<InccodeItem>(DOCUMENT_NAME, schema, COLLECTION_NAME);
