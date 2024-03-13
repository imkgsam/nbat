import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  attribute:{
    create: Joi.object().keys({
      name: Joi.string().required(),
      meta: {
        enabled: Joi.boolean()
      }
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