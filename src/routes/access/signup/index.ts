import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import crypto from 'crypto';
import AccountRepo from '../../../database/repository/AccountRepo';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import validator from '../../../helpers/validator';
import schema from '../schema';
import asyncHandler from '../../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { getUserData } from '../utils';
import User from '../../../database/model/Account';
import { RoleRequest } from 'app-request';
import { RoleCodeEnum } from '../../../database/model/Role';

const router = express.Router();

/**
 * 注册用户？
 */
// router.post(
//   '/signup/basic',
//   validator(schema.signup),
//   asyncHandler(async (req: RoleRequest, res) => {
//     const user = await AccountRepo.findByEmail(req.body.email);
//     if (user) throw new BadRequestError('User already registered');
//     const accessTokenKey = crypto.randomBytes(64).toString('hex');
//     const refreshTokenKey = crypto.randomBytes(64).toString('hex');
//     const passwordHash = await bcrypt.hash(req.body.password, 10);
//     const { account: createdUser, keystore } = await AccountRepo.create(
//       {
//         accountName: req.body.accountName,
//         email: req.body.email,
//         password: passwordHash,
//       } as User,
//       accessTokenKey,
//       refreshTokenKey,
//       RoleCodeEnum.LEARNER,
//     );
//     const userData = await getUserData(createdUser);
//     new SuccessResponse('Signup Successful', {
//       user: userData,
//       // tokens: tokens,
//     }).send(res);
//   }),
// );

export default router;
