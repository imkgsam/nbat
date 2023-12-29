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
async function findEntityDetailedInfoByUserId(userId: Types.ObjectId): Promise<Entity | null> {
  return EntityModel.findOne({
    user: userId
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
      // .select("-_id")
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

async function create(newEntity: Entity): Promise<Entity> {
  const createdOne = await EntityModel.create(newEntity);
  return createdOne.toObject();
}

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

async function createCompany(newEntity: Entity): Promise<Entity> {
  newEntity.etype = EntityTypeEnum.COMPANY
  return create(newEntity)
}

async function createPerson(newEntity: Entity): Promise<Entity> {
  newEntity.etype = EntityTypeEnum.PERSON
  return create(newEntity)
}

export default {
  // create,
  findOneOrCreate,
  findOneByUserId,
  enable,
  disable,
  verify,
  findOneByIdOrName,
  findOneVECompanyByName,
  findOneVEPersonByName,
  findOneByIdAndSetEmployee,
  createCompany,
  createPerson,
  findAllwithFilters,
  findOneEEbyId,
  findAllEE,
  findEntityDetailedInfoByUserId
};
