import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/Role';
import validator from '../../../helpers/validator';
import schema from '../schema';
import { ProtectedRequest } from 'app-request';
import InccodeRepo from '../../../database/repository/InccodeRepo';
import InccodeType from '../../../database/model/inccode/InccodeType';

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const rts = await InccodeRepo.InccodeType.findAll();
    return new SuccessResponse('success', rts).send(res);
  }),
);

router.post( '/',
  validator(schema.InccodeType.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await InccodeRepo.InccodeType.create({
      ...req.body
    } as InccodeType);
    new SuccessResponse('Inccode Type created successfully', createdOne).send(res);
  }),
);

router.post( '/pfilters',
  validator(schema.InccodeType.pfilters),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { filters  } = req.body
    const datas = await InccodeRepo.InccodeType.filters(filters)
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
    const deletedOne = await InccodeRepo.InccodeType.delete(req.body.id);
    new SuccessResponse('Inccode Type created successfully', deletedOne).send(res);
  }),
);

router.put( '/',
  validator(schema.InccodeType.update),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await InccodeRepo.InccodeType.update({
      ...req.body
    } as InccodeType);
    new SuccessResponse('Inccode Type updated successfully', updatedOne).send(res);
  }),
);

router.post( '/enable',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await InccodeRepo.InccodeType.enable(req.body.id)
    new SuccessResponse('Inccode Type enabled successfully', updatedOne).send(res);
  }),
);

router.post( '/disable',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await InccodeRepo.InccodeType.disable(req.body.id)
    new SuccessResponse('Inccode Type disabled successfully', updatedOne).send(res);
  }),
);

export default router;
