import express from 'express';
import { SuccessResponse, FailureMsgResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import authorization from '../../auth/authorization';
import { RoleCodeEnum } from '../../database/model/Role';
import validator from '../../helpers/validator';
import schema from './schema';
import { ProtectedRequest } from 'app-request';
import DepartmentRepo from '../../database/repository/DepartmentRepo';
import Department from '../../database/model/Department';

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const departments = await DepartmentRepo.findAll();
    return new SuccessResponse('success', departments).send(res);
  }),
);

router.post( '/',
  validator(schema.departmentCreate),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await DepartmentRepo.create({
      name: req.body.name,
      parent: req.body.parent,
      manager: req.body.manager
    } as Department);
    new SuccessResponse('Department created successfully', createdOne).send(res);
  }),
);

router.post( '/enable',
  validator(schema.departmentId),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await DepartmentRepo.enable(req.body.id)
    if(updatedOne){
      new SuccessResponse('Department enabled successfully', updatedOne).send(res);
    }else{
      new FailureMsgResponse('Department enable failure').send(res)
    }
  }),
);

router.put('/',
  validator(schema.departmentUpdate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedDepartment = await DepartmentRepo.update({
      name: req.body.name,
      _id: req.body.id,
      parent: req.body.parent,
      manager: req.body.manager
    } as Department);

    return new SuccessResponse('Department updated', updatedDepartment).send(res);
  }),
);

router.post( '/disable',
  validator(schema.departmentId),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await DepartmentRepo.disable(req.body.id)
    if(updatedOne){
      new SuccessResponse('Department disabled successfully', updatedOne).send(res)
    }else{
      new FailureMsgResponse('Department disabled failure').send(res)
    }
  }),
);

export default router;
