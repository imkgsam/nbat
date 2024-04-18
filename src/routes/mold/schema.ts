import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';
import { MoldGroupStatusEnum } from '../../database/model/mold/MoldGroup'
export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  MoldItem: {
    create: Joi.object().keys({
      supplier: JoiObjectId().required(),
      attributes: Joi.array().items(Joi.object().keys({
        attribute: JoiObjectId().required(),
        options: Joi.array().required().items(JoiObjectId())
      })),
      mtype: Joi.string().required(),
      group: Joi.object().keys({
        moldGroup: JoiObjectId(),
        index: Joi.number()
      }),
      maxGroutingTimes: Joi.number(),
      initialGroutingTimes: Joi.number(),
      warningThreadhold: Joi.number(),
      location: JoiObjectId(),

      meta: Joi.object().keys({
        enabled: Joi.boolean(),
        batch: Joi.string()
      }),
      remark: Joi.string()
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
      mtype: Joi.string().required(),
      workers: Joi.array().items(JoiObjectId()),
      department: JoiObjectId().required(),
      location: JoiObjectId().required(),
      manager: JoiObjectId().required(),
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
        enabled: Joi.boolean(),
        status: Joi.string().valid(...Object.values(MoldGroupStatusEnum))
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
