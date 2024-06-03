import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import crypto from 'crypto';
import AccountRepo from '../../../database/repository/AccountRepo';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import EntityRepo from '../../../database/repository/EntityRepo';
import { createTokens } from '../../../auth/authUtils';
import validator from '../../../helpers/validator';
import schema from '../schema';
import asyncHandler from '../../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { getUserData } from '../utils';
import { PublicRequest } from '../../../types/app-request';
import Logger from '../../../core/Logger';
import { ProtectedRequest } from 'app-request';
import { SuccessMsgResponse } from '../../../core/ApiResponse';
import authentication from '../../../auth/authentication';
import User from '../../../database/model/Account';
import { RoleRequest } from 'app-request';
import { RoleCodeEnum } from '../../../database/model/Role';

const router = express.Router();


/**
 * login with email and password
 */
router.post(
  '/pword',
  validator(schema.credential),
  asyncHandler(async (req: PublicRequest, res) => {
    const user = await AccountRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError('Account not available');
    if (!user.meta.enabled) throw new BadRequestError('Account not enabled');
    if (!user.meta.verified) throw new BadRequestError('Account not verified');
    if (!user.binding.email.verified) throw new BadRequestError('Account email not verified');
    if (!user.security.password) throw new BadRequestError('Credential not set');
    const match = await bcrypt.compare(req.body.password, user.security.password);
    if (!match) throw new AuthFailureError('Authentication failure');
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
    const userData = await getUserData(user);
    Logger.info(`User Login as ${user.accountName}`)
    new SuccessResponse('Login Success', {
      // account:{
      //   ...userData,
      //   roles: userData?.roles?.map(each=> each.code)
      // },
      accountName: userData.accountName,
      roles: userData?.roles?.map(each=> each.code),
      avatar: userData?.avatar,
      ...tokens,
    }).send(res);
  }),
);

/**
 * login with email and email verification code
 */

export default router;
