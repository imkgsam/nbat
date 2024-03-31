import { AccountModel } from '../model/Account';
import { EmployeeModel } from '../model/Employee';
import Entity, { EntityModel, EntityTypeEnum } from '../model/Entity';
import { Types } from 'mongoose';

async function findOneByUserId(userId: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findOne({
    user: userId
  })
  .populate('employee')
    .lean()
    .exec();
}

/**
 *  用户获取profile
 */
async function findEntityDetailedInfoByUserId(id: Types.ObjectId): Promise<Entity | null> {
  console.log(id)
  return EntityModel.findOne({
    account: id
  })
  .select('+accountName +roles +email')
  .populate('employee')
  .populate('scompany',"name")
    .lean()
    .exec();
}

async function findOneByIdOrName(idOrName: string | Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findOne({
    $and: [
      {
        'meta.enabled': true,
        'meta.verified': true,
        etype: EntityTypeEnum.PERSON,
        employee: { $ne: null },
      },
      { $or: [{ _id: idOrName }, { name: idOrName }] },
    ],
  })
    .lean()
    .exec();
}

async function findOneOrCreate( input : Entity): Promise<Entity> {
  const createdOne = await EntityModel.create(input);
  return createdOne.toObject();
}

async function findAllwithFilters(filters: object={}): Promise<Entity[]> {
  return (
    EntityModel.find(filters)
      .select("name")
      .lean()
      .exec()
  );
}

async function findAllEE(): Promise<Entity[]> {
  return (
    EntityModel.find({ etype: EntityTypeEnum.PERSON }).populate('employee')
      .lean()
      .exec()
  );
}



async function findOneVECompanyByName(name: string): Promise<Entity | null> {
  return EntityModel.findOne({  name: name, etype: EntityTypeEnum.COMPANY, 'meta.enabled':true, 'meta.verified':true })
    .lean()
    .exec();
}

async function findOneVEPersonByName(name: string): Promise<Entity | null> {
  return EntityModel.findOne({  name: name, etype: EntityTypeEnum.PERSON, 'meta.enabled':true, 'meta.verified':true })
    .lean()
    .exec();
}

async function findOneByIdAndSetEmployee(entityId: Types.ObjectId, employeeId: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findOneAndUpdate({  _id: entityId },{employee: employeeId},{new:true})
    .lean()
    .exec();
}

async function findOneEEbyId(id: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findOne({  _id: id }).populate('employee')
    .lean()
    .exec();
}


// ------------------------ 

const Company = {
  create: (newOne: Entity) => create(newOne,EntityTypeEnum.COMPANY),
  update,
  filter: (filter:Entity) => filters(filter, EntityTypeEnum.COMPANY),
  delete: deleteOne

}


const Person = {
  create: (newOne: Entity) => create(newOne,EntityTypeEnum.PERSON),
  update,
  filter: (filter:Entity) => filters(filter, EntityTypeEnum.PERSON),
  delete: deleteOne
}

const Employee = {
  filter: async function filter(filters: any){
    filters['etype'] = EntityTypeEnum.PERSON
    for (const key of Object.keys(filters.meta)){
      filters[`meta.${key}`] = filters.meta[key]
    }
    delete filters.meta
    return EntityModel.find(filters).populate('account').populate({path:'employee',populate:{ path:'departments'}}).lean().exec()
  },
  create: async function create(newOne: Entity) : Promise<Entity | null>{
    console.log(' in create ', newOne)
    const employee = newOne.employee
    const account = newOne.account
    delete newOne.employee
    delete newOne.account
    const newEntity = await EntityModel.create({...newOne, etype: EntityTypeEnum.PERSON})
    if(newEntity){
      console.log(1)
      if(newOne.meta.isEmployee){
        console.log(2)
        const newEmployee = await EmployeeModel.create({...employee,entity:newEntity._id })
        if(newEmployee){
          console.log(3)
          newEntity.employee = newEmployee._id
        }
      }
      if(newOne.meta.isUser){
        console.log(4)
        const newAccount = await AccountModel.create({...account,entity:newEntity._id })
        if(newAccount){
          console.log(5)
          newEntity.account = newAccount._id
        }
      }
      console.log(6)
      await newEntity.save()
      const rt = await (await (newEntity.populate('account'))).populate('employee')
      return rt
    }
    return null
  }
}

//          ------------------------ share functions ---------------------
async function enable(id: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findByIdAndUpdate(
    id,
    { 'meta.enabled': true },
    { new: true },
  )
    .lean()
    .exec();
}
async function disable(id: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findByIdAndUpdate(
    id,
    { 'meta.enabled': false },
    { new: true },
  )
    .lean()
    .exec();
}
async function verify(id: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findOneAndUpdate(
    { _id:id, 'meta.verified':false },
    { 'meta.verified': true },
    { new: true },
  )
    .lean()
    .exec();
}
async function create(newOne: Entity,type: EntityTypeEnum): Promise<Entity> {
  newOne.etype = type
  return EntityModel.create(newOne)
}
async function update(updateOne: Entity): Promise<Entity | null> {
  return EntityModel.findByIdAndUpdate(updateOne._id, { $set: updateOne }, { new: true }).lean().exec();
}
async function filters( filters: any,type: EntityTypeEnum ): Promise<Entity[]> {
  filters['etype'] = type
  for (const key of Object.keys(filters.meta)){
    filters[`meta.${key}`] = filters.meta[key]
  }
  delete filters.meta
  console.log(filters)
  return EntityModel.find(filters).populate('account');
}
async function deleteOne(id: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findOneAndDelete({_id: id}).lean().exec();
}



export default {
  findOneOrCreate,
  findOneByUserId,
  
  findOneByIdOrName,
  findOneVECompanyByName,
  findOneVEPersonByName,
  findOneByIdAndSetEmployee,
  // createCompany,
  // createPerson,
  findAllwithFilters,
  findOneEEbyId,
  findAllEE,
  findEntityDetailedInfoByUserId,

  Person,
  Company,
  Employee,


  // shared function 
  enable,
  disable,
  verify,
};
