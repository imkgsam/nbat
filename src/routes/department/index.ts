import express from 'express';
import { SuccessResponse, FailureMsgResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import authorization from '../../auth/authorization';
import { RoleCodeEnum } from '../../database/model/Role';
import validator, { ValidationSourceEnum } from '../../helpers/validator';
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

router.get( '/detail',
  validator(schema.departmentId, ValidationSourceEnum.QUERY),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const {_id}  = req.query
    console.log(_id)
    const departmentObj = await DepartmentRepo.getDetailsById(_id as string);
    return new SuccessResponse('success',departmentObj).send(res);
  }),
);

router.post( '/',
  validator(schema.departmentCreate),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await DepartmentRepo.create({
      name: req.body.name,
      parent: req.body.parent,
      manager: req.body.manager,
      color: req.body.color,
      company: req.body.company || "657d0fc01222912e8b7d5ac7", //ML
      meta: { enabled: req.body.meta?.enabled }
    } as Department);
    new SuccessResponse('Department created successfully', createdOne).send(res);
  }),
);

router.post( '/delete',
  validator(schema.departmentId),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const deletedOne = await DepartmentRepo.removeOneById(req.body._id);
    new SuccessResponse('Department deleted successfully', deletedOne).send(res);
  }),
);

router.post( '/enable',
  validator(schema.departmentId),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await DepartmentRepo.enable(req.body._id)
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
    const updatedDepartment = await DepartmentRepo.update({...req.body} as Department);
    return new SuccessResponse('Department updated', updatedDepartment).send(res);
  }),
);

router.post( '/disable',
  validator(schema.departmentId),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await DepartmentRepo.disable(req.body._id)
    if(updatedOne){
      new SuccessResponse('Department disabled successfully', updatedOne).send(res)
    }else{
      new FailureMsgResponse('Department disabled failure').send(res)
    }
  }),
);

export default router;
