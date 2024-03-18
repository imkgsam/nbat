import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import authorization from '../../auth/authorization';
import { RoleCodeEnum } from '../../database/model/Role';
import RouteRepo  from '../../database/repository/RouteRepo';
import validator from '../../helpers/validator';
import RouteSchema from './schema';
import Route from '../../database/model/Route';

const router = express.Router();


router.get(
  '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    try{
      const data = await RouteRepo.findAll()
      const rt = JSON.parse(JSON.stringify(data).replaceAll('6550a08eb41da1257eda92d2','admin').replaceAll('6577ce21fd6e31603d5f3389','common'))
      return new SuccessResponse('success', rt).send(res);
    }catch(e){
      console.log(e)
    }
  }),
);

router.post(
  '/',
  validator(RouteSchema.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
      const data = await RouteRepo.create({
        ...req.body
      } as Route)
      return new SuccessResponse('success', data).send(res);
  }),
);

export default router;
