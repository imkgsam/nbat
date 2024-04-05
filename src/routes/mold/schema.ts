import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  MoldItem: {
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
  MoldGroup: {
    create: Joi.object().keys({
      name: Joi.string().required(),
      manager: JoiObjectId().required(),
      mtype: Joi.string().required(),
      workers: Joi.array().items(JoiObjectId()),
      department: JoiObjectId().required(),
      location: JoiObjectId().required(),
      meta: Joi.object().keys({
        enabled: Joi.boolean()
      })
    }),
    update: Joi.object().keys({
      _id: JoiObjectId().required(),
      name: Joi.string().required(),
      mtype: Joi.string().required(),
      manager: JoiObjectId().required(),
      workers: Joi.array().items(JoiObjectId()),
      department: JoiObjectId().required(),
      location: JoiObjectId().required(),
      meta: Joi.object().keys({
        enabled: Joi.boolean()
      })
    }),
    pfilters: Joi.object().keys({
      currentPage: Joi.number(),
      pageSize: Joi.number(),

      filters: Joi.object().keys({
        name: Joi.string(),
        mtype: Joi.string(),
        manager: JoiObjectId(),
        workers: Joi.array().items(JoiObjectId()),
        location: JoiObjectId(),
        department: JoiObjectId(),
        meta: Joi.object().keys({
          enabled: Joi.boolean()
        })
      })
    }),
  }
};
