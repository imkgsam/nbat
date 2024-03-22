import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  Route:{
    create: Joi.object().keys({
      path: Joi.string().required().min(3).max(50),
      name: Joi.string(),
      component: Joi.string(),
      redirect: Joi.string(),
      meta: {
        //一二级路由共享属性
        title: Joi.string(),
        icon: Joi.string(),
        showLink: Joi.boolean(),
        rank: Joi.number().allow(null),
  
        //二级路由属性
        extraIcon: Joi.string(),
        showParent: Joi.boolean(),
        roles: Joi.array(),
        auths: Joi.array(),
        auths_options: Joi.array().items(Joi.string()),
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
        enabled: Joi.boolean()
      },
      children: Joi.array(),
      parent: JoiObjectId(),
    }),
    update: Joi.object().keys({
      _id: JoiObjectId().required(),
      path: Joi.string().required().min(3).max(50),
      name: Joi.string(),
      component: Joi.string(),
      redirect: Joi.string(),
      meta: {
        //一二级路由共享属性
        title: Joi.string(),
        icon: Joi.string(),
        showLink: Joi.boolean(),
        rank: Joi.number().allow(null),
  
        //二级路由属性
        extraIcon: Joi.string(),
        showParent: Joi.boolean(),
        roles: Joi.array(),
        auths: Joi.array(),
        auths_options: Joi.array().items(Joi.string()),
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
        enabled: Joi.boolean()
      },
      children: Joi.array(),
      parent: JoiObjectId().allow(null),
    }),
  },
  RouteAuth:{
    create: Joi.object().keys({
      name: Joi.string().required()
    }),
    update: Joi.object().keys({
      _id: JoiObjectId().required(),
      name: Joi.string().required(),
    }),
  },
  RouteAccess:{
    create: Joi.object().keys({
      user: JoiObjectId(),
      role: JoiObjectId(),
      route: JoiObjectId().required(),
      auths: Joi.array().items(JoiObjectId())
    }),
    update: Joi.object().keys({
      _id: JoiObjectId().required(),
      user: JoiObjectId(),
      role: JoiObjectId(),
      route: JoiObjectId().required(),
      auths: Joi.array().items(JoiObjectId())
    }),
  }
};
