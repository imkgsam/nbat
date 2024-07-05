import { Schema, model, Types } from 'mongoose';
const {  String, Date: SDate} = Schema.Types

export const DOCUMENT_NAME = 'VerificationCode';
export const COLLECTION_NAME = 'VerificationCodes';
import { verificationCodeInfo } from '../../../../config'


export enum OperationsEnum {
  ForgetPassword = 'ForgetPassword',
}

export enum VerificationMethodsEnum {
  Email = 'Email',
  Phone = 'Phone'
}

export default interface VerificationCode {
  _id: Types.ObjectId;
  method: VerificationMethodsEnum;
  account: string; //email address or phone number
  code: string;
  operation: OperationsEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<VerificationCode>(
  {
    method: {
      type: String,
      required: true,
      enum: Object.values(VerificationMethodsEnum)
    },
    account: {
      type: String,
      required: true
    },
    code: {
      type: String,
      reqired: true,
    },
    operation: {
      type: String,
      enum: Object.values(OperationsEnum),
      required: true
    },
    createdAt: {
      type: SDate,
      default: new Date(),
      required: true,
      select: false,
      expires: verificationCodeInfo.codeValidity
    },
    updatedAt: {
      type: SDate,
      default: new Date(),
      required: true,
      select: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  },
);

export const VerificationCodeModel = model<VerificationCode>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
