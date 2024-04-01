import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  BarcodeItem: {
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
  BarcodeType: {
    create: Joi.object().keys({
      code: Joi.string().required(),
      length: Joi.number().min(6),
      startsWith: Joi.string(),
      remark: Joi.string(),
      meta: Joi.object().keys({
        enabled: Joi.boolean()
      })
    }),
    update: Joi.object().keys({
      _id: JoiObjectId().required(),
      code: Joi.string().required(),
      length: Joi.number().required().min(6),
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
  },





};
