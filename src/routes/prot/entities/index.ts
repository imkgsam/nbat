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





/**
 * role: everyone
 * 获取当前登录用户的Entity 详情
 */
router.get( '/detailedinfo4currentuser',
    asyncHandler(async (req: ProtectedRequest, res) => {
      console.log(req.account._id)
      const entity = await EntityRepo.findEntityDetailedInfoByUserId(req.account._id);
      return new SuccessResponse('success', entity).send(res);
    }),
  );

// router.put('/',
//   validator(DepartmentSchema.update),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedDepartment = await DepartmentRepo.update({...req.body} as Department);
//     return new SuccessResponse('Department updated', updatedDepartment).send(res);
//   }),
// );


router.use('/employee',Employee)
router.use('/company',Company)
router.use('/person',Person)
router.use('/supplier',Supplier)
router.use('/customer',Customer)

export default router;
