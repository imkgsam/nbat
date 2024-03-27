import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/Role';
import validator from '../../../helpers/validator';
import barcodeSchema from '../schema';
import { ProtectedRequest } from 'app-request';
import BarcodeRepo from '../../../database/repository/BarcodeRepo';
import BarcodeType from '../../../database/model/BarcodeType';

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const roles = await BarcodeRepo.BarcodeType.findAll();
    return new SuccessResponse('success', roles).send(res);
  }),
);

router.post( '/',
  validator(barcodeSchema.BarcodeType.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdRole = await BarcodeRepo.BarcodeType.create({
      ...req.body
    } as BarcodeType);
    new SuccessResponse('Barcode Type created successfully', createdRole).send(res);
  }),
);

router.put( '/',
  validator(barcodeSchema.BarcodeType.update),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdRole = await BarcodeRepo.BarcodeType.update({
      ...req.body
    } as BarcodeType);
    new SuccessResponse('Barcode Type created successfully', createdRole).send(res);
  }),
);

router.post( '/enable',
  validator(barcodeSchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await BarcodeRepo.BarcodeType.enable(req.body.id)
    new SuccessResponse('Barcode Type enabled successfully', updatedOne).send(res);
  }),
);

router.post( '/disable',
  validator(barcodeSchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await BarcodeRepo.BarcodeType.disable(req.body.id)
    new SuccessResponse('Barcode Type disabled successfully', updatedOne).send(res);
  }),
);

// router.post( '/filters',
//   validator(barcodeSchema.BarcodeType.pfilters),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     interface Filters {
//       code?: string,
//       meta?:{
//         enabled: boolean
//       }
//     }
//     const { filters  } = req.body
//     const datas = await BarcodeRepo.filter(filters as Filters)
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
