import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/Role';
import validator from '../../../helpers/validator';
import schema from '../schema';
import { ProtectedRequest } from 'app-request';
import InccodeRepo from '../../../database/repository/InccodeRepo';
import InccodeItem from '../../../database/model/inccode/InccodeItem';

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const all = await InccodeRepo.InccodeItem.findAll();
    return new SuccessResponse('success', all).send(res);
  }),
);

router.post( '/',
  validator(schema.InccodeItem.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await InccodeRepo.InccodeItem.create({
      ...req.body
    } as InccodeItem);
    new SuccessResponse('InccodeItem created successfully', createdOne).send(res);
  }),
);

router.put( '/',
  validator(schema.InccodeItem.update),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await InccodeRepo.InccodeItem.update({
      ...req.body
    } as InccodeItem);
    new SuccessResponse('InccodeItem updated successfully', updatedOne).send(res);
  }),
);

router.post( '/pfilters',
  validator(schema.InccodeItem.pfilters),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { filters } = req.body
    const datas = await InccodeRepo.InccodeItem.filters(filters)
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
