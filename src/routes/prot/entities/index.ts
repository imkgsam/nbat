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
