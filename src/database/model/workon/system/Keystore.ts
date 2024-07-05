import { Schema, model, Types } from 'mongoose';
import Account from '../../finished/Account';
import { tokenInfo } from '../../../../config'

export const DOCUMENT_NAME = 'Keystore';
export const COLLECTION_NAME = 'keystores';

export default interface Keystore {
  _id: Types.ObjectId;
  client: Account;
  primaryKey: string;
  secondaryKey: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Keystore>(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Account',
    },
    primaryKey: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    secondaryKey: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Schema.Types.Date,
      default: new Date(),
      required: true,
      select: false,
      expires: tokenInfo.accessTokenValidity + tokenInfo.refreshTokenValidity
    },
    updatedAt: {
      type: Schema.Types.Date,
      default: new Date(),
      required: true,
      select: false

    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);

schema.index({ client: 1 });
schema.index({ client: 1, primaryKey: 1, status: 1 });
schema.index({ client: 1, primaryKey: 1, secondaryKey: 1 });

export const KeystoreModel = model<Keystore>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
