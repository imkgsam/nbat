import Joi from 'joi';
import { JoiObjectId, JoiUrlEndpoint } from '../../../helpers/validator';

export default {
  id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  createPerson: Joi.object().keys({
    name: Joi.string().required().min(2),
    alias: Joi.string().optional().min(2),
    personal:{
      jobTitle: Joi.string().optional(),
      sex: Joi.string().optional(),
      birth: Joi.date().optional()
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
  createCompany: Joi.object().keys({
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
  })
};
