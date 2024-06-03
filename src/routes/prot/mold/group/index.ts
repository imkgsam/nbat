import express from 'express';
import { SuccessResponse } from '../../../../core/ApiResponse';
import asyncHandler from '../../../../helpers/asyncHandler';
import authorization from '../../../../auth/authorization';
import { RoleCodeEnum } from '../../../../database/model/Role';
import validator from '../../../../helpers/validator';
import schema from '../schema';
import { ProtectedRequest } from 'app-request';
import MoldRepo from '../../../../database/repository/MoldRepo';
import MoldGroup, { MoldGroupStatusEnum } from '../../../../database/model/mold/MoldGroup';

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const all = await MoldRepo.MoldGroup.findAll();
    return new SuccessResponse('success', all).send(res);
  }),
);

router.post( '/',
  validator(schema.MoldGroup.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await MoldRepo.MoldGroup.create({
      ...req.body,
      'meta.status':MoldGroupStatusEnum.IDLE
    } as MoldGroup);
    new SuccessResponse('MoldGroup created successfully', createdOne).send(res);
  }),
);

router.put( '/',
  validator(schema.MoldGroup.update),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await MoldRepo.MoldGroup.update({
      ...req.body
    } as MoldGroup);
    new SuccessResponse('MoldGroup updated successfully', updatedOne).send(res);
  }),
);

router.post( '/enable',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await MoldRepo.MoldGroup.enable(req.body.id)
    new SuccessResponse('Role enabled successfully', updatedOne).send(res);
  }),
);

router.post( '/disable',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await MoldRepo.MoldGroup.disable(req.body.id)
    new SuccessResponse('Role disabled successfully', updatedOne).send(res);
  }),
);

router.post( '/pfilters',
  validator(schema.MoldGroup.pfilters),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { filters  } = req.body
    const datas = await MoldRepo.MoldGroup.filters(filters)
    let {currentPage, pageSize} = req.body
    if(!currentPage || currentPage<=0){
      currentPage = 1
    }
    if(!pageSize || pageSize <=0){
      pageSize = 10
    }
    const rt = datas.slice(pageSize*(currentPage-1),currentPage*pageSize)
    new SuccessResponse('success', {
      list: rt,
      total: datas.length,
      pageSize: pageSize,
      currentPage: currentPage 
    }).send(res);
  }),
);

router.post( '/delete',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const deletedOne = await MoldRepo.MoldGroup.delete(req.body.id);
    new SuccessResponse('Mold Group created successfully', deletedOne).send(res);
  }),
);


export default router;
