import Joi from 'joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  InccodeItem: {
    create: Joi.object().keys({
      ttype: Joi.string().required(),
      num: Joi.number().required(),
      btype: Joi.string().required(),
      item: Joi.string().required(),
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
    pfilters: Joi.object().keys({
      currentPage: Joi.number(),
      pageSize: Joi.number(),

      filters: Joi.object().keys({
        code: Joi.string(),
        meta: Joi.object().keys({
          enabled: Joi.boolean()
        })
      })
    }),
  },
  InccodeType: {
    create: Joi.object().keys({
      code: Joi.string().required(),
      length: Joi.number().min(1),
      startsWith: Joi.string(),
      remark: Joi.string(),
      meta: Joi.object().keys({
        enabled: Joi.boolean()
      })
    }),
    update: Joi.object().keys({
      _id: JoiObjectId().required(),
      code: Joi.string().required(),
      length: Joi.number().required().min(1),
      startsWith: Joi.string(),
      remark: Joi.string(),
      meta: Joi.object().keys({
        enabled: Joi.boolean()
      })
    }),
    pfilters: Joi.object().keys({
      currentPage: Joi.number(),
      pageSize: Joi.number(),

      filters: Joi.object().keys({
        code: Joi.string(),
        meta: Joi.object().keys({
          enabled: Joi.boolean()
        })
      })
    }),
  }
};
