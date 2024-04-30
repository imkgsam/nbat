import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/Role';
import validator from '../../../helpers/validator';
import schema from '../schema';
import { ProtectedRequest } from 'app-request';
import MoldRepo from '../../../database/repository/MoldRepo';
import MoldItem from '../../../database/model/mold/MoldItem';

const router = express.Router();

router.get('/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const alls = await MoldRepo.MoldItem.findAll();
    return new SuccessResponse('success', alls).send(res);
  }),
);

router.post('/',
  validator(schema.MoldItem.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { inBatch, count} = req.body
    const createdOne = await MoldRepo.MoldItem.create({
      ...req.body
    } as MoldItem, inBatch, count);
    new SuccessResponse('Mold Item created successfully', createdOne).send(res);
  }),
);

router.post('/pfilters',
  validator(schema.MoldItem.pfilters),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { filters } = req.body
    const datas = await MoldRepo.MoldItem.filters(filters)
    let { currentPage, pageSize } = req.body
    if (!currentPage || currentPage <= 0) {
      currentPage = 1
    }
    if (!pageSize || pageSize <= 0) {
      pageSize = 10
    }
    const rt = datas.slice(pageSize * (currentPage - 1), currentPage * pageSize)
    new SuccessResponse('success', {
      list: rt,
      total: datas.length,
      pageSize: pageSize,
      currentPage: currentPage
    }).send(res);
  }),
);

router.post('/delete',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const deletedOne = await MoldRepo.MoldItem.delete(req.body.id);
    new SuccessResponse('Mold Item deleted successfully', deletedOne).send(res);
  }),
);

router.put('/',
  validator(schema.MoldItem.update),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await MoldRepo.MoldItem.update({
      ...req.body
    } as MoldItem);
    new SuccessResponse('Mold Item updated successfully', updatedOne).send(res);
  }),
);

router.post('/enable',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await MoldRepo.MoldItem.enable(req.body.id)
    new SuccessResponse('Mold Item enabled successfully', updatedOne).send(res);
  }),
);

router.post('/disable',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await MoldRepo.MoldItem.disable(req.body.id)
    new SuccessResponse('Mold Item disabled successfully', updatedOne).send(res);
  }),
);

export default router;
