import express from 'express';
import { SuccessResponse, FailureMsgResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/workon/Role';
import validator, { ValidationSourceEnum } from '../../../helpers/validator';
import schema from './schema';
import { ProtectedRequest } from 'app-request';
import LocationRepo from '../../../database/repository/LocationRepo';
import Location from '../../../database/model/workon/Location';

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const all = await LocationRepo.findAll();
    return new SuccessResponse('success', all).send(res);
  }),
);

router.get( '/allpublic',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const rts = await LocationRepo.filters({'meta.enabled':true});
    return new SuccessResponse('success', rts).send(res);
  }),
);

router.post( '/',
  validator(schema.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await LocationRepo.create({
      ...req.body
    } as Location);
    new SuccessResponse('Location created successfully', createdOne).send(res);
  }),
);

router.post( '/delete',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const deletedOne = await LocationRepo.delete(req.body.id);
    new SuccessResponse('Location deleted successfully', deletedOne).send(res);
  }),
);

router.post( '/enable',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await LocationRepo.enable(req.body.id)
    if(updatedOne){
      new SuccessResponse('Location enabled successfully', updatedOne).send(res);
    }else{
      new FailureMsgResponse('Location enable failure').send(res)
    }
  }),
);

router.put('/',
  validator(schema.update),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedLocation = await LocationRepo.update({...req.body} as Location);
    return new SuccessResponse('Location updated', updatedLocation).send(res);
  }),
);

router.post( '/disable',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await LocationRepo.disable(req.body.id)
    if(updatedOne){
      new SuccessResponse('Location disabled successfully', updatedOne).send(res)
    }else{
      new FailureMsgResponse('Location disabled failure').send(res)
    }
  }),
);

export default router;
