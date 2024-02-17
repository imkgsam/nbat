// import Route, { RouteChildren, RouteModel, RouteChildrenModel } from '../model/Route';
import Route, { RouteModel} from '../model/Route';
import RoleRepo from './RoleRepo';

// 获取所有路由
async function findAll(): Promise<Route[]> {
  return RouteModel
    .find({})
    .lean()
    .exec();
}

// 通过path搜索单一路由
async function findByPath(path: string): Promise<Route | null> {
  return RouteModel.findOne({ path: path, 'meta.enabled': true }).lean().exec();
}

// 创建新单一路由
async function createRoute(newOne: Route): Promise<Route>{
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

export default {
  findAll,
  findByPath,
  createRoute,
};
