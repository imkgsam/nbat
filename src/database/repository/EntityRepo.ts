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
async function filters( filters: Entity,type: EntityTypeEnum ): Promise<Entity[]> {
  filters.etype = type
  return EntityModel.find(filters).populate('account').lean().exec();
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


  // shared function 
  enable,
  disable,
  verify,
};
