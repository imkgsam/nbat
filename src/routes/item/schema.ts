import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';
import { itemTypeEnum } from '../../database/model/Item'


const attributeItem = Joi.object().keys({
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
      category: JoiObjectId().required(),
      etype: Joi.string().required().valid(...Object.values(itemTypeEnum)),
      attributes: Joi.array().items(attributeItem),
      meta: {
        enabled: Joi.boolean(),
        isStockable: Joi.boolean(),
        canBeSold: Joi.boolean(),
        canBePurchased: Joi.boolean(),
        canBenProduced: Joi.boolean(),
        hasVariants: Joi.boolean(),
        isVariantOf: JoiObjectId()
      }
    })
  }
};