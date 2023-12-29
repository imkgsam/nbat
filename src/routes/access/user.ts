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
import Logger from '../../core/Logger';
import { ProtectedRequest } from 'app-request';
import { SuccessMsgResponse } from '../../core/ApiResponse';
import authentication from '../../auth/authentication';
import User from '../../database/model/User';
import { RoleRequest } from 'app-request';
import { RoleCodeEnum } from '../../database/model/Role';

const router = express.Router();

router.post(
  '/login/email',
  validator(schema.credential),
  asyncHandler(async (req: PublicRequest, res) => {
     /*
     * #swagger.description = 'user login with email and credential'
     * #swagger.tags = ['user']
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

router.delete(
  '/logout',
  authentication,
  asyncHandler(async (req: ProtectedRequest, res) => {
    /*
     * #swagger.description = 'user logout'
     * #swagger.tags = ['user']
     */
    await KeystoreRepo.remove(req.keystore._id);
    new SuccessMsgResponse('Logout success').send(res);
  }),
);

router.post(
  '/password/change',
  validator(schema.changePassword),
  asyncHandler(async (req: PublicRequest, res) => {
     /*
     * #swagger.description = 'user change password when already login'
     * #swagger.tags = ['user']
     */
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

router.post(
  '/signup/basic',
  validator(schema.signup),
  asyncHandler(async (req: RoleRequest, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError('User already registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const { user: createdUser, keystore } = await UserRepo.create(
      {
        accountName: req.body.accountName,
        email: req.body.email,
        password: passwordHash,
      } as User,
      accessTokenKey,
      refreshTokenKey,
      RoleCodeEnum.LEARNER,
    );

    // const tokens = await createTokens(
    //   createdUser,
    //   keystore.primaryKey,
    //   keystore.secondaryKey,
    // );
    const userData = await getUserData(createdUser);

    new SuccessResponse('Signup Successful', {
      user: userData,
      // tokens: tokens,
    }).send(res);
  }),
);

export default router;
