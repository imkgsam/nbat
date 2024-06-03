import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/Role';
import validator from '../../../helpers/validator';
import roleSchema from './schema';
import { ProtectedRequest } from 'app-request';
import RoleRepo from '../../../database/repository/RoleRepo';
import Role from '../../../database/model/Role';

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const roles = await RoleRepo.findAll();
    return new SuccessResponse('success', roles).send(res);
  }),
);

router.get( '/allpublic',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const rts = await RoleRepo.filters({'meta.enabled':true});
    return new SuccessResponse('success', rts).send(res);
  }),
);

router.post( '/',
  validator(roleSchema.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdRole = await RoleRepo.create({
      ...req.body
    } as Role);
    new SuccessResponse('Role created successfully', createdRole).send(res);
  }),
);

router.put( '/',
  validator(roleSchema.update),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdRole = await RoleRepo.update({
      ...req.body
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

router.post( '/pfilters',
  validator(roleSchema.filters),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { filters  } = req.body
    const datas = await RoleRepo.filters(filters)
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
