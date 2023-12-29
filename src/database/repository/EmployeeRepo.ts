import Employee, { EmployeeModel } from '../model/Employee';
import Entity, { EntityModel } from '../model/Entity';
import { Types } from 'mongoose';
import EntityRepo from './EntityRepo';
import User, {UserModel} from '../model/User';
import bcrypt from 'bcrypt';
import RoleRepo from './RoleRepo';


async function findAll(): Promise<Employee[]> {
  return (
    EmployeeModel.find({})
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

async function createUser(entityId: Types.ObjectId, employeeId: Types.ObjectId, newUser: User): Promise<User | null> {
  const [entity, employee, user] = await Promise.all([EntityModel.findById(entityId) ,EmployeeModel.findById(employeeId), UserModel.findOne({email: newUser.email})])
  if(entity && employee && !entity.user && !user && entity.employee?.toString() === employee._id.toString() && employee.entity.toString() === entity._id.toString()){
    const passwordHash = await bcrypt.hash(newUser.password as string, 10)
    newUser.password = passwordHash
    const roles = await RoleRepo.findByCodes(newUser.roles as any)
    newUser.roles = roles.map(each=>each._id) as any
    const createdUser = await UserModel.create(newUser)
    if(createdUser){
      entity.user = createdUser._id
      await entity.save()
    }
    return UserModel.findOne({email: newUser.email}).lean().exec()
  }else{
    return null;
  }
}

async function enableLogin(entityId: Types.ObjectId, employeeId: Types.ObjectId, userId: Types.ObjectId): Promise<User | null> {
  const [entity, employee, user] = await Promise.all([EntityModel.findById(entityId) ,EmployeeModel.findById(employeeId), UserModel.findById(userId)])
  if(entity && employee && user && entity.user && entity.employee?.toString() === employee._id.toString() && employee.entity.toString() === entity._id.toString() && entity.user.toString() === user._id.toString()){
    return UserModel.findOneAndUpdate({_id: userId,'meta.verified':true},{'meta.enabled':true},{new:true}).lean().exec()
  }else{
    return null;
  }
}
async function disableLogin(entityId: Types.ObjectId, employeeId: Types.ObjectId, userId: Types.ObjectId): Promise<User | null> {
  const [entity, employee, user] = await Promise.all([EntityModel.findById(entityId) ,EmployeeModel.findById(employeeId), UserModel.findById(userId)])
  if(entity && employee && user && entity.user && entity.employee?.toString() === employee._id.toString() && employee.entity.toString() === entity._id.toString() && entity.user.toString() === user._id.toString()){
    return UserModel.findOneAndUpdate({_id: userId},{'meta.enabled':false},{new:true}).lean().exec()
  }else{
    return null;
  }
}

export default {
  create,
  enable,
  disable,
  findAll,
  verify,
  createUser,
  enableLogin,
  disableLogin
};
