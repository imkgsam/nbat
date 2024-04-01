import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/Role';
import validator from '../../../helpers/validator';
import schema from '../schema';
import { ProtectedRequest } from 'app-request';
import BarcodeRepo from '../../../database/repository/BarcodeRepo';
import BarcodeItem from '../../../database/model/barcode/BarcodeItem';

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const all = await BarcodeRepo.BarcodeItem.findAll();
    return new SuccessResponse('success', all).send(res);
  }),
);

router.post( '/',
  validator(schema.BarcodeItem.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await BarcodeRepo.BarcodeItem.create({
      ...req.body
    } as BarcodeItem);
    new SuccessResponse('BarcodeItem created successfully', createdOne).send(res);
  }),
);

router.put( '/',
  validator(schema.BarcodeItem.update),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await BarcodeRepo.BarcodeItem.update({
      ...req.body
    } as BarcodeItem);
    new SuccessResponse('BarcodeItem updated successfully', updatedOne).send(res);
  }),
);

// router.post( '/enable',
//   validator(schema.Id),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedOne = await RoleRepo.enable(req.body.id)
//     new SuccessResponse('Role enabled successfully', updatedOne).send(res);
//   }),
// );

// router.post( '/disable',
//   validator(schema.Id),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedOne = await RoleRepo.disable(req.body.id)
//     new SuccessResponse('Role disabled successfully', updatedOne).send(res);
//   }),
// );

// router.post( '/filters',
//   validator(schema.filters),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     interface Filters {
//       code?: string,
//       meta?:{
//         enabled: boolean
//       }
//     }
//     const { filters  } = req.body
//     const datas = await RoleRepo.filter(filters as Filters)
//     let {currentPage, pageSize} = req.body
//     if(!currentPage || currentPage<=0){
//       currentPage = 1
//     }
//     if(!pageSize || pageSize <=0){
//       pageSize = 10
//     }
//     const rt = datas.slice(pageSize*(currentPage-1),currentPage*pageSize)
//     new SuccessResponse('success', {
//       list: rt,
//       total: datas.length,
//       pageSize: pageSize,
//       currentPage: currentPage 
//     }).send(res);
//   }),
// );


export default router;
