import express from 'express';
import { SuccessResponse } from '../../../../core/ApiResponse';
import asyncHandler from '../../../../helpers/asyncHandler';
import authorization from '../../../../auth/authorization';
import { RoleCodeEnum } from '../../../../database/model/workon/Role';
import AccountRepo from '../../../../database/repository/AccountRepo';
import KeystoreRepo from '../../../../database/repository/KeystoreRepo';
import schema from './schema'

import validator, { ValidationSourceEnum } from '../../../../helpers/validator';
import { ProtectedRequest } from 'app-request';
import Account from '../../../../database/model/workon/Account';

const router = express.Router();


router.get( '/all',
  asyncHandler(async (req, res) => {
    const users = await AccountRepo.findAll();
    return new SuccessResponse('success', users).send(res);
  })
);

router.post( '/forcelogout',
  asyncHandler(async (req, res) => {
    await KeystoreRepo.removeAllForClient({_id: req.body.accountId} as Account);
    return new SuccessResponse('success').send(res);
  })
);

router.post( '/enable',
  asyncHandler(async (req, res) => {
    const user = await AccountRepo.enable(req.body.accountId);
    return new SuccessResponse('success', user).send(res);
  })
);

router.post( '/disable',
  asyncHandler(async (req, res) => {
    const user = await AccountRepo.disable(req.body.accountId);
    return new SuccessResponse('success', user).send(res);
  })
);


export default router;
