import express from 'express';
import Employee from './employee'
import Company from './company'
import Person from './person'
import Supplier from './supplier'
import Customer from './customer'
import schema from './schema'
import { RoleCodeEnum } from '../../../database/model/workon/Role';
import validator from '../../../helpers/validator';
import authorization from '../../../auth/authorization';
import { SuccessResponse,FailureMsgResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import EntityRepo from '../../../database/repository/EntityRepo';

const router = express.Router();

//权限控制
router.use(authorization(RoleCodeEnum.ADMIN))


/**
 * role: Admin
 * 根据 ID启用Entity
 */
router.post( '/enable',
  validator(schema.Id),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await EntityRepo.enable(req.body.id)
    if(updatedOne){
      new SuccessResponse('Entity enabled successfully', updatedOne).send(res);
    }else{
      new FailureMsgResponse('Entity enable failure').send(res)
    }
  }),
);


/**
 * role: Admin
 * 根据ID 停用Entity
 */
router.post( '/disable',
  validator(schema.Id),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await EntityRepo.disable(req.body.id)
    if(updatedOne){
      new SuccessResponse('Entity disabled successfully', updatedOne).send(res)
    }else{
      new FailureMsgResponse('Entity disabled failure').send(res)
    }
  }),
);

export default router;
