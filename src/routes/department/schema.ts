import Joi from 'joi';
import { JoiObjectId, JoiUrlEndpoint } from '../../helpers/validator';

export default {
  departmentId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  departmentCreate: Joi.object().keys({
    name: Joi.string().optional().min(3).max(60),
    manager: Joi.alternatives(Joi.string().optional().min(3).max(60),JoiObjectId().optional()),
    parent: Joi.alternatives(Joi.string().optional().min(3).max(60),JoiObjectId().optional())
  }),
  departmentUpdate: Joi.object().keys({
    id: JoiObjectId().required(),
    name: Joi.string().optional().min(3).max(60),
    manager: Joi.alternatives(Joi.string().optional().min(3).max(60),JoiObjectId().optional()),
    parent: Joi.alternatives(Joi.string().optional().min(3).max(60),JoiObjectId().optional())
  }),
};

