import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import authorization from '../../auth/authorization';
import { RoleCodeEnum } from '../../database/model/Role';
import validator from '../../helpers/validator';
import schema from './schema';
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
  validator(schema.roleCreate),
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
  validator(schema.roleId),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await RoleRepo.enable(req.body.id)
    new SuccessResponse('Role enabled successfully', updatedOne).send(res);
  }),
);

router.post( '/disable',
  validator(schema.roleId),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await RoleRepo.disable(req.body.id)
    new SuccessResponse('Role disabled successfully', updatedOne).send(res);
  }),
);

export default router;
