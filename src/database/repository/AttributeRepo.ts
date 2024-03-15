import Attribute, { AttributeModel } from '../model/Attribute';
import AttributeValue, { AttributeValueModel } from '../model/AttributeValue';
import { Types } from "mongoose"



// ------------------- attr -----------------------
async function create(attribute: Attribute): Promise<Attribute> {
  const createdOne = await AttributeModel.create(attribute);
  return createdOne.toObject();
}


async function findAll(options: object): Promise<Attribute[]> {
  return AttributeModel.find(options)
}

async function findOneById(id: Types.ObjectId | string): Promise<Attribute | null> {
  let attri = await AttributeModel.findById(id)
  if(attri){
    attri = attri.toObject()
    // const values = await AttributeValueModel.find({attribute: attri._id},{'value':1,'abbr':1})
    // attri.values = values
  }
  return attri
}

async function removeOneById(id: Types.ObjectId): Promise<Attribute | null> {
  return AttributeModel.findOneAndDelete({_id: id}).lean().exec()
}

async function filter(filters: object) : Promise<Attribute[]>{
  return AttributeModel.find(filters).lean().exec()
}

async function enable(id: Types.ObjectId): Promise<Attribute | null> {
  return AttributeModel.findOneAndUpdate({_id:id,  'meta.enabled':false},{'meta.enabled':true },{ new: true }).lean().exec();
}

async function disable(id: Types.ObjectId): Promise<Attribute | null> {
  return AttributeModel.findOneAndUpdate({ _id: id, 'meta.enabled': true},{'meta.enabled':false},{ new: true }).lean().exec();
}

async function update(updatedOne: Attribute): Promise<Attribute | null> {
  return AttributeModel.findByIdAndUpdate(updatedOne._id,{$set: updatedOne},{ new: true }).lean().exec();
}


// ----------------------------- value ---------------------------------

async function valueRemoveOneById(id: Types.ObjectId): Promise<AttributeValue | null> {
  return AttributeValueModel.findOneAndDelete({_id: id}).lean().exec()
}

async function detail(id: Types.ObjectId | string): Promise<Attribute | null> {
  let one = await AttributeModel.findById(id)
  if(one){
    const values = await AttributeValueModel.find({attribute: one._id})
    one = one.toObject()
    one.values = values
  }
  return one
}

async function createAttributeValue(attributeValue: AttributeValue): Promise<AttributeValue> {
  const createdOne = await AttributeValueModel.create(attributeValue);
  return createdOne.toObject();
}

export default {
  create,
  detail,
  update,
  findAll,
  filter,
  enable,
  disable,
  removeOneById,
  findOneById,
  value:{
    create: createAttributeValue,
    removeOneById: valueRemoveOneById
  }
};
