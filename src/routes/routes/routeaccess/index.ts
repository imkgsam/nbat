import express from 'express';
import { SuccessResponse, FailureMsgResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/Role';
import RouteRepo  from '../../../database/repository/RouteRepo';
import validator from '../../../helpers/validator';
import RouteAccessSchema from './schema';
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
  validator(RouteAccessSchema.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    
      const data = await RouteRepo.RouteAccess.create({
        ...req.body
      } as RouteAccess)
      return new SuccessResponse('success', data).send(res);
  }),
);

// router.put('/',
//   validator(RouteSchema.update),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updateOne = await RouteRepo.update({...req.body} as Route);
//     return new SuccessResponse('Route updated', updateOne).send(res);
//   }),
// );

// router.post( '/delete',
//   validator(RouteSchema.Id),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const deletedOne = await RouteRepo.removeOneById(req.body.id);
//     new SuccessResponse('Route deleted successfully', deletedOne).send(res);
//   }),
// );

// router.post( '/enable',
//   validator(RouteSchema.Id),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedOne = await RouteRepo.enable(req.body.id)
//     if(updatedOne){
//       new SuccessResponse('Route enabled successfully', updatedOne).send(res);
//     }else{
//       new FailureMsgResponse('Route enable failure').send(res)
//     }
//   }),
// );

// router.post( '/disable',
//   validator(RouteSchema.Id),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedOne = await RouteRepo.disable(req.body.id)
//     if(updatedOne){
//       new SuccessResponse('Route disabled successfully', updatedOne).send(res)
//     }else{
//       new FailureMsgResponse('Route disabled failure').send(res)
//     }
//   }),
// );

export default router;
