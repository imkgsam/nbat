import { Schema, model, Types } from 'mongoose';

const { Boolean, String, Date: SDate, ObjectId} = Schema.Types

export const DOCUMENT_NAME = 'RouteAccess';
export const COLLECTION_NAME = 'RouteAccessControl';

export enum RoleCodeEnum {
  LEARNER = 'learner',
  WRITER = 'writer',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

export default interface RouteAccess {
  _id?: Types.ObjectId;
  user?: Types.ObjectId;
  role?: Types.ObjectId;
  route: Types.ObjectId;
  auths: Array<Types.ObjectId>;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<RouteAccess>(
  {
    user: {
      type: ObjectId,
      ref: 'User'
    },
    role:{
      type: ObjectId,
      ref: 'Role'
    },
    route:{
      type: ObjectId,
      ref: 'Route'
    },
    auths:{
      type: [
        {
          type:ObjectId,
          ref:'RouteAuth'
        }
      ],
      required:true
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

schema.index({ user:1, role:1, route:1 });

schema.pre('validate', function (next) {
  if((this.user && this.role) || (!this.user && !this.role))
      return next(new Error("At least and Only one field(user, role) should be populated"))
  next()
})

export const RouteAccessModel = model<RouteAccess>(DOCUMENT_NAME, schema, COLLECTION_NAME);
