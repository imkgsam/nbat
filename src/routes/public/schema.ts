import Joi from 'joi';
import { JoiAuthBearer } from '../../helpers/validator';

export default {
  credential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),
  changePassword: Joi.object().keys({
    email: Joi.string().required().email(),
    oldPassword: Joi.string().required().min(6),
    newPassword: Joi.string().required().min(6)
  }),
  forgetPassword_submit: Joi.object().keys({
    method: Joi.string().required().valid('Email','Phone'),
    account: Joi.string().required()
  }),
  forgetPassword_verify: Joi.object().keys({
    method: Joi.string().required().valid('Email','Phone'),
    account: Joi.string().required(),
    code: Joi.string().length(6).required()
  }),
  forgetPassword_reset: Joi.object().keys({
    method: Joi.string().required().valid('Email','Phone'),
    account: Joi.string().required(),
    code: Joi.string().length(6).required(),
    newPassword: Joi.string().required().min(6)
  }),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
  signup: Joi.object().keys({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
};
