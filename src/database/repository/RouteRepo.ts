// import Route, { RouteChildren, RouteModel, RouteChildrenModel } from '../model/Route';
import Route, { RouteModel} from '../model/Route';
import RoleRepo from './RoleRepo';
import { Types } from 'mongoose'

// 获取所有路由
async function findAll(): Promise<Route[]> {
  return RouteModel
    .find({})
    .lean()
    .exec();
}

async function fitler(filters: object): Promise<Route[]> {
  return RouteModel
    .find(filters)
    .lean()
    .exec();
}

async function findByPath(path: string): Promise<Route | null> {
  return RouteModel.findOne({ path: path, 'meta.enabled': true }).lean().exec();
}

async function create(newOne: Route): Promise<Route>{
  if(newOne.meta.roles){
    const k = newOne.meta.roles.map(each=> each.toString())
    const roles = await RoleRepo.findByCodes(k)
    newOne.meta.roles = roles.map(each=>each._id)
  }
  let parent = null
  if(newOne.parent){
    const parentObj = await RouteModel.findById(newOne.parent)
    if(parentObj){
      parent = parentObj._id
    }
  }
  const createdOne = await RouteModel.create({...newOne,parent});
  return createdOne.toObject();
}

async function update(updateOne: Route): Promise<Route | null>{
  if(updateOne.meta.roles){
    const k = updateOne.meta.roles.map(each=> each.toString())
    const roles = await RoleRepo.findByCodes(k)
    updateOne.meta.roles = roles.map(each=>each._id)
  }
  let parent = null
  if(updateOne.parent){
    const parentObj = await RouteModel.findById(updateOne.parent)
    if(parentObj){
      parent = parentObj._id
    }
  }
  return RouteModel.findByIdAndUpdate(updateOne._id,{$set: {...updateOne,parent}},{ new: true }).lean().exec();
}

async function enable(id: Types.ObjectId): Promise<Route | null> {
  return RouteModel.findOneAndUpdate({_id:id ,  'meta.enabled':false},{'meta.enabled':true },{ new: true }).lean().exec();
}

async function disable(id: Types.ObjectId): Promise<Route | null> {
  return RouteModel.findOneAndUpdate({ _id: id, 'meta.enabled': true},{'meta.enabled':false},{ new: true }).lean().exec();
}

async function removeOneById(id: Types.ObjectId): Promise<Route | null> {
  const deletedOne = await RouteModel.findOneAndDelete({_id: id}).lean().exec()
  const children = await RouteModel.find({parent: id}).lean().exec()
  if(children.length){
    await RouteModel.updateMany({"_id":{$in: children.map(each=> each._id)}},{ $set:{parent: deletedOne?.parent || null }})
  }
  return deletedOne
}

export default {
  findAll,
  fitler,
  findByPath,
  create,
  update,
  enable,
  disable,
  removeOneById
};
