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
    const rt =await AttributeValueModel.insertMany(hasntIds)
    console.log('rt',rt)
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
      console.log(hasntIds)
      const rt = await AttributeValueModel.insertMany(hasntIds)
      console.log('rt',rt)
      validIds.push(...rt.map(each=>each._id))
    }
    if(hasIds){
      console.log(hasIds)
      await AttributeValueModel.bulkWrite(hasIds.map(values=>({
        updateOne:{
          filter:{_id:values._id},
          update: { $set: values},
          upsert: true
        }
      })))
      validIds.push(...hasIds.map(each=>each._id))
    }
    console.log(validIds)
    //remove unlinked values
    await AttributeValueModel.deleteMany({attribute: updatedOne, _id:{$not:{$in:validIds}}})
  }
  return updatedOne
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
  const deletedOne = await AttributeModel.findOneAndDelete({ _id: id }).lean().exec()
  if(deletedOne){
    await AttributeValueModel.deleteMany({attribute: deletedOne._id})
  }
  return deletedOne
}

async function filter(filters: object): Promise<Attribute[]> {
  console.log('fitler with aggregate')
  return AttributeModel.aggregate([
    {
      $match:filters
    },
    {
      $lookup:{
        from : "attributeValues",
        localField:'_id',
        foreignField:"attribute",
        as: "values"
      }
    }
  ])
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
        delete each._id;
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
    const values = await AttributeValueModel.find({ attribute: one._id }).select('-createdAt')
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
