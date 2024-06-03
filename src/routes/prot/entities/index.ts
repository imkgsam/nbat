import express from 'express';
import Employee from './employee'
import Company from './company'
import Person from './person'

import Supplier from './supplier'
import Customer from './customer'

import schema from './schema'
import { RoleCodeEnum } from '../../../database/model/Role';
import validator from '../../../helpers/validator';
import authorization from '../../../auth/authorization';
import authentication from '../../../auth/authentication'
import { SuccessResponse,FailureMsgResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import EntityRepo from '../../../database/repository/EntityRepo';

const router = express.Router();

router.post( '/enable',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await EntityRepo.enable(req.body.id)
    if(updatedOne){
      new SuccessResponse('Entity enabled successfully', updatedOne).send(res);
    }else{
      new FailureMsgResponse('Entity enable failure').send(res)
    }
  }),
);

// router.put('/',
//   validator(DepartmentSchema.update),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedDepartment = await DepartmentRepo.update({...req.body} as Department);
//     return new SuccessResponse('Department updated', updatedDepartment).send(res);
//   }),
// );

router.post( '/disable',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await EntityRepo.disable(req.body.id)
    if(updatedOne){
      new SuccessResponse('Entity disabled successfully', updatedOne).send(res)
    }else{
      new FailureMsgResponse('Entity disabled failure').send(res)
    }
  }),
);


router.use('/employee',Employee)
router.use('/company',Company)
router.use('/person',Person)
router.use('/supplier',Supplier)
router.use('/customer',Customer)

export default router;
