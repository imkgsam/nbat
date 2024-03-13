import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import schema from './schema';
import authorization from '../../auth/authorization';
import { RoleCodeEnum } from '../../database/model/Role';
import ItemRepo from "../../database/repository/ItemRepo"
import validator, { ValidationSourceEnum } from '../../helpers/validator';
import { ProtectedRequest } from 'app-request';
import Item from '../../database/model/Item';
import CategoryRoute from './category'

const router = express.Router();

router.get(
  '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const data = await ItemRepo.findAll({})
    return new SuccessResponse('success', data).send(res);
  }),
);

router.post( '/',
  validator(schema.item.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await ItemRepo.create({
      code: req.body.code,
      category: req.body.category,
      etype: req.body.etype,
      attributes: req.body?.attributes,
      meta: { 
        enabled: req.body.meta?.enabled || false,
        isStockable: req.body.meta?.isStockable || false,
        canBeSold: req.body.meta?.canBeSold || false,
        canBePurchased: req.body.meta?.canBePurchased || false,
        canBenProduced: req.body.meta?.canBenProduced || false,
        hasVariants: req.body.meta?.hasVariants || false,
        isVariantOf: req.body.meta?.isVariantOf
       }
    } as Item);
    new SuccessResponse('Item created successfully', createdOne).send(res);
  }),
);

router.use('/category',CategoryRoute)


export default router;
