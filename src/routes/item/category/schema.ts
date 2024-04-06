import Joi from 'joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  create: Joi.object().keys({
    name: Joi.string().required(),
    parent: JoiObjectId(),
    meta: Joi.object().keys({
      enabled: Joi.boolean()
    })
  }),
  update: Joi.object().keys({
    _id: JoiObjectId().required(),
    name: Joi.string().required(),
    parent: JoiObjectId(),
    meta: Joi.object().keys({
      enabled: Joi.boolean()
    })
  })
};