import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  departmentId: Joi.object().keys({
    _id: JoiObjectId().required(),
  }),
  departmentCreate: Joi.object().keys({
    name: Joi.string().required().min(3).max(60),
    manager: Joi.alternatives(Joi.string().min(3).max(60), JoiObjectId()),
    parent: Joi.alternatives(Joi.string().min(3).max(60), JoiObjectId()),
    company: Joi.alternatives(Joi.string().min(3).max(60), JoiObjectId()),
    color: Joi.string().required(),
  }),
  departmentUpdate: Joi.object().keys({
    _id: JoiObjectId().required(),
    name: Joi.string().min(3).max(60),
    manager: JoiObjectId(),
    parent: JoiObjectId(),
    color: Joi.string(),
    company: JoiObjectId(),
  }),
};
