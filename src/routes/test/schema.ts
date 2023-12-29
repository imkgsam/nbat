import Joi from 'joi';
import { JoiObjectId, JoiUrlEndpoint } from '../../helpers/validator';

export default {
  routeId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  routeCreate: Joi.object().keys({
    path: Joi.string().required().min(3).max(50),
    name: Joi.string(),
    component: Joi.string(),
    redirect: Joi.string(),
    meta: {
      //一二级路由共享属性
      title: Joi.string(),
      icon: Joi.string(),
      showLink: Joi.boolean(),
      rank: Joi.number(),

      //二级路由属性
      extraIcon: Joi.string(),
      showParent: Joi.boolean(),
      roles: Joi.array(),
      auths: Joi.array(),
      keepAlive: Joi.boolean(),
      frameSrc: Joi.string(),
      frameLoading: Joi.boolean(),
      transition: Joi.object().keys({
        name: Joi.string(),
        enterTransition: Joi.string(),
        leaveTransition: Joi.string(),
      }),
      hiddenTag: Joi.boolean(),
      dynamicLevel: Joi.number(),
      activePath: Joi.string(),
    },
    children: Joi.array(),
    parent: JoiObjectId(),
  }),
};
