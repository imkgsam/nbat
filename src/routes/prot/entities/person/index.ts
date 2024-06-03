import express from 'express';
import { SuccessResponse } from '../../../../core/ApiResponse';
import asyncHandler from '../../../../helpers/asyncHandler';
import authorization from '../../../../auth/authorization';
import authentication from '../../../../auth/authentication'
import { RoleCodeEnum } from '../../../../database/model/Role';
import validator from '../../../../helpers/validator';
import schema from '../schema';
import { ProtectedRequest } from 'app-request';
import EntityRepo from '../../../../database/repository/EntityRepo';
import Entity, { EntityTypeEnum } from '../../../../database/model/Entity';

const router = express.Router();

router.get( '/detailedinfo4currentuser',
  authentication,
  asyncHandler(async (req: ProtectedRequest, res) => {
    console.log(req.account._id)
    const entity = await EntityRepo.findEntityDetailedInfoByUserId(req.account._id);
    return new SuccessResponse('success', entity).send(res);
  }),
);

// router.get( '/employee/all',
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req, res) => {
//     const entities = await EntityRepo.findAllwithFilters({employee: {$ne:null}});
//     return new SuccessResponse('success', entities).send(res);
//   }),
// );

// router.post( '/enable',
//   validator(schema.id),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedOne = await EntityRepo.enable(req.body.id)
//     new SuccessResponse('Entity enabled successfully', updatedOne).send(res);
//   }),
// );

// router.post( '/disable',
//   validator(schema.id),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedOne = await EntityRepo.disable(req.body.id)
//     new SuccessResponse('Entity disabled successfully', updatedOne).send(res);
//   }),
// );

// router.post( '/verify',
//   validator(schema.id),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedOne = await EntityRepo.verify(req.body.id)
//     new SuccessResponse('Entity enabled successfully', updatedOne).send(res);
//   }),
// );

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const entities = await EntityRepo.findAllwithFilters({etype: EntityTypeEnum.PERSON});
    return new SuccessResponse('success', entities).send(res);
  }),
);

router.post( '/filters',
  validator(schema.Person.filters),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { filters } = req.body
    const datas = await EntityRepo.Person.filter(filters)
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

router.post( '/',
  validator(schema.Person.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await EntityRepo.Person.create({
      ...req.body
    } as Entity);
    new SuccessResponse('Person created successfully', createdOne).send(res);
  }),
);

router.put( '/',
  validator(schema.Person.update),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await EntityRepo.Person.create({
      ...req.body
    } as Entity);
    new SuccessResponse('Person updated successfully', createdOne).send(res);
  }),
);

export default router;
