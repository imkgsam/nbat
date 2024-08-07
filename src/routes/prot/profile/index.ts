import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import AccountRepo from '../../../database/repository/AccountRepo';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../../core/ApiError';
import validator from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import _ from 'lodash';

const router = express.Router();


router.get(
  '/my',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await AccountRepo.findPrivateProfileById(req.account._id);
    if (!user) throw new BadRequestError('User not registered');
    return new SuccessResponse(
      'success',
      user
    ).send(res);
  }),
);

// ace,11.17,put route hanle update userprofile
router.put(
  '/',
  validator(schema.profile),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await AccountRepo.findPrivateProfileById(req.account._id);
    if (!user) throw new BadRequestError('User not registered');
    if (req.body.name) user.accountName = req.body.name;
    await AccountRepo.updateInfo(user);
    const data = _.pick(user, ['name']);
    return new SuccessResponse('Profile updated', data).send(res);
  }),
);

export default router;
