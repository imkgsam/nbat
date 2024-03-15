import Joi from 'joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  attribute:{
    create: Joi.object().keys({
      name: Joi.string().required(),
      code: Joi.string().required(),
      meta: {
        enabled: Joi.boolean()
      }
    }),
    update: Joi.object().keys({
      _id: JoiObjectId().required(),
      name: Joi.string().required(),
      code: Joi.string().required(),
      meta: {
        enabled: Joi.boolean().required()
      }
    }),
    filters:Joi.object().keys({
      currentPage: Joi.number(),
      pageSize: Joi.number(),

      filters: Joi.object().keys({
        name: Joi.string(),
        code: Joi.string(),
        meta: Joi.object().keys({
          enabled: Joi.boolean()
        })
      })
    })
  },
  value:{
    create: Joi.object().keys({
      value: Joi.string().required(),
      abbr: Joi.string().required().max(5),
      attribute: JoiObjectId().required()
    })
  }
};