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

router.use(authorization(RoleCodeEnum.ADMIN))



/**
 * role: Admin
 * 获取所有已启用的部门
 */
router.get( '/allpublic',
  asyncHandler(async (req, res) => {
    const rts = await DepartmentRepo.filters({'meta.enabled':true});
    return new SuccessResponse('success', rts).send(res);
  }),
);


/**
 * role: Admin
 * 根据id获取部门详情
 */
router.get( '/detail',
  validator(DepartmentSchema.Id, ValidationSourceEnum.QUERY),
  asyncHandler(async (req, res) => {
    const {id}  = req.query
    const departmentObj = await DepartmentRepo.getDetailsById(id as string);
    return new SuccessResponse('success',departmentObj).send(res);
  }),
);


/**
 * role: Admin
 * 创建新的部门
 * status: n2c
 */
router.post( '/',
  validator(DepartmentSchema.create),
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


/**
 * role: Admin
 * 根据ID删除部门
 */
router.post( '/delete',
  validator(DepartmentSchema.Id),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const deletedOne = await DepartmentRepo.removeOneById(req.body.id);
    new SuccessResponse('Department deleted successfully', deletedOne).send(res);
  }),
);


/**
 * role: Admin
 * 根据ID 启用部门
 */
router.post( '/enable',
  validator(DepartmentSchema.Id),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await DepartmentRepo.enable(req.body.id)
    if(updatedOne){
      new SuccessResponse('Department enabled successfully', updatedOne).send(res);
    }else{
      new FailureMsgResponse('Department enable failure').send(res)
    }
  }),
);


/**
 * role: Admin
 * 根据ID 停用部门
 */
router.post( '/disable',
  validator(DepartmentSchema.Id),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await DepartmentRepo.disable(req.body.id)
    if(updatedOne){
      new SuccessResponse('Department disabled successfully', updatedOne).send(res)
    }else{
      new FailureMsgResponse('Department disabled failure').send(res)
    }
  }),
);


/**
 * role: Admin
 * 更新部门详情
 */
router.put('/',
  validator(DepartmentSchema.update),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedDepartment = await DepartmentRepo.update({...req.body} as Department);
    return new SuccessResponse('Department updated', updatedDepartment).send(res);
  }),
);


export default router;
