import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import authorization from '../../auth/authorization';
import { RoleCodeEnum } from '../../database/model/Role';
import RouteRepo  from '../../database/repository/RouteRepo';
import validator from '../../helpers/validator';
import schema from './schema';
import Route from '../../database/model/Route';

const router = express.Router();

router.get(
  '/check4roles',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const data = `hello f`
    return new SuccessResponse('success', data).send(res);
  }),
);


router.get(
  '/route/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    try{
      const data = await RouteRepo.findAll()
      return new SuccessResponse('success', data).send(res);
    }catch(e){
      console.log(e)
    }
  }),
);

router.post(
  '/route',
  validator(schema.routeCreate),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
      const data = await RouteRepo.createRoute({
        path:req.body.path,
        name:req.body.name,
        component:req.body.component,
        redirect:req.body.redirect,
        meta:req.body.meta,
        parent: req.body.parent
      } as Route)
      return new SuccessResponse('success', data).send(res);
  }),
);

export default router;
