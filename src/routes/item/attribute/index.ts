import express from 'express';
import { SuccessResponse,FailureMsgResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import AttributeSchema from './schema';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/Role';
import AttributeRepo from "../../../database/repository/AttributeRepo"
import validator, { ValidationSourceEnum } from '../../../helpers/validator';
import { ProtectedRequest } from 'app-request';
import Attribute from '../../../database/model/Attribute';
import AttributeValue from '../../../database/model/AttributeValue';


const router = express.Router();

router.get(
  '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const data = await AttributeRepo.filter({})
    return new SuccessResponse('success', data).send(res);
  }),
);

router.get(
  '/allpublic',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const data = await AttributeRepo.filter({'meta.enabled':true})
    return new SuccessResponse('success', data).send(res);
  }),
);

router.get(
  '/detail',
  validator(AttributeSchema.Id, ValidationSourceEnum.QUERY),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const { id }  = req.query
    const data = await AttributeRepo.detail(id as string)
    return new SuccessResponse('success', data).send(res);
  }),
);

router.post( '/',
  validator(AttributeSchema.attribute.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await AttributeRepo.create({
      name: req.body.name,
      code: req.body.code,
      values: req.body.values,
      meta: { enabled: req.body.meta?.enabled }
    } as Attribute);
    new SuccessResponse('Attribute created successfully', createdOne).send(res);
  }),
);


router.post( '/filters',
  validator(AttributeSchema.attribute.filters),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    // interface Filters {
    //   code?: string,
    //   name?: string,
    //   meta?:{
    //     enabled: boolean
    //   }
    // }
    const { filters } = req.body
    const datas = await AttributeRepo.filter(filters)
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


router.put('/',
  validator(AttributeSchema.attribute.update),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await AttributeRepo.update({...req.body} as Attribute);
    return new SuccessResponse('Attribute updated', updatedOne).send(res);
  }),
);


router.post( '/enable',
  validator(AttributeSchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await AttributeRepo.enable(req.body.id)
    if(updatedOne){
      new SuccessResponse('Attribute enabled successfully', updatedOne).send(res);
    }else{
      new FailureMsgResponse('Attribute enable failure').send(res)
    }
  }),
);


router.post( '/disable',
  validator(AttributeSchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await AttributeRepo.disable(req.body.id)
    if(updatedOne){
      new SuccessResponse('Attribute disabled successfully', updatedOne).send(res)
    }else{
      new FailureMsgResponse('Attribute disabled failure').send(res)
    }
  }),
);

router.post( '/delete',
  validator(AttributeSchema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const deletedOne = await AttributeRepo.removeOneById(req.body.id);
    new SuccessResponse('Attribute deleted successfully', deletedOne).send(res);
  }),
);


export default router;
