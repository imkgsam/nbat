import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  create: Joi.object().keys({
    name: Joi.string().required(),
    ltype: Joi.string().required(),
    company: JoiObjectId().required(),
    parent: JoiObjectId(),
    meta: Joi.object().keys({
      enabled: Joi.boolean(),
      isStorable: Joi.boolean()
    })
  }),
  update: Joi.object().keys({
    _id: JoiObjectId().required(),
    name: Joi.string().required(),
    ltype: Joi.string().required(),
    company: JoiObjectId().required(),
    parent: JoiObjectId(),
    meta: Joi.object().keys({
      enabled: Joi.boolean(),
      isStorable: Joi.boolean()
    })
  }),
};
