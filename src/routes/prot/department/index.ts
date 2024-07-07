import express from 'express';
import { SuccessResponse, FailureMsgResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/workon/Role';
import validator, { ValidationSourceEnum } from '../../../helpers/validator';
import DepartmentSchema from './schema';
import { ProtectedRequest } from 'app-request';
import DepartmentRepo from '../../../database/repository/DepartmentRepo';
import Department from '../../../database/model/finished/Department';

const router = express.Router();
/**
 * role: Everyone
 * 获取所有部门列表
 */
router.get( '/all',
  asyncHandler(async (req, res) => {
    const departments = await DepartmentRepo.filters();
    return new SuccessResponse('success', departments).send(res);
  }),
);

export default router;
