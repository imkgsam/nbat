import express from 'express';
import { SuccessResponse, FailureMsgResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/workon/Role';
import RouteRepo from '../../../database/repository/RouteRepo';
import validator, { ValidationSourceEnum } from '../../../helpers/validator';
import RouteSchema from './schema';
import Route from '../../../database/model/workon/route/Route';
import { ProtectedRequest } from 'app-request';

import RouteAccess from './routeaccess';
import RouteAuth from './routeauth';

const router = express.Router();


router.get('/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    try {
      const data = await RouteRepo.Route.findAll()
      const rt = JSON.parse(JSON.stringify(data).replaceAll('6550a08eb41da1257eda92d2', 'admin').replaceAll('6577ce21fd6e31603d5f3389', 'common'))
      return new SuccessResponse('success', rt).send(res);
    } catch (e) {
      console.log(e)
    }
  }),
);

router.get('/get-async-routes',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    try {
      const data = await RouteRepo.Route.fitler({ 'meta.enabled': true })
      const rt = JSON.parse(JSON.stringify(data).replaceAll('6550a08eb41da1257eda92d2', 'admin').replaceAll('6577ce21fd6e31603d5f3389', 'common'))
      return new SuccessResponse('success', rt).send(res);
    } catch (e) {
      console.log(e)
    }
  }),
);

router.get('/get-async-routes2',
  asyncHandler(async (req: ProtectedRequest, res) => {
    let k = await RouteRepo.Route.getAsyncRoutes(req.account._id, req.account.roles.map(each => each._id))
    return new SuccessResponse('ok',k).send(res);
  }),
);

router.post('/',
  validator(RouteSchema.Route.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const data = await RouteRepo.Route.create({
      ...req.body
    } as Route)
    return new SuccessResponse('success', data).send(res);
  }),
);

router.put('/',
  validator(RouteSchema.Route.update),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updateOne = await RouteRepo.Route.update({ ...req.body } as Route);
    return new SuccessResponse('Route updated', updateOne).send(res);
  }),
);

router.post('/delete',
  validator(RouteSchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    // const deletedOne = await RouteRepo.Route.removeOneById(req.body.id);
    const count = await RouteRepo.Route.removeChildrenByParentId(req.body.id,true);
    if(count){
      new SuccessResponse(`Route and ${count -1 } children deleted successfully`, {count}).send(res);
    }else{
      new FailureMsgResponse('Route deleted failure').send(res)
    }
  }),
);

router.get('/detail',
  validator(RouteSchema.Id, ValidationSourceEnum.QUERY ),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const rt =  await RouteRepo.Route.detail(req.query.id as string);
    if(rt){
      new SuccessResponse(`success`, rt).send(res);
    }else{
      new FailureMsgResponse('failure').send(res)
    }
  }),
);

router.get('/get-auths_options',
  validator(RouteSchema.Id, ValidationSourceEnum.QUERY),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const rt =  await RouteRepo.Route.detail(req.query.id as string);
    if(rt){
      new SuccessResponse(`success`, rt.meta.auths_options).send(res);
    }else{
      new FailureMsgResponse('failure').send(res)
    }
  }),
);

router.post('/enable',
  validator(RouteSchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await RouteRepo.Route.enable(req.body.id)
    if (updatedOne) {
      new SuccessResponse('Route enabled successfully', updatedOne).send(res);
    } else {
      new FailureMsgResponse('Route enable failure').send(res)
    }
  }),
);

router.post('/disable',
  validator(RouteSchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await RouteRepo.Route.disable(req.body.id)
    if (updatedOne) {
      new SuccessResponse('Route disabled successfully', updatedOne).send(res)
    } else {
      new FailureMsgResponse('Route disabled failure').send(res)
    }
  }),
);

router.use('/access', RouteAccess)

router.use('/auth', RouteAuth)

export default router;
