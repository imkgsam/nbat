import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/workon/Role';
import validator from '../../../helpers/validator';
import roleSchema from './schema';
import { ProtectedRequest } from 'app-request';
import RoleRepo from '../../../database/repository/RoleRepo';
import Role from '../../../database/model/workon/Role';

const router = express.Router();

//权限限制
router.use(authorization(RoleCodeEnum.ADMIN),)

/**
 * 请求所有的Role
 */
router.get( '/all',
  asyncHandler(async (req, res) => {
    const roles = await RoleRepo.filters();
    return new SuccessResponse('success', roles).send(res);
  }),
);


/**
 * 请求所有公开的启用的 Role
 */
router.get( '/allpublic',
  asyncHandler(async (req, res) => {
    const rts = await RoleRepo.filters({'meta.enabled':true});
    return new SuccessResponse('success', rts).send(res);
  }),
);


/**
 * 创建新的Role
 */
router.post( '/',
  validator(roleSchema.create),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const newOne = await RoleRepo.create({
      ...req.body
    } as Role);
    new SuccessResponse('Operation success', newOne).send(res);
  }),
);


/**
 * 更新现有Role
 */
router.put( '/',
  validator(roleSchema.update),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await RoleRepo.update({
      ...req.body
    } as Role);
    new SuccessResponse('Operation success', updatedOne).send(res);
  }),
);


/**
 * 启用Role
 */
router.post( '/enable',
  validator(roleSchema.Id),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await RoleRepo.enable(req.body.id)
    new SuccessResponse('Role enabled successfully', updatedOne).send(res);
  }),
);


/**
 * 停用Role
 */
router.post( '/disable',
  validator(roleSchema.Id),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await RoleRepo.disable(req.body.id)
    new SuccessResponse('Role disabled successfully', updatedOne).send(res);
  }),
);


/**
 * 按页面 筛选条件 返回所有符合的Role
 */
router.post( '/pfilters',
  validator(roleSchema.filters),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { filters  } = req.body
    const datas = await RoleRepo.filters(filters)
    let {currentPage, pageSize} = req.body
    if(!currentPage || currentPage<=0){
      currentPage = 1
    }
    if(!pageSize || pageSize <=0){
      pageSize = 10
    }
    const rt = datas.slice(pageSize*(currentPage-1),currentPage*pageSize)
    new SuccessResponse('Operation success', {
      list: rt,
      total: datas.length,
      pageSize: pageSize,
      currentPage: currentPage
    }).send(res)
  }),
);


export default router;
