import Joi from 'joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  Person:{
    create: Joi.object().keys({
      name: Joi.string().required().min(2),
      alias: Joi.string().min(2),
      scompany: JoiObjectId(),
      personal:{
        jobTitle: Joi.string(),
        sex: Joi.string(),
        birth: Joi.date()
      },
      common:{
        website: Joi.string(),
        email: Joi.string(),
        landline: Joi.string(),
        mobilePhone: Joi.string(),
        country: Joi.string(),
        city: Joi.string(),
        industry: Joi.string(),
        internalNote: Joi.string()
      },
      socialMedias: Joi.array().optional().items(
        Joi.object().keys({
          key: Joi.string().required(), 
          value: Joi.string().required()
        })
      ),
      meta: Joi.object().keys({
        enabled: Joi.boolean(),
        verified: Joi.boolean(),
        isSupplier: Joi.boolean(),
        isCustomer: Joi.boolean()
      })
    }),
    filters: Joi.object().keys({
      currentPage: Joi.number(),
      pageSize: Joi.number(),
  
      filters: Joi.object().keys({
        code: Joi.string(),
        meta: Joi.object().keys({
          enabled: Joi.boolean(),
          verified: Joi.boolean()
        })
      })
    }),
  },
  Company:{
    create: Joi.object().keys({
      name: Joi.string().required().min(2),
      alias: Joi.string().optional().min(2),
      enterprise:{
        manager: JoiObjectId().optional(),
        foundedAt: Joi.date().optional(),
        taxNum: Joi.string().optional()
      },
      common:{
        website: Joi.string().optional(),
        email: Joi.string().optional(),
        landline: Joi.string().optional(),
        mobilePhone: Joi.string().optional(),
        country: Joi.string().optional(),
        city: Joi.string().optional(),
        industry: Joi.string().optional(),
        internalNote: Joi.string().optional()
      },
      socialMedias: Joi.array().optional().items(
        Joi.object().keys({
          key: Joi.string().required(), 
          value: Joi.string().required()
        })
      )
    }),
    filters: Joi.object().keys({
      currentPage: Joi.number(),
      pageSize: Joi.number(),
  
      filters: Joi.object().keys({
        code: Joi.string(),
        meta: Joi.object().keys({
          enabled: Joi.boolean(),
          verified: Joi.boolean()
        })
      })
    }),
  }
};
