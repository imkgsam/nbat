import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import crypto from 'crypto';
import UserRepo from '../../database/repository/AccountRepo';
import { BadRequestError, AuthFailureError } from '../../core/ApiError';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import EntityRepo from '../../database/repository/EntityRepo';
import { createTokens } from '../../auth/authUtils';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { getUserData } from './utils';
import { PublicRequest } from '../../types/app-request';
import Logger from '../../core/Logger';
import { ProtectedRequest } from 'app-request';
import { SuccessMsgResponse } from '../../core/ApiResponse';
import authentication from '../../auth/authentication';
import User from '../../database/model/Account';
import { RoleRequest } from 'app-request';
import { RoleCodeEnum } from '../../database/model/Role';

const router = express.Router();

/**
 * 获取当前用户的详细资料
 */
router.get( '/detail',
  authentication,
  asyncHandler(async (req: ProtectedRequest, res) => {
    console.log(req.user._id)
    const entity = await EntityRepo.findEntityDetailedInfoByUserId(req.user._id);
    return new SuccessResponse('success', entity).send(res);
  }),
);

/**
 * 用户登出账户
 */
router.delete(
  '/logout',
  authentication,
  asyncHandler(async (req: ProtectedRequest, res) => {
    await KeystoreRepo.remove(req.keystore._id);
    new SuccessMsgResponse('Logout success').send(res);
  }),
);

/**
 * 用户在登录的状态下修改密码
 */
router.post(
  '/password/change',
  authentication,
  validator(schema.changePassword),
  asyncHandler(async (req: PublicRequest, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError('User not Found');
    const match = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!match) throw new AuthFailureError('Authentication failure');
    const newPasswordHash = await bcrypt.hash(req.body.newPassword, 10);
    const newUser = await UserRepo.changePassword(req.body.email,newPasswordHash)
    const userData = await getUserData(newUser as User);
    new SuccessResponse('operation Success', {
      user:{
        ...userData,
      },
    }).send(res);
  }),
);


export default router;