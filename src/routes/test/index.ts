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

export default router;
