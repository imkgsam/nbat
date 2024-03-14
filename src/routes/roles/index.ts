import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import authorization from '../../auth/authorization';
import { RoleCodeEnum } from '../../database/model/Role';
import validator from '../../helpers/validator';
import roleSchema from './schema';
import { ProtectedRequest } from 'app-request';
import RoleRepo from '../../database/repository/RoleRepo';
import Role from '../../database/model/Role';

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const roles = await RoleRepo.findAll();
    return new SuccessResponse('success', roles).send(res);
  }),
);

router.post( '/',
  validator(roleSchema.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdRole = await RoleRepo.create({
      code: req.body.code,
      meta:{
        enabled:false
      }
    } as Role);
    new SuccessResponse('Role created successfully', createdRole).send(res);
  }),
);

router.post( '/enable',
  validator(roleSchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await RoleRepo.enable(req.body.id)
    new SuccessResponse('Role enabled successfully', updatedOne).send(res);
  }),
);

router.post( '/disable',
  validator(roleSchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await RoleRepo.disable(req.body.id)
    new SuccessResponse('Role disabled successfully', updatedOne).send(res);
  }),
);

router.post( '/filters',
  validator(roleSchema.filters),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    interface Filters {
      code?: string,
      meta?:{
        enabled: boolean
      }
    }
    const { filters  } = req.body
    console.log(filters)
    const datas = await RoleRepo.filter(filters as Filters)
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


export default router;
