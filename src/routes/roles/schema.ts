import Joi from 'joi';
import { JoiObjectId, JoiUrlEndpoint } from '../../helpers/validator';

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  create: Joi.object().keys({
    code: Joi.string().required().min(3).max(40)
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
