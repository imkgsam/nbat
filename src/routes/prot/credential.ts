import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import AccountRepo from '../../database/repository/AccountRepo';
import { BadRequestError } from '../../core/ApiError';
import Account from '../../database/model/workon/Account';
import validator from '../../helpers/validator';
import schema from '../public/schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { RoleCodeEnum } from '../../database/model/workon/Role';
import authorization from '../../auth/authorization';
import authentication from '../../auth/authentication';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
const router = express.Router();

//----------------------------------------------------------------
router.use(authentication, authorization(RoleCodeEnum.ADMIN));
//----------------------------------------------------------------


/**
 * 管理员为任何用户重置密码
 */
router.post( '/user/assign', 
  validator(schema.credential),
  asyncHandler(async (req: RoleRequest, res) => {
    const user = await AccountRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError('Account do not exists');
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    await AccountRepo.updateInfo({
      _id: user._id,
      security:{
        password: passwordHash
      }
    } as Account );
    await KeystoreRepo.removeAllForClient(user);
    new SuccessResponse(
      'Account password updated',
      _.pick(user, ['_id', 'name', 'email']),
    ).send(res);
  }),
);

export default router;
