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
import { ProtectedRequest } from 'app-request';

const router = express.Router();


router.get('/all',
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

router.post('/',
  validator(RouteSchema.RouteAccess.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
      const data = await RouteRepo.RouteAccess.create({
        ...req.body
      } as RouteAccess)
      return new SuccessResponse('success', data).send(res);
  }),
);

router.post('/paged-filters',
  validator(RouteSchema.RouteAccess.paged_filters),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { filters } = req.body
    console.log(filters)
    const datas = await RouteRepo.RouteAccess.filters(filters)
    console.log(datas)
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
)

router.post('/',
  validator(RouteSchema.RouteAccess.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    console.log(req.body)
    const data = await RouteRepo.RouteAccess.create({
      ...req.body
    } as RouteAccess)
    return new SuccessResponse('success', data).send(res);
  }),
);

router.put('/',
  validator(RouteSchema.RouteAccess.update),
  asyncHandler(async (req: ProtectedRequest, res) => {
    console.log(req.body)
    const updateOne = await RouteRepo.RouteAccess.update({ ...req.body } as RouteAccess);
    return new SuccessResponse('Route updated', updateOne).send(res);
  }),
);

router.post('/delete',
  validator(RouteSchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const deletedOne = await RouteRepo.RouteAccess.removeOneById(req.body.id);
    new SuccessResponse('RouteAccess deleted successfully', deletedOne).send(res);
  }),
);

router.post('/enable',
  validator(RouteSchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await RouteRepo.RouteAccess.enable(req.body.id)
    if (updatedOne) {
      new SuccessResponse('RouteAccess enabled successfully', updatedOne).send(res);
    } else {
      new FailureMsgResponse('RouteAccess enable failure').send(res)
    }
  }),
);

router.post('/disable',
  validator(RouteSchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await RouteRepo.RouteAccess.disable(req.body.id)
    if (updatedOne) {
      new SuccessResponse('RouteAccess disabled successfully', updatedOne).send(res)
    } else {
      new FailureMsgResponse('RouteAccess disabled failure').send(res)
    }
  }),
);


export default router;
