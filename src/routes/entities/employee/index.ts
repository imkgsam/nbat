import express from 'express';
import { SuccessResponse, FailureMsgResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/Role';
import validator from '../../../helpers/validator';
import schema from './schema';
import { ProtectedRequest } from 'app-request';
import EmployeeRepo from '../../../database/repository/EmployeeRepo';
import EntityRepo from '../../../database/repository/EntityRepo';
import Entity, { EntityTypeEnum } from '../../../database/model/Entity';
import Employee from '../../../database/model/Employee'
import User from '../../../database/model/User';
import { genEID } from '../../../helpers/utils'

const router = express.Router();

/**
 * 
 */
router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const employees = await EntityRepo.findAllEE();
    return new SuccessResponse('success', employees).send(res);
  }),
)

router.post( '/',
  validator(schema.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const myCompany = await EntityRepo.findOneVECompanyByName('潮州市美隆陶瓷实业有限公司')
    if(!myCompany){
      return new FailureMsgResponse('ml is missing').send(res)
    }
    const createdEntity = await EntityRepo.findOneOrCreate({
      name: req.body.entity.name,
      alias: req.body.entity.alias,
      etype: EntityTypeEnum.PERSON,
      scompany: myCompany._id,
      personal:{
        jobTitle: req.body.entity.personal?.jobTitle,
        sex: req.body.entity.personal?.sex,
        birth: req.body.entity.personal?.birth
      },
      common:{
        website: req.body.entity.common?.website,
        email: req.body.entity.common?.email,
        landline: req.body.entity.common?.landline,
        mobilePhone: req.body.entity.common?.mobilePhone,
        country: req.body.entity.common?.country,
        city: req.body.entity.common?.city,
        industry: req.body.entity.common?.industry,
        internalNote: req.body.entity.common?.internalNote
      },
      socialMedias:req.body.entity.socialMedias
    } as Entity)
    const createdEmployee = await EmployeeRepo.create({
      entity: createdEntity._id,
      etype: req.body.employee.etype,
      departments: req.body.employee.departments,
      manager: req.body.employee.manager,
      workPhone: req.body.employee.workPhone,
      workMobile: req.body.employee.workMobile,
      workEmail: req.body.employee.workEmail,
      EID: genEID(req.body.entity.name, req.body.employee.inauguratiionDate,req.body.entity.personal?.sex),
      ETL: req.body.employee.ETL,
      inauguratiionDate: req.body.employee.inauguratiionDate,
      probation:{
        period:90,
        startDate:req.body.employee.probation?.startDate,
        actualEndDate:req.body.employee.probation?.actualEndDate,
      },
      privacy:{
        family:{
          status: req.body.employee.privacy?.family?.status,
          dependentChildrenCount: req.body.employee.privacy?.family?.dependentChildrenCount
        },
      nationality:{
        country: req.body.employee.privacy?.nationality?.country,
        city: req.body.employee.privacy?.nationality?.city,
        birth: req.body.employee.privacy?.nationality?.birth,
        ID: req.body.employee.privacy?.nationality?.ID,
        passport: req.body.employee.privacy?.nationality?.passport
      },
      emergency:{
        contact: req.body.employee.privacy?.emergency?.contact,
        phone: req.body.employee.privacy?.emergency?.phone
      }
    },
    education:{
      qulification: req.body.employee.education?.qulification,
      school: req.body.employee.education?.school,
      graduatedAt: req.body.employee.education?.graduatedAt
    }
    } as Employee)
    createdEntity.employee = createdEmployee._id
    await EntityRepo.findOneByIdAndSetEmployee(createdEntity._id,createdEmployee._id)
    const employeeEntity = await EntityRepo.findOneEEbyId(createdEmployee._id)
    new SuccessResponse('Employee created successfully', employeeEntity).send(res);
  }),
)

router.post( '/enable',
  validator(schema.idee),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await EmployeeRepo.enable(req.body.entityId, req.body.employeeId)
    if(updatedOne){
      new SuccessResponse('Employee enabled successfully', updatedOne).send(res);
    }else{
      new FailureMsgResponse('Employee enable failure').send(res)
    }
  }),
)

router.post( '/disable',
  validator(schema.idee),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await EmployeeRepo.disable(req.body.entityId, req.body.employeeId)
    if(updatedOne){
      new SuccessResponse('Employee disabled successfully', updatedOne).send(res)
    }else{
      new FailureMsgResponse('Employee disabled failure').send(res)
    }
  }),
)

router.post( '/verify',
  validator(schema.idee),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedOne = await EmployeeRepo.verify(req.body.entityId, req.body.employeeId)
    if(updatedOne){
      new SuccessResponse('Employee verified successfully', updatedOne).send(res)
    }else{
      new FailureMsgResponse('Employee verified failure').send(res)
    }
  }),
)

router.post( '/createlogin',
  validator(schema.createUser),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createUser = await EmployeeRepo.createUser(
      req.body.entityId, 
      req.body.employeeId,{
        accountName: req.body.user.accountName,
        email: req.body.user.email,
        password: req.body.user.password,
        roles: req.body.user.roles
      } as User)
    if(createUser){
      new SuccessResponse('Employee\'s Login account created successfully', createUser).send(res)
    }else{
      new FailureMsgResponse('Employee\'s Login account creatation failure').send(res)
    }
  }),
)

router.post( '/enablelogin',
  validator(schema.ideeu),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedUser = await EmployeeRepo.enableLogin(
      req.body.entityId, 
      req.body.employeeId,
      req.body.userId
    )
    if(updatedUser){
      new SuccessResponse('Employee\'s Login account enabled successfully', updatedUser).send(res)
    }else{
      new FailureMsgResponse('Employee\'s Login account enable failure').send(res)
    }
  }),
)

router.post( '/disablelogin',
  validator(schema.ideeu),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const updatedUser = await EmployeeRepo.disableLogin(
      req.body.entityId, 
      req.body.employeeId,
      req.body.userId
    )
    if(updatedUser){
      new SuccessResponse('Employee\'s Login account disabled successfully', updatedUser).send(res)
    }else{
      new FailureMsgResponse('Employee\'s Login account disable failure').send(res)
    }
  }),
)

// router.put('/',
//   validator(schema.id),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedDepartment = await EmployeeRepo.update({
//       name: req.body.name,
//       _id: req.body.id,
//       parent: req.body.parent,
//       manager: req.body.manager
//     } as Employee);

//     return new SuccessResponse('Employee updated', updatedDepartment).send(res);
//   }),
// )

export default router;
