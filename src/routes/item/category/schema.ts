import Joi from 'joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  create: Joi.object().keys({
    name: Joi.string().required(),
    parent: JoiObjectId()
  })
};