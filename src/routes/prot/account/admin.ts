import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/workon/Role';
import AccountRepo from '../../../database/repository/AccountRepo';
import schema from './schema'
import validator, { ValidationSourceEnum } from '../../../helpers/validator';
import { ProtectedRequest } from 'app-request';
import Account from '../../../database/model/finished/Account';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';

const router = express.Router();

//权限限制
router.use(authorization(RoleCodeEnum.ADMIN))

/**
 * role: Admin
 * 获取所有account
 */
router.get( '/all',
  asyncHandler(async (req, res) => {
    const users = await AccountRepo.filters();
    return new SuccessResponse('success', users).send(res);
  })
);


/**
 * role: Admin
 * 获取所有公开的 account（已认证已启用的用户）
 */
router.get( '/allpublic',
  asyncHandler(async (req, res) => {
    const users = await AccountRepo.filters({'meta.enabled':true, 'meta.verified':true});
    return new SuccessResponse('success', users).send(res);
  })
);


/**
 * role: Admin
 * 强制用户退出登录
 */
router.post( '/forcelogout',
  asyncHandler(async (req, res) => {
    await KeystoreRepo.removeAllForClient({_id: req.body.accountId} as Account);
    return new SuccessResponse('success').send(res);
  })
);


/**
 * role: Admin
 * 启用账号，允许登录
 */
router.post( '/enable',  
  asyncHandler(async (req, res) => {
    const user = await AccountRepo.enable(req.body.accountId);
    return new SuccessResponse('success', user).send(res);
  })
);


/**
 * role: Admin
 * 停用账号
 */
router.post( '/disable',
  asyncHandler(async (req, res) => {
    const user = await AccountRepo.disable(req.body.accountId);
    return new SuccessResponse('success', user).send(res);
  })
);

export default router;
