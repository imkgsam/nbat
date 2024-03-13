import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  departmentId: Joi.object().keys({
    _id: JoiObjectId().required(),
  }),
  departmentCreate: Joi.object().keys({
    name: Joi.string().required().max(50),
    manager: JoiObjectId().allow(null).allow(''),
    parent: JoiObjectId().allow(null).allow(''),
    company: Joi.alternatives(Joi.string().min(3).max(60), JoiObjectId()),
    color: Joi.string().allow(null).allow(''),
    meta: Joi.object().keys({
      enabled: Joi.boolean()
    })
  }),
  departmentUpdate: Joi.object().keys({
    _id: JoiObjectId().required(),
    name: Joi.string().min(3).max(60),
    manager: JoiObjectId().allow(null).allow(''),
    parent: JoiObjectId().allow(null).allow(''),
    color: Joi.string().allow(""),
    company: JoiObjectId().allow(null),
    meta: Joi.object().keys({
      enabled: Joi.boolean()
    })
  }),
};
