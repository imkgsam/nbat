import express from 'express';
import { SuccessResponse } from '../../../../core/ApiResponse';
import asyncHandler from '../../../../helpers/asyncHandler';
import authorization from '../../../../auth/authorization';
import authentication from '../../../../auth/authentication'
import { RoleCodeEnum } from '../../../../database/model/workon/Role';
import validator from '../../../../helpers/validator';
import schema from '../schema';
import { ProtectedRequest } from 'app-request';
import EntityRepo from '../../../../database/repository/EntityRepo';
import Entity, { EntityTypeEnum } from '../../../../database/model/finished/Entity';

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const entities = await EntityRepo.findAllwithFilters({'meta.isCustomer': true});
    return new SuccessResponse('success', entities).send(res);
  }),
);

// router.get( '/allpublic',
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req, res) => {
//     const rts = await EntityRepo.findAllwithFilters({etype: EntityTypeEnum.COMPANY,'meta.enabled':true,'meta.verified':true});
//     return new SuccessResponse('success', rts).send(res);
//   }),
// );

// router.post( '/filters',
//   validator(schema.Company.filters),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const { filters  } = req.body
//     const datas = await EntityRepo.Company.filter(filters)
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

// router.post( '/',
//   validator(schema.Company.create),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req, res) => {
//     const createdOne = await EntityRepo.Company.create({
//       name: req.body.name,
//       alias: req.body.alias,
//       enterprise:{
//         manager: req.body.enterprise?.manager,
//         foundedAt: req.body.enterprise?.foundedAt,
//         taxNum: req.body.enterprise?.taxNum
//       },
//       common:{
//         website: req.body.common?.website,
//         email:  req.body.common?.email,
//         landline:  req.body.common?.landline,
//         mobilePhone:  req.body.common?.mobilePhone,
//         country:  req.body.common?.country,
//         city:  req.body.common?.city,
//         industry:  req.body.common?.industry,
//         internalNote:  req.body.common?.internalNote
//       },
//       socialMedias: req.body.socialMedias
//     } as Entity)
//     return new SuccessResponse('success', createdOne).send(res);
//   }),
// );

export default router;
