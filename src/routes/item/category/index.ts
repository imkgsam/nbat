import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import CategorySchema from './schema';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/Role';
import CategoryRepo from "../../../database/repository/CategoryRepo"
import validator, { ValidationSourceEnum } from '../../../helpers/validator';
import { ProtectedRequest } from 'app-request';
import Category from '../../../database/model/Category';


const router = express.Router();

router.get(
  '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const data = await CategoryRepo.findAll({})
    return new SuccessResponse('success', data).send(res);
  }),
)

router.get(
  '/detail',
  validator(CategorySchema.Id,ValidationSourceEnum.QUERY),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const { id }  = req.query
    const data = await CategoryRepo.detail(id as string)
    return new SuccessResponse('success', data).send(res);
  }),
)

router.post( '/',
  validator(CategorySchema.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await CategoryRepo.create({
      name: req.body.name,
      parent: req.body?.parent
    } as Category);
    new SuccessResponse('category created successfully', createdOne).send(res);
  }),
)

router.put('/',
  validator(CategorySchema.update),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedDepartment = await CategoryRepo.update({...req.body} as Category);
    return new SuccessResponse('category updated', updatedDepartment).send(res);
  }),
)

router.post( '/delete',
  validator(CategorySchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const deletedOne = await CategoryRepo.removeOneById(req.body.id);
    new SuccessResponse('Department deleted successfully', deletedOne).send(res);
  }),
)

export default router;
