import Department, { DepartmentModel } from '../model/finished/Department';
import { Types } from "mongoose"
import EntityRepo from '../repository/EntityRepo'



async function filters(filters: any = {}): Promise<Department[]> {
  return DepartmentModel.find(filters).populate('manager', 'name').populate('company', 'name').lean().exec();
}


async function findByName(name: string): Promise<Department | null> {
  return DepartmentModel.findOne({ name: name, 'meta.enabled': true }).lean().exec();
}

async function getDetailsById(id: string): Promise<Department | null> {
  return DepartmentModel.findOne({ _id: id })
    .populate('manager')
    .populate('company')
    .populate('parent')
    .lean().exec();
}


async function findOneByIdOrName(idOrName: string | Types.ObjectId): Promise<Department | null> {
  return DepartmentModel.findOne({
    $and: [
      {
        'meta.enable': true,
        'meta.verified': true,
        employee: { $ne: null },
      },
      { $or: [{ _id: idOrName }, { name: idOrName }] },
    ],
  })
    .lean()
    .exec();
}

async function create(newDepartment: Department): Promise<Department> {
  if (newDepartment.manager) {
    const manager = await EntityRepo.findOneByIdOrName(newDepartment.manager)
    if (manager)
      newDepartment.manager = manager._id
  }
  if (newDepartment.parent) {
    const parent = await findOneByIdOrName(newDepartment.parent)
    if (parent)
      newDepartment.parent = parent._id
  }
  const createdOne = await DepartmentModel.create(newDepartment);
  return createdOne.toObject();
}

async function update(updatedOne: Department): Promise<Department | null> {
  if (updatedOne.manager) {
    const manager = await EntityRepo.findOneByIdOrName(updatedOne.manager)
    if (manager)
      updatedOne.manager = manager._id
  }
  if (updatedOne.parent) {
    const parent = await findOneByIdOrName(updatedOne.parent)
    if (parent)
      updatedOne.parent = parent._id
  }
  return DepartmentModel.findByIdAndUpdate(updatedOne._id, { $set: updatedOne }, { new: true }).lean().exec();
}


async function enable(id: Types.ObjectId): Promise<Department | null> {
  return DepartmentModel.findOneAndUpdate({ _id: id /**manager:{ $ne:null }, */, 'meta.enabled': false }, { 'meta.enabled': true }, { new: true }).lean().exec();
}

async function disable(id: Types.ObjectId): Promise<Department | null> {
  return DepartmentModel.findOneAndUpdate({ _id: id, 'meta.enabled': true }, { 'meta.enabled': false }, { new: true }).lean().exec();
}

async function removeOneById(id: Types.ObjectId): Promise<Department | null> {
  const deletedOne = await DepartmentModel.findOneAndDelete({ _id: id }).lean().exec()
  const children = await DepartmentModel.find({ parent: id }).lean().exec()
  if (children.length) {
    await DepartmentModel.updateMany({ "_id": { $in: children.map(each => each._id) } }, { $set: { parent: deletedOne?.parent || null } })
  }
  return deletedOne
}


export default {
  filters,
  findByName,
  getDetailsById,
  create,
  update,
  enable,
  disable,
  removeOneById
};
