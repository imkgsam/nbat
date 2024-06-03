import Joi from 'joi';
import { JoiObjectId } from '../../../../helpers/validator';

export default {
  id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  update: Joi.object().keys({
    _id: JoiObjectId().required(),
    accountName: Joi.string().required().min(2),
  }),
};