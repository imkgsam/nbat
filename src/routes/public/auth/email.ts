import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import crypto from 'crypto';
import AccountRepo from '../../../database/repository/AccountRepo';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import { createTokens } from '../../../auth/authUtils';
import validator from '../../../helpers/validator';
import schema from '../schema';
import asyncHandler from '../../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { getUserData } from '../utils';
import { PublicRequest } from '../../../types/app-request';
import Logger from '../../../core/Logger';

const router = express.Router();


/**
 * login with email and password
 */
router.post(
  '/login/pword',
  validator(schema.credential),
  asyncHandler(async (req: PublicRequest, res) => {
    const account = await AccountRepo.findOneByEmail(req.body.email);
    if (!account) throw new BadRequestError('Account not available');
    if (!account.meta.enabled) throw new BadRequestError('Account not enabled');
    if (!account.meta.verified) throw new BadRequestError('Account not verified');
    if (!account.binding.email.verified) throw new BadRequestError('Account email not verified');
    if (!account.security.password) throw new BadRequestError('Credential not set');
    const match = await bcrypt.compare(req.body.password, account.security.password);
    if (!match) throw new AuthFailureError('Authentication failure');
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    await KeystoreRepo.create(account, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(account, accessTokenKey, refreshTokenKey);
    const userData = await getUserData(account);
    Logger.info(`User Login as ${account.accountName}`)
    new SuccessResponse('Login Success', {
      accountName: userData.accountName,
      roles: userData?.roles?.map(each=> each.code),
      avatar: userData?.avatar,
      ...tokens,
    }).send(res);
  }),
);

/**
 * login with email and email verification code
 * status: todo
 */






export default router;
