import Category, { CategoryModel } from '../model/Category';
import { Types } from "mongoose"


async function create(category: Category): Promise<Category> {
  const createdOne = await CategoryModel.create(category);
  return createdOne.toObject();
}

async function filters(options: object): Promise<Category[]> {
  return CategoryModel.find(options)
}

async function detail(id: string): Promise<Category | null> {
  return CategoryModel.findById(id)
}

async function update(updatedOne: Category): Promise<Category | null> {
  if(updatedOne.parent){
    const parent = await CategoryModel.findById(updatedOne.parent)
    if(parent)
      updatedOne.parent = parent._id
  }
  return CategoryModel.findByIdAndUpdate(updatedOne._id,{$set: updatedOne},{ new: true }).lean().exec();
}

async function removeOneById(id: Types.ObjectId): Promise<Category | null> {
  const deletedOne = await CategoryModel.findOneAndDelete({_id: id}).lean().exec()
  const children = await CategoryModel.find({parent: id}).lean().exec()
  if(children.length){
    await CategoryModel.updateMany({"_id":{$in: children.map(each=> each._id)}},{ $set:{parent: deletedOne?.parent || null }})
  }
  return deletedOne
}

export default {
  create,
  filters,
  detail,
  update,
  removeOneById
};
