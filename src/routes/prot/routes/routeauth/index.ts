import express from 'express';
import { SuccessResponse, FailureMsgResponse } from '../../../../core/ApiResponse';
import asyncHandler from '../../../../helpers/asyncHandler';
import authorization from '../../../../auth/authorization';
import { RoleCodeEnum } from '../../../../database/model/Role';
import RouteRepo  from '../../../../database/repository/RouteRepo';
import validator from '../../../../helpers/validator';
import RouteSchema from '../schema';
// import Route from '../../../../database/model/Route';
import RouteAuth from '../../../../database/model/RouteAuth';
// import { ProtectedRequest } from 'app-request';

const router = express.Router();


router.get('/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    try{
      const data = await RouteRepo.RouteAuth.findAll()
      return new SuccessResponse('success', data).send(res);
    }catch(e){
      console.log(e)
    }
  }),
);


router.post('/',
  validator(RouteSchema.RouteAuth.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
      const data = await RouteRepo.RouteAuth.create({
        ...req.body
      } as RouteAuth)
      return new SuccessResponse('success', data).send(res);
  }),
);


export default router;
