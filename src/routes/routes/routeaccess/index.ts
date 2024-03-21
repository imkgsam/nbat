import express from 'express';
import { SuccessResponse, FailureMsgResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/Role';
import RouteRepo  from '../../../database/repository/RouteRepo';
import validator from '../../../helpers/validator';
import RouteSchema from '../schema';
// import Route from '../../../database/model/Route';
import RouteAccess from '../../../database/model/RouteAccess';
// import { ProtectedRequest } from 'app-request';

const router = express.Router();


router.get(
  '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    try{
      const data = await RouteRepo.RouteAccess.findAll()
      return new SuccessResponse('success', data).send(res);
    }catch(e){
      console.log(e)
    }
  }),
);


router.post(
  '/',
  validator(RouteSchema.RouteAccess.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
      const data = await RouteRepo.RouteAccess.create({
        ...req.body
      } as RouteAccess)
      return new SuccessResponse('success', data).send(res);
  }),
);


export default router;