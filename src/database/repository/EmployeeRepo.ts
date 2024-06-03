import Employee, { EmployeeModel } from '../model/Employee';
import Entity, { EntityModel } from '../model/Entity';
import { Types } from 'mongoose';
import Account, {AccountModel} from '../model/Account';
import bcrypt from 'bcrypt';
import RoleRepo from './RoleRepo';


async function findAll(): Promise<Employee[]> {
  return (
    EmployeeModel.find({})
    .populate('entity')
    .populate('departments')
    .lean()
    .exec()
  );
}

async function create(newEmployee: Employee): Promise<Employee> {
  const createdOne = await EmployeeModel.create(newEmployee);
  return createdOne.toObject();
}

async function enable(entityId: Types.ObjectId, employeeId: Types.ObjectId): Promise<Entity | null> {
  const [entity, employee] = await Promise.all([EntityModel.findOne({_id:entityId,'meta.verified':true}) , EmployeeModel.findById(employeeId)])
  if(entity && employee && entity.employee?.toString() === employee._id.toString()){
    entity.meta.enabled = true
    employee.meta.enabled = true
    await Promise.all([entity.save(), employee.save()])
    return EntityModel.findById(entityId).populate('employee').lean().exec();
  }else{
   return null;
  }
}

async function disable(entityId: Types.ObjectId, employeeId: Types.ObjectId): Promise<Entity | null> {
  const [entity, employee] = await Promise.all([EntityModel.findById(entityId) , EmployeeModel.findById(employeeId)])
  if(entity && employee && entity.employee?.toString() === employee._id.toString()){
    entity.meta.enabled = false
    employee.meta.enabled = false
    await Promise.all([entity.save(), employee.save()])
    return EntityModel.findById(entityId).populate('employee').lean().exec();
  }else{
   return null;
  }
}

async function verify(entityId: Types.ObjectId, employeeId: Types.ObjectId): Promise<Entity | null> {
  const [entity, employee] = await Promise.all([EntityModel.findById(entityId) , EmployeeModel.findById(employeeId)])
  if(entity && employee && entity.employee?.toString() === employee._id.toString()){
    entity.meta.verified = true
    await entity.save()
    return EntityModel.findById(entityId).populate('employee').lean().exec()
  }else{
    return null;
  }
}

async function createUser(entityId: Types.ObjectId, employeeId: Types.ObjectId, newUser: Account): Promise<Account | null> {
  const [entity, employee, user] = await Promise.all([EntityModel.findById(entityId) ,EmployeeModel.findById(employeeId), AccountModel.findOne({email: newUser.binding.email})])
  if(entity && employee && !entity.account && !user && entity.employee?.toString() === employee._id.toString() && employee.entity.toString() === entity._id.toString()){
    const passwordHash = await bcrypt.hash(newUser.security.password as string, 10)
    newUser.security.password = passwordHash
    const roles = await RoleRepo.findByCodes(newUser.roles as any)
    newUser.roles = roles.map(each=>each._id) as any
    const createdUser = await AccountModel.create(newUser)
    if(createdUser){
      entity.account = createdUser._id
      await entity.save()
    }
    return AccountModel.findOne({email: newUser.binding.email}).lean().exec()
  }else{
    return null;
  }
}

async function enableLogin(entityId: Types.ObjectId, employeeId: Types.ObjectId, userId: Types.ObjectId): Promise<Account | null> {
  const [entity, employee, user] = await Promise.all([EntityModel.findById(entityId) ,EmployeeModel.findById(employeeId), AccountModel.findById(userId)])
  if(entity && employee && user && entity.account && entity.employee?.toString() === employee._id.toString() && employee.entity.toString() === entity._id.toString() && entity.account.toString() === user._id.toString()){
    return AccountModel.findOneAndUpdate({_id: userId,'meta.verified':true},{'meta.enabled':true},{new:true}).lean().exec()
  }else{
    return null;
  }
}

async function disableLogin(entityId: Types.ObjectId, employeeId: Types.ObjectId, userId: Types.ObjectId): Promise<Account | null> {
  const [entity, employee, user] = await Promise.all([EntityModel.findById(entityId) ,EmployeeModel.findById(employeeId), AccountModel.findById(userId)])
  if(entity && employee && user && entity.account && entity.employee?.toString() === employee._id.toString() && employee.entity.toString() === entity._id.toString() && entity.account.toString() === user._id.toString()){
    return AccountModel.findOneAndUpdate({_id: userId},{'meta.enabled':false},{new:true}).lean().exec()
  }else{
    return null;
  }
}

async function filters( filters: any ): Promise<Employee[]> {
  if(Object.keys(filters).includes('meta')){
    for (let key of Object.keys(filters.meta)){
      filters[`meta.${key}`] = filters.meta[key]
    }
    delete filters.meta
  }
  console.log(filters)
  return EmployeeModel.find(filters).populate('account').lean().exec();
}

export default {
  create,
  enable,
  disable,
  findAll,
  verify,
  createUser,
  enableLogin,
  disableLogin,
  filters
};
