import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import schema from './schema';
import authorization from '../../auth/authorization';
import { RoleCodeEnum } from '../../database/model/Role';
import AttributeRepo from "../../database/repository/AttributeRepo"
import validator, { ValidationSourceEnum } from '../../helpers/validator';
import { ProtectedRequest } from 'app-request';
import Attribute from '../../database/model/Attribute';
import AttributeValue from '../../database/model/AttributeValue';


const router = express.Router();

router.get(
  '/attribute/all',
  // authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const data = await AttributeRepo.findAllAttributes({})
    return new SuccessResponse('success', data).send(res);
  }),
);

router.get(
  '/attribute/detail',
  validator(schema.Id,ValidationSourceEnum.QUERY),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const { id }  = req.query
    const data = await AttributeRepo.findOneAttributeById(id as string)
    return new SuccessResponse('success', data).send(res);
  }),
);

router.post( '/',
  validator(schema.attribute.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await AttributeRepo.createAttribute({
      name: req.body.name,
      meta: { enabled: req.body.meta?.enabled }
    } as Attribute);
    new SuccessResponse('Attribute created successfully', createdOne).send(res);
  }),
);



router.post( '/value',
  validator(schema.value.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdOne = await AttributeRepo.createAttributeValue({
      value: req.body.value,
      abbr: req.body.abbr,
      attribute: req.body.attribute
    } as AttributeValue);
    new SuccessResponse('AttributeValue created successfully', createdOne).send(res);
  }),
);

export default router;
