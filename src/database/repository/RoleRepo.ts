import Role, { RoleModel } from '../model/workon/Role';
import { Types } from "mongoose"

/**
 * 通过单个Code寻找一个Role
 * @param code 
 * @returns 
 */
async function findByCode(code: string): Promise<Role | null> {
  return RoleModel.findOne({ code: code, 'meta.enabled': true }).lean().exec();
}
/**
 * 通过code 队列寻找所有符合的Roles
 * @param codes 
 * @returns 
 */
async function findByCodes(codes: string[]): Promise<Role[]> {
  return RoleModel.find({ code: { $in: codes }, 'meta.enabled': true }).lean().exec();
}
/**
 * 新建
 * @param newRole 
 * @returns 
 */
async function create(newRole: Role): Promise<Role> {
  const createdRole = await RoleModel.create(newRole);
  return createdRole.toObject();
}
/**
 * 开启
 * @param roleId 
 * @returns 
 */
async function enable(roleId: Types.ObjectId): Promise<Role | null> {
  return RoleModel.findByIdAndUpdate(roleId,{'meta.enabled':true},{ new: true }).lean().exec();
}

/**
 * 停用
 * @param roleId 
 * @returns 
 */
async function disable(roleId: Types.ObjectId): Promise<Role | null> {
  return RoleModel.findByIdAndUpdate(roleId,{'meta.enabled':false},{ new: true }).lean().exec();
}

/**
 * 搜索所有符合的Roles
 * @param filters 
 * @returns 
 */
async function filters(filters: any = {}) : Promise<Role[]>{
  return RoleModel.find(filters).lean().exec()
}
/**
 * 更新
 * @param updatedOne 
 * @returns 
 */
async function update(updatedOne: Role): Promise<Role | null> {
  return RoleModel.findByIdAndUpdate(updatedOne._id,{$set: updatedOne},{ new: true }).lean().exec();
}




export default {
  //find
  findByCode,
  findByCodes,
  filters,
  //create or update
  create,
  update,
  enable,
  disable,
};
