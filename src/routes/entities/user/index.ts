import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import authentication from '../../../auth/authentication'
import { RoleCodeEnum } from '../../../database/model/Role';
import validator from '../../../helpers/validator';
import schema from './schema';
import { ProtectedRequest } from 'app-request';
import EntityRepo from '../../../database/repository/EntityRepo';
import UserRepo from '../../../database/repository/UserRepo';
import Entity, { EntityTypeEnum } from '../../../database/model/Entity';
import User, { UserModel } from '../../../database/model/User'

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const users = await UserRepo.findAll();
    return new SuccessResponse('success', users).send(res);
  })
);


router.get( '/get-user-list',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const users = await UserRepo.filters({'meta.verified':true,'meta.enabled':true});
    return new SuccessResponse('success', users).send(res);
  })
);


export default router;
