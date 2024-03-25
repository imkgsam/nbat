import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  create: Joi.object().keys({
    code: Joi.string().required(),
    meta: Joi.object().keys({
      enabled: Joi.boolean()
    })
  }),
  update: Joi.object().keys({
    _id: JoiObjectId().required(),
    code: Joi.string().required(),
    meta: Joi.object().keys({
      enabled: Joi.boolean()
    })
  }),
  filters: Joi.object().keys({
    currentPage: Joi.number(),
    pageSize: Joi.number(),

    filters: Joi.object().keys({
      code: Joi.string(),
      meta: Joi.object().keys({
        enabled: Joi.boolean()
      })
    })
  }),
};
