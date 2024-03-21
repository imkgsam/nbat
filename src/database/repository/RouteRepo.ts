// import Route, { RouteChildren, RouteModel, RouteChildrenModel } from '../model/Route';
import Route, { RouteModel} from '../model/Route';
import RouteAccess, { RouteAccessModel} from '../model/RouteAccess';
import RouteAuth, { RouteAuthModel } from '../model/RouteAuth';
import RoleRepo from './RoleRepo';
import { Types } from 'mongoose'



// ----------------------------- route repo ops --------------------------------
// 获取所有路由
const Route = {
  findAll : async function findAll(): Promise<Route[]> {
    return RouteModel
      .find({})
      .lean()
      .exec();
  },
  
  fitler: async function fitler(filters: object): Promise<Route[]> {
    return RouteModel
      .find(filters)
      .lean()
      .exec();
  },
  
  findByPath: async function findByPath(path: string): Promise<Route | null> {
    return RouteModel.findOne({ path: path, 'meta.enabled': true }).lean().exec();
  },
  
  create: async function create(newOne: Route): Promise<Route>{
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
  },
  
  update: async function update(updateOne: Route): Promise<Route | null>{
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
  },
  
  enable: async function enable(id: Types.ObjectId): Promise<Route | null> {
    return RouteModel.findOneAndUpdate({_id:id ,  'meta.enabled':false},{'meta.enabled':true },{ new: true }).lean().exec();
  },
  
  disable: async function disable(id: Types.ObjectId): Promise<Route | null> {
    return RouteModel.findOneAndUpdate({ _id: id, 'meta.enabled': true},{'meta.enabled':false},{ new: true }).lean().exec();
  },
  
  removeOneById: async function removeOneById(id: Types.ObjectId): Promise<Route | null> {
    const deletedOne = await RouteModel.findOneAndDelete({_id: id}).lean().exec()
    const children = await RouteModel.find({parent: id}).lean().exec()
    if(children.length){
      await RouteModel.updateMany({"_id":{$in: children.map(each=> each._id)}},{ $set:{parent: deletedOne?.parent || null }})
    }
    return deletedOne
  },


  // getAsyncRoutes: async function getAsyncRoutes(user?: Types.ObjectId, role?: Types.ObjectId) : Promise<Route[]>{
  //   let ras = await RouteAccessModel.find()
  //   return []
  // }
}

// ----------------------------- route access repo ops --------------------------------

const RouteAccess = {
  findAll: async function findAll(): Promise<RouteAccess[]> {
    return RouteAccessModel
      .find({})
      .lean()
      .exec();
  },
  create: async function create(newOne: RouteAccess): Promise<RouteAccess> {
    const createdOne = await RouteAccessModel.create({...newOne});
    return createdOne.toObject();
  },
  update: async function update(updateOne: RouteAccess): Promise<RouteAccess | null> {
    return RouteAccessModel.findByIdAndUpdate(updateOne._id,{$set: {...updateOne,parent}},{ new: true }).lean().exec();
  }
}

const RouteAuth = {
  findAll: async function findAll(): Promise<RouteAuth[]> {
    return RouteAuthModel
      .find({})
      .lean()
      .exec();
  },
  create: async function create(newOne: RouteAuth): Promise<RouteAuth> {
    const createdOne = await RouteAuthModel.create({...newOne});
    return createdOne.toObject();
  },
  update: async function update(updateOne: RouteAuth): Promise<RouteAuth | null> {
    return RouteAuthModel.findByIdAndUpdate(updateOne._id,{$set: {...updateOne,parent}},{ new: true }).lean().exec();
  }
}

export default {
  Route,
  RouteAccess,
  RouteAuth
};
