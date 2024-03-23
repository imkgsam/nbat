// import Route, { RouteChildren, RouteModel, RouteChildrenModel } from '../model/Route';
import Route, { RouteModel} from '../model/Route';
import RouteAccess, { RouteAccessModel} from '../model/RouteAccess';
import RouteAuth, { RouteAuthModel } from '../model/RouteAuth';
import RoleRepo from './RoleRepo';
import { Types } from 'mongoose'

// =------------------------- helpers -------------------

function processValues(arr: Array<string>) {
  if (arr && arr.length) {
    const hasIds = arr.filter(each => Types.ObjectId.isValid(each))
    const hasntIds = arr.filter(each => !Types.ObjectId.isValid(each)).map(each=> ({name: each}))
    return {
      hasIds: hasIds.length ? hasIds : null,
      hasntIds: hasntIds.length ? hasntIds : null
    }
  }else{
    return {hasIds:null, hasntIds:null}
  }
}



// ----------------------------- route repo ops --------------------------------
// 获取所有路由
const Route = {
  
  detail : async function detail(id: string): Promise<Route | null> {
    return RouteModel.findById(id).populate('meta.auths_options').lean().exec();
  },
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
    // if(newOne.meta.roles){
    //   const k = newOne.meta.roles.map(each=> each.toString())
    //   const roles = await RoleRepo.findByCodes(k)
    //   newOne.meta.roles = roles.map(each=>each._id)
    // }
    let parent = null
    if(newOne.parent){
      const parentObj = await RouteModel.findById(newOne.parent)
      if(parentObj){
        parent = parentObj._id
      }
    }
    const { hasntIds, hasIds } = processValues(newOne.meta.auths_options as string[])
    console.log( hasntIds, hasIds )
    let validAuths1: any[] = []
    if(hasIds && hasIds.length)
      validAuths1 = await RouteAuthModel.find({_id:{$in:hasIds}})
    let newAuths: any[] = []
    if(hasntIds && hasntIds.length) 
    newAuths = await RouteAuthModel.insertMany(hasntIds)
    const validAuthsIds = [...validAuths1.map(each=>each._id),...newAuths.map(each=>each._id)].map(each=> each.toString())
    newOne.meta.auths_options = validAuthsIds
    const createdOne = await RouteModel.create({...newOne,parent});
    return createdOne.toObject();
  },
  
  update: async function update(updateOne: Route): Promise<Route | null>{
    // if(updateOne.meta.roles){
    //   const k = updateOne.meta.roles.map(each=> each.toString())
    //   const roles = await RoleRepo.findByCodes(k)
    //   updateOne.meta.roles = roles.map(each=>each._id)
    // }
    let parent = null
    if(updateOne.parent){
      const parentObj = await RouteModel.findById(updateOne.parent)
      if(parentObj){
        parent = parentObj._id
      }
    }
    const { hasntIds, hasIds } = processValues(updateOne.meta.auths_options as string[])
    console.log( hasntIds, hasIds )
    let validAuths1: any[] = []
    if(hasIds && hasIds.length)
      validAuths1 = await RouteAuthModel.find({_id:{$in:hasIds}})
    let newAuths: any[] = []
    if(hasntIds && hasntIds.length) 
    newAuths = await RouteAuthModel.insertMany(hasntIds)
    const validAuthsIds = [...validAuths1.map(each=>each._id),...newAuths.map(each=>each._id)].map(each=> each.toString())
    updateOne.meta.auths_options = validAuthsIds
    return RouteModel.findByIdAndUpdate(updateOne._id,{$set: {...updateOne,parent}},{ new: true })
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

  removeChildrenByParentId: async function removeChildrenByParentId(id: Types.ObjectId, includingParent: boolean): Promise<number | null> {
    const parent = await RouteModel.findById(id)
    if(parent){
      async function genAllChildrenIds(parentId: Types.ObjectId, result: Types.ObjectId[]){
        const children = await RouteModel.find({parent: parentId})
        result.push(...children.map(each=> each._id))
        for(const child of children){
          await genAllChildrenIds(child._id,result)
        }
      }
      const ids: Types.ObjectId[] = []
      await genAllChildrenIds(id,ids)
      if(includingParent){
        ids.push(id)
      }
      const rt = await RouteModel.deleteMany({_id: {$in:ids}})
      return rt.deletedCount 
    }else{
      return parent
    }
  },

  getAsyncRoutes: async function getAsyncRoutes(user?: Types.ObjectId, roles?: Array<Types.ObjectId>) : Promise<Route[]>{
    console.log(user,roles)
    const filters = []
    filters.push({$and:[{user:{$exists:false}},{role:{$exists:false}}]})
    if(user){
      filters.push({user:user})
    }
    if(roles && roles.length){
      filters.push({role:{$in:roles}})
    }
    console.log(filters)
    const ras = await RouteAccessModel.aggregate([
      {
        $match:{$or:filters}
      }
      ,{
        $group: {
          _id: "$route", role:{ $push: "$role" }, auths:{ $push: "$auths" }
        }
      },
      {
        $project: {
          "auths": {
            $reduce: {
              input: '$auths',
              initialValue: [],
              in: {$concatArrays: ['$$value', '$$this']}
            }
          }
        }
      }

      // ,{
      //   $lookup:{
      //     from : "routes",
      //     localField:'route',
      //     foreignField:"_id",
      //     as: "RouteObj"
      //   }
      // }
      // ,{
      //   $unwind: "$RouteObj"
      // }
    ])
    console.log(ras, ras.length)
    return []
  }
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
    return RouteAccessModel.findByIdAndUpdate(updateOne._id,{$set: {...updateOne}},{ new: true }).lean().exec();
  },
  filters: async function filters(filters: object): Promise<RouteAccess[]> {
    return RouteAccessModel
    .find(filters)
    .populate('user')
    .populate('role')
    .populate({
      path:'route',
      populate:{
        path:'meta.auths_options'
      }
    })
    .populate('auths')
    .lean().exec();
  },
  removeOneById: async function removeOneById(id: Types.ObjectId): Promise<RouteAccess | null> {
    return RouteAccessModel.findOneAndDelete({_id: id}).lean().exec()
  },
  enable: async function enable(id: Types.ObjectId): Promise<RouteAccess | null> {
    return RouteAccessModel.findOneAndUpdate({_id:id ,  'meta.enabled':false},{'meta.enabled':true },{ new: true }).lean().exec();
  },
  disable: async function disable(id: Types.ObjectId): Promise<RouteAccess | null> {
    return RouteAccessModel.findOneAndUpdate({ _id: id, 'meta.enabled': true},{'meta.enabled':false},{ new: true }).lean().exec();
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
