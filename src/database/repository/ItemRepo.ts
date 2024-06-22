import { Types } from 'mongoose';
import Item, { ProductModel } from '../model/product/Template';

async function create(newOne: Item): Promise<Item> {
  return await ProductModel.create(newOne);
}
async function findAll(): Promise<Item[]> {
  return ProductModel.find({}).lean().exec()
}
async function enable(id: string): Promise<Item | null> {
  return ProductModel.findByIdAndUpdate(id, { 'meta.enabled': true }, { new: true }).lean().exec();
}
async function disable(id: string): Promise<Item | null> {
  return ProductModel.findByIdAndUpdate(id, { 'meta.enabled': false }, { new: true }).lean().exec();
}
async function filters(filters: any): Promise<Item[]> {
  if(Object.keys(filters).includes('meta')){
    for (const key of Object.keys(filters.meta)){
      filters[`meta.${key}`] = filters.meta[key]
    }
    delete filters.meta
  }
  return ProductModel.find(filters).lean().exec()
}
async function deleteOne(id: string): Promise<Item | null> {
  return null
}
async function update(updateOne: Item): Promise<Item | null> {
  return ProductModel.findByIdAndUpdate(updateOne._id, { $set: updateOne }, { new: true }).lean().exec();
}

async function detail(id: Types.ObjectId | string): Promise<Item | null> {
 return ProductModel.findById(id).populate('attributes').populate('meta.isVariantOf').populate('meta.attributeTags').lean().exec()
}

export default {
  create,
  findAll,
  enable,
  disable,
  filters,
  deleteOne,
  update,
  detail
};
