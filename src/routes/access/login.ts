import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError, AuthFailureError } from '../../core/ApiError';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import { createTokens } from '../../auth/authUtils';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { getUserData } from './utils';
import { PublicRequest } from '../../types/app-request';
import Logger from '../../core/Logger'

const router = express.Router();

router.post(
  '/email',
  validator(schema.credential),
  asyncHandler(async (req: PublicRequest, res) => {
     /*
     * #swagger.description = 'user login with email and credential'
     * #swagger.tags = ['auth']
     */
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
      user:{
        ...userData,
        roles: userData.roles.map(each=> each.code)
      },
      ...tokens,
    }).send(res);
  }),
);

export default router;
