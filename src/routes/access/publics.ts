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
 * 用户通过邮箱登录
 */
router.post(
  '/login/email',
  validator(schema.credential),
  asyncHandler(async (req: PublicRequest, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError('User not registered/ not verified');
    if (!user.meta.enabled) throw new BadRequestError('User not allowed to login');
    if (!user.meta.verified) throw new BadRequestError('User not verified, please contact admin');
    if (!user.password) throw new BadRequestError('Credential not set');
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new AuthFailureError('Authentication failure');
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
    const userData = await getUserData(user);
    Logger.info(`User Login as ${user.accountName}`)
    new SuccessResponse('Login Success', {
      account:{
        ...userData,
        roles: userData.roles.map(each=> each.code)
      },
      ...tokens,
    }).send(res);
  }),
);


/**
 * 注册用户？
 */
router.post(
  '/signup/basic',
  validator(schema.signup),
  asyncHandler(async (req: RoleRequest, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError('User already registered');
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const { account: createdUser, keystore } = await UserRepo.create(
      {
        accountName: req.body.accountName,
        email: req.body.email,
        password: passwordHash,
      } as User,
      accessTokenKey,
      refreshTokenKey,
      RoleCodeEnum.LEARNER,
    );
    const userData = await getUserData(createdUser);
    new SuccessResponse('Signup Successful', {
      user: userData,
      // tokens: tokens,
    }).send(res);
  }),
);

export default router;
