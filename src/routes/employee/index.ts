import express from 'express';
import { SuccessResponse, FailureMsgResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import authorization from '../../auth/authorization';
import { RoleCodeEnum } from '../../database/model/Role';
import validator from '../../helpers/validator';
import schema from './schema';
import { ProtectedRequest } from 'app-request';
import EmployeeRepo from '../../database/repository/EmployeeRepo';
import EntityRepo from '../../database/repository/EntityRepo';
import Entity, { EntityTypeEnum } from '../../database/model/Entity';
import Employee from '../../database/model/Employee'
import User from '../../database/model/Account';
import { genEID } from '../../helpers/utils'

const router = express.Router();

router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    const employees = await EmployeeRepo.findAll();
    return new SuccessResponse('success', employees).send(res);
  }),
)

// router.post( '/pfilters',
//   validator(schema.Employee.filters),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const { filters } = req.body
//     const datas = await EntityRepo.Employee.filter(filters)
//     let {currentPage, pageSize} = req.body
//     if(!currentPage || currentPage<=0){
//       currentPage = 1
//     }
//     if(!pageSize || pageSize <=0){
//       pageSize = 10
//     }
//     const rt = datas.slice(pageSize*(currentPage-1),currentPage*pageSize)
//     new SuccessResponse('success', {
//       list: rt,
//       total: datas.length,
//       pageSize: pageSize,
//       currentPage: currentPage 
//     }).send(res);
//   }),
// );

// router.post( '/',
//   validator(schema.Employee.create),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const myCompany = await EntityRepo.findOneVECompanyByName('潮州市美隆陶瓷实业有限公司')
//     if(!myCompany){
//       return new FailureMsgResponse('ml is missing').send(res)
//     }
//     const createdEntity = await EntityRepo.findOneOrCreate({
//       ...req.body,
//       etype: EntityTypeEnum.PERSON,
//       scompany: myCompany._id,
//     } as Entity)
//     const createdEmployee = await EmployeeRepo.create({
//       entity: createdEntity._id,
//       ...req.body.employee,
//       EID: genEID(req.body.entity.name, req.body.employee.inauguratiionDate,req.body.entity.personal?.sex),
//     } as Employee)
//     createdEntity.employee = createdEmployee._id
//     await EntityRepo.findOneByIdAndSetEmployee(createdEntity._id,createdEmployee._id)
//     const employeeEntity = await EntityRepo.findOneEEbyId(createdEmployee._id)
//     new SuccessResponse('Employee created successfully', employeeEntity).send(res);
//   }),
// )

// router.post( '/enable',
//   validator(schema.Employee.idee),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedOne = await EmployeeRepo.enable(req.body.entityId, req.body.employeeId)
//     if(updatedOne){
//       new SuccessResponse('Employee enabled successfully', updatedOne).send(res);
//     }else{
//       new FailureMsgResponse('Employee enable failure').send(res)
//     }
//   }),
// )

// router.post( '/disable',
//   validator(schema.Employee.idee),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedOne = await EmployeeRepo.disable(req.body.entityId, req.body.employeeId)
//     if(updatedOne){
//       new SuccessResponse('Employee disabled successfully', updatedOne).send(res)
//     }else{
//       new FailureMsgResponse('Employee disabled failure').send(res)
//     }
//   }),
// )

// router.post( '/verify',
//   validator(schema.Employee.idee),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedOne = await EmployeeRepo.verify(req.body.entityId, req.body.employeeId)
//     if(updatedOne){
//       new SuccessResponse('Employee verified successfully', updatedOne).send(res)
//     }else{
//       new FailureMsgResponse('Employee verified failure').send(res)
//     }
//   }),
// )

// router.post( '/createlogin',
//   validator(schema.Employee.createUser),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const createUser = await EmployeeRepo.createUser(
//       req.body.entityId, 
//       req.body.employeeId,{
//         accountName: req.body.user.accountName,
//         email: req.body.user.email,
//         password: req.body.user.password,
//         roles: req.body.user.roles
//       } as User)
//     if(createUser){
//       new SuccessResponse('Employee\'s Login account created successfully', createUser).send(res)
//     }else{
//       new FailureMsgResponse('Employee\'s Login account creatation failure').send(res)
//     }
//   }),
// )

// router.post( '/enablelogin',
//   validator(schema.Employee.ideeu),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedUser = await EmployeeRepo.enableLogin(
//       req.body.entityId, 
//       req.body.employeeId,
//       req.body.userId
//     )
//     if(updatedUser){
//       new SuccessResponse('Employee\'s Login account enabled successfully', updatedUser).send(res)
//     }else{
//       new FailureMsgResponse('Employee\'s Login account enable failure').send(res)
//     }
//   }),
// )

// router.post( '/disablelogin',
//   validator(schema.Employee.ideeu),
//   authorization(RoleCodeEnum.ADMIN),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const updatedUser = await EmployeeRepo.disableLogin(
//       req.body.entityId, 
//       req.body.employeeId,
//       req.body.userId
//     )
//     if(updatedUser){
//       new SuccessResponse('Employee\'s Login account disabled successfully', updatedUser).send(res)
//     }else{
//       new FailureMsgResponse('Employee\'s Login account disable failure').send(res)
//     }
//   }),
// )

export default router;
