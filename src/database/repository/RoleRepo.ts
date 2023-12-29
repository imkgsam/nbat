import Role, { RoleModel } from '../model/Role';
import { Types } from "mongoose"

async function findByCode(code: string): Promise<Role | null> {
  return RoleModel.findOne({ code: code, 'meta.enabled': true }).lean().exec();
}

async function findByCodes(codes: string[]): Promise<Role[]> {
  return RoleModel.find({ code: { $in: codes }, 'meta.enabled': true })
    .lean()
    .exec();
}

async function findAll(): Promise<Role[]> {
  return RoleModel.find({})
    // .select("-_id")
    .lean()
    .exec();
}

async function create(newRole: Role): Promise<Role> {
  const createdRole = await RoleModel.create(newRole);
  return createdRole.toObject();
}

async function enable(roleId: Types.ObjectId): Promise<Role | null> {
  return RoleModel.findByIdAndUpdate(roleId,{'meta.enabled':true},{ new: true }).lean().exec();
}

async function disable(roleId: Types.ObjectId): Promise<Role | null> {
  return RoleModel.findByIdAndUpdate(roleId,{'meta.enabled':false},{ new: true }).lean().exec();
}

export default {
  create,
  enable,
  disable,
  findAll,
  findByCode,
  findByCodes,
};
