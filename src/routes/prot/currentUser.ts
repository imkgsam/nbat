import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import AccountRepo from '../../database/repository/AccountRepo';
import { BadRequestError, AuthFailureError } from '../../core/ApiError';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import EntityRepo from '../../database/repository/EntityRepo';
import validator from '../../helpers/validator';
import schema from '../public/schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { getUserData } from '../public/utils';
import { PublicRequest } from '../../types/app-request';
import { ProtectedRequest } from 'app-request';
import { SuccessMsgResponse } from '../../core/ApiResponse';
import Account from '../../database/model/finished/Account';

const router = express.Router();

/**
 * 获取当前用户的详细资料
 */
router.get( '/detail',
  asyncHandler(async (req: ProtectedRequest, res) => {
    console.log(req.account._id)
    const entity = await EntityRepo.findEntityDetailedInfoByUserId(req.account._id);
    return new SuccessResponse('success', entity).send(res);
  }),
);

/**
 * 用户登出账户
 */
router.delete(
  '/logout',
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
  validator(schema.changePassword),
  asyncHandler(async (req: PublicRequest, res) => {
    const account = await AccountRepo.findOneByEmail(req.body.email);
    if (!account) throw new BadRequestError('User not Found');
    const match = await bcrypt.compare(req.body.oldPassword, account.security.password);
    if (!match) throw new AuthFailureError('Authentication failure');
    const newPasswordHash = await bcrypt.hash(req.body.newPassword, 10);
    const newAccount = await AccountRepo.changePassword(req.body.email,newPasswordHash)
    const accountData = await getUserData(newAccount as Account);
    new SuccessResponse('operation Success', {
      user:{
        ...accountData,
      },
    }).send(res);
  }),
);


export default router;
