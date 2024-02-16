import express from 'express';
import { TokenRefreshResponse } from '../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { Types } from 'mongoose';
import UserRepo from '../../database/repository/UserRepo';
import { AuthFailureError } from '../../core/ApiError';
import JWT from '../../core/JWT';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import crypto from 'crypto';
import {
  validateTokenData,
  createTokens,
  getAccessToken,
} from '../../auth/authUtils';
import validator, { ValidationSourceEnum } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';

const router = express.Router();



router.post(
  '/refresh',
  validator(schema.auth, ValidationSourceEnum.HEADER),
  validator(schema.refreshToken),
  asyncHandler(async (req: ProtectedRequest, res) => {
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase
    const accessTokenPayload = await JWT.decode(req.accessToken);
    validateTokenData(accessTokenPayload);

    const user = await UserRepo.findById(
      new Types.ObjectId(accessTokenPayload.sub),
    );

    if (!user) throw new AuthFailureError('User not registered');
    req.user = user;

    console.log('checking refresh token')
    const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
    console.log('checking refresh token2')
    validateTokenData(refreshTokenPayload);

    if (accessTokenPayload.sub !== refreshTokenPayload.sub)
      throw new AuthFailureError('Invalid access token: sub dismatch');

    const keystore = await KeystoreRepo.find(
      req.user,
      accessTokenPayload.prm,
      refreshTokenPayload.prm,
    );

    if (!keystore) throw new AuthFailureError('Invalid tokens: not found in key repo');
    await KeystoreRepo.remove(keystore._id);

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await KeystoreRepo.create(req.user, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(
      req.user,
      accessTokenKey,
      refreshTokenKey,
    );

    new TokenRefreshResponse(
      'Token Issued',
      { ...tokens }
    ).send(res);
  }),
);

export default router;
