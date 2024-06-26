import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import authorization from '../../auth/authorization';
import { RoleCodeEnum } from '../../database/model/workon/Role';
import mongoose from 'mongoose'
import { findOneSpotInSequence, findNSpotInSequence } from '../../helpers/utils';


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
  '/dbmodels/all',
  asyncHandler(async (req, res) => {
    const schemas = [] as any[]
    mongoose.modelNames().forEach(function (modelName) {
      schemas.push(modelName);
    })
    return new SuccessResponse('success', schemas).send(res);
  }))



router.get(
  '/findspot',
  asyncHandler(async (req, res) => {
    let arr =[-2]
    arr.sort((a, b) => a - b)
    let t = findNSpotInSequence(arr,arr[0],arr[arr.length-1],1)
    return new SuccessResponse('success', t).send(res)
  }))

export default router;
