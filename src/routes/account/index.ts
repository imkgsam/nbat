import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import authorization from '../../auth/authorization';
import { RoleCodeEnum } from '../../database/model/Role';
import AccountRepo from '../../database/repository/AccountRepo';
import schema from './schema'

import validator, { ValidationSourceEnum } from '../../helpers/validator';
import { ProtectedRequest } from 'app-request';
import Account from '../../database/model/Account';

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const users = await AccountRepo.findAll();
    return new SuccessResponse('success', users).send(res);
  })
);


router.get( '/get-user-list',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const users = await AccountRepo.filters({'meta.verified':true,'meta.enabled':true});
    return new SuccessResponse('success', users).send(res);
  })
);

/**
 * 更新账户基本信息，不涉及roles 以及登录邮箱
 */
router.put('/',
  validator(schema.update),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await AccountRepo.update({...req.body} as Account);
    return new SuccessResponse('Account updated', {...updatedOne,roles: updatedOne?.roles.map(each=> each.code)}).send(res);
  }),
);



export default router;
