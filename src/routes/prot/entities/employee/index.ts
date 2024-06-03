import express from 'express';
import { SuccessResponse, FailureMsgResponse } from '../../../../core/ApiResponse';
import asyncHandler from '../../../../helpers/asyncHandler';
import authorization from '../../../../auth/authorization';
import { RoleCodeEnum } from '../../../../database/model/Role';
import validator from '../../../../helpers/validator';
import schema from '../schema';
import { ProtectedRequest } from 'app-request';
import EmployeeRepo from '../../../../database/repository/EmployeeRepo';
import EntityRepo from '../../../../database/repository/EntityRepo';
import Entity, { EntityTypeEnum } from '../../../../database/model/Entity';


const router = express.Router();


/**
 * 获取所有员工
 * 完整列表
 */
router.get( '/all',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    let employees = await EntityRepo.Employee.filter({meta:{isEmployee:true}} as Entity);
    return new SuccessResponse('success', employees).send(res);
  }),
)

/**
 * 获取所有公开的员工
 * 完整列表
 */
router.get( '/allpublic',
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req, res) => {
    let employees = await EntityRepo.Employee.filter({meta:{isEmployee:true,enabled: true, verified: true}} as Entity);
    return new SuccessResponse('success', employees).send(res);
  }),
)

/**
 * 筛选员工
 * 按页返回
 */
router.post( '/pfilters',
  validator(schema.Employee.filters),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { filters } = req.body
    filters.meta.isEmployee = true
    let datas = await EntityRepo.Employee.filter(filters)
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

router.post( '/delete',
  validator(schema.Id),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const deletedOne = await EntityRepo.Employee.deleteOne(req.body.id);
    new SuccessResponse('Department deleted successfully', deletedOne).send(res);
  }),
);

/**
 * 新增成员信息
 */
router.post( '/',
  validator(schema.Employee.create),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdEntity = await EntityRepo.Employee.create({
      ...req.body,
      etype: EntityTypeEnum.PERSON,
    } as Entity)
    new SuccessResponse('Employee created successfully', createdEntity).send(res);
  }),
)

/**
 * 修改成员信息
 */
router.put( '/',
  validator(schema.Employee.update),
  authorization(RoleCodeEnum.ADMIN),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdEntity = await EntityRepo.Employee.update({
      ...req.body,
      etype: EntityTypeEnum.PERSON,
    } as Entity)
    new SuccessResponse('Employee updated successfully', createdEntity).send(res);
  }),
)

// function formatEntityEID(data: any[]){
//   return data.map(each=>{
//     if(each?.employee){
//       const employee = each?.employee as any
//       if(employee.EID){
//         each.employee.EID = each?.employee?.EID?.btype?.startsWith + '-' + employee.EID.num
//       }
//     }
//     return each
//   })
// }

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
