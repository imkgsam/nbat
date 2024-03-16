import Attribute, { AttributeModel } from '../model/Attribute';
import AttributeValue, { AttributeValueModel } from '../model/AttributeValue';
import { Types } from "mongoose"



// ------------------- attr -----------------------
async function create(attribute: Attribute): Promise<Attribute> {
  const createdOne = await AttributeModel.create(attribute);
  const { values } = attribute
  const {   hasntIds } = processValues(values as Array<AttributeValue>,createdOne._id)
  if(hasntIds){
    console.log('hasntIds',hasntIds)
    await AttributeValueModel.insertMany(hasntIds)
  }
  return createdOne.toObject();
}

async function update(updateOne: Attribute): Promise<Attribute | null> {
  const updatedOne = await AttributeModel.findByIdAndUpdate(updateOne._id, { $set: updateOne }, { new: true })
  if (updatedOne) {
    const { values } = updateOne
    const validIds = []
    const {  hasIds, hasntIds } = processValues(values as Array<AttributeValue>,updatedOne._id)
    if(hasntIds){
      const rt = await AttributeValueModel.insertMany(hasntIds)
      validIds.push(...rt.map(each=>each._id))
    }
    if(hasIds){
      await AttributeValueModel.bulkWrite(hasIds.map(values=>({
        updateOne:{
          filter:{_id:values._id},
          update: { $set: values},
          upsert: true
        }
      })))
      validIds.push(...hasIds.map(each=>each._id))
    }
    //remove unlinked values
    await AttributeValueModel.deleteMany({attribute: updatedOne, _id:{$not:{$in:validIds}}})
  }
  return updatedOne
}


async function findAll(options: object): Promise<Attribute[]> {
  return AttributeModel.find(options)
}

async function findOneById(id: Types.ObjectId | string): Promise<Attribute | null> {
  let attri = await AttributeModel.findById(id)
  if (attri) {
    attri = attri.toObject()
    // const values = await AttributeValueModel.find({attribute: attri._id},{'value':1,'abbr':1})
    // attri.values = values
  }
  return attri
}

async function removeOneById(id: Types.ObjectId): Promise<Attribute | null> {
  return AttributeModel.findOneAndDelete({ _id: id }).lean().exec()
}

async function filter(filters: object): Promise<Attribute[]> {
  return AttributeModel.find(filters).lean().exec()
}

async function enable(id: Types.ObjectId): Promise<Attribute | null> {
  return AttributeModel.findOneAndUpdate({ _id: id, 'meta.enabled': false }, { 'meta.enabled': true }, { new: true }).lean().exec();
}

async function disable(id: Types.ObjectId): Promise<Attribute | null> {
  return AttributeModel.findOneAndUpdate({ _id: id, 'meta.enabled': true }, { 'meta.enabled': false }, { new: true }).lean().exec();
}


function processValues(values: Array<AttributeValue>, attrId?: Types.ObjectId) {
  if (values && values.length) {
    const hasIds = values.filter(each => each._id)
    let hasntIds = values.filter(each => !each._id)
    if (attrId) {
      hasntIds = hasntIds.map(each => {
        each.attribute = attrId;
        return each
      })
    }
    return {
      hasIds: hasIds.length ? hasIds : null,
      hasntIds: hasntIds.length ? hasntIds : null
    }
  }else{
    return {hasIds:null, hasntIds:null}
  }
}


// ----------------------------- value ---------------------------------

async function valueRemoveOneById(id: Types.ObjectId): Promise<AttributeValue | null> {
  return AttributeValueModel.findOneAndDelete({ _id: id }).lean().exec()
}

async function detail(id: Types.ObjectId | string): Promise<Attribute | null> {
  let one = await AttributeModel.findById(id)
  if (one) {
    const values = await AttributeValueModel.find({ attribute: one._id })
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
  value: {
    create: createAttributeValue,
    removeOneById: valueRemoveOneById
  }
};
