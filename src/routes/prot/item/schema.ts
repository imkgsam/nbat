import Joi from 'joi';
import { JoiObjectId } from '../../../helpers/validator';
import { itemTypeEnum } from '../../../database/model/product/Template'


const attributeItem = Joi.object().keys({
  _id: JoiObjectId(),
  attribute: JoiObjectId().required(),
  options: Joi.array().items(JoiObjectId())
})

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  item:{
    create: Joi.object().keys({
      code: Joi.string().required(),
      alias: Joi.string(),
      category: JoiObjectId().required(),
      etype: Joi.string().required().valid(...Object.values(itemTypeEnum)),
      meta: {
        enabled: Joi.boolean(),
        canBeStocked: Joi.boolean(),
        canBeSold: Joi.boolean(),
        canBePurchased: Joi.boolean(),
        canBeProduced: Joi.boolean(),
        canBeRented: Joi.boolean(),
        hasVariants: Joi.boolean(),
        isVariantOf: JoiObjectId()
      },
      mold:{
        maxGroutingTimes: Joi.number(),
        warningThreadhold: Joi.number(),
        product: JoiObjectId(),
        mtype: Joi.string()
      },
      attributes: Joi.array().items(attributeItem),
    }),
    update: Joi.object().keys({
      _id: JoiObjectId().required(),
      code: Joi.string().required(),
      alias: Joi.string(),
      category: JoiObjectId().required(),
      etype: Joi.string().required().valid(...Object.values(itemTypeEnum)),
      meta: {
        enabled: Joi.boolean(),
        canBeStocked: Joi.boolean(),
        canBeSold: Joi.boolean(),
        canBePurchased: Joi.boolean(),
        canBeProduced: Joi.boolean(),
        canBeRented: Joi.boolean(),
        hasVariants: Joi.boolean(),
        isVariantOf: JoiObjectId()
      },
      mold:{
        maxGroutingTimes: Joi.number(),
        warningThreadhold: Joi.number(),
        product: JoiObjectId(),
        mtype: Joi.string()
      },
      attributes: Joi.array().items(attributeItem),
    }),
    pfilters: Joi.object().keys({
      currentPage: Joi.number(),
      pageSize: Joi.number(),

      filters: Joi.object().keys({
        code: Joi.string(),
        meta: Joi.object().keys({
          enabled: Joi.boolean()
        })
      })
    }),
  }
};