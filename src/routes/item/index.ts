import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import schema from './schema';
import authorization from '../../auth/authorization';
import { RoleCodeEnum } from '../../database/model/Role';
import ItemRepo from "../../database/repository/ItemRepo"
import validator, { ValidationSourceEnum } from '../../helpers/validator';
import { ProtectedRequest } from 'app-request';
import Item from '../../database/model/item/Item';
import CategoryRoute from './category'
import AttributeRoute from './attribute'

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const all = await ItemRepo.findAll();
    return new SuccessResponse('success', all).send(res);
  }),
);

router.get( '/variant/all',
validator(schema.Id, ValidationSourceEnum.QUERY),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    console.log(req?.query?.id)
    const all = await ItemRepo.filters({'meta.isVariantOf': req?.query?.id});
    return new SuccessResponse('success', all).send(res);
  }),
);

router.post( '/',
  validator(schema.item.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await ItemRepo.create({...req.body} as Item);
    new SuccessResponse('Item created successfully', createdOne).send(res);
  }),
);

router.get(
  '/detail',
  validator(schema.Id, ValidationSourceEnum.QUERY),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const { id }  = req.query
    const data = await ItemRepo.detail(id as string)
    return new SuccessResponse('success', data).send(res);
  }),
);

router.put( '/',
  validator(schema.item.update),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await ItemRepo.update({...req.body} as Item);
    new SuccessResponse('Item updated successfully', updatedOne).send(res);
  }),
);

router.post( '/enable',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await ItemRepo.enable(req.body.id)
    new SuccessResponse('Item enabled successfully', updatedOne).send(res);
  }),
);

router.post( '/disable',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await ItemRepo.disable(req.body.id)
    new SuccessResponse('Item disabled successfully', updatedOne).send(res);
  }),
);

router.post( '/pfilters',
  validator(schema.item.pfilters),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { filters  } = req.body
    const datas = await ItemRepo.filters(filters)
    let {currentPage, pageSize} = req.body
    if(!currentPage || currentPage<=0){
      currentPage = 1
    }
    if(!pageSize || pageSize <=0){
      pageSize = 10
    }
    const rt = datas.slice(pageSize*(currentPage-1),currentPage*pageSize)
    new SuccessResponse('success', {
      list: rt,
      total: datas.length,
      pageSize: pageSize,
      currentPage: currentPage 
    }).send(res);
  }),
);

router.use('/category',CategoryRoute)
router.use('/attribute',AttributeRoute)

export default router;
