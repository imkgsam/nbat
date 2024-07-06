import Joi from 'joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  updateAccountProfile: Joi.object().keys({
    _id: JoiObjectId().required(),
    accountName: Joi.string().required().min(2),
  }),
  updateBinding: Joi.object().keys({
    method: Joi.string().required(),
    account: Joi.string().required()
  }),
  verifyupdateBinding: Joi.object().keys({
    method: Joi.string().required(),
    account: Joi.string().required(),
    code: Joi.string().length(6).required()
  }),
};