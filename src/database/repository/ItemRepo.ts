import Item, { ItemModel } from '../model/Item';


async function create(category: Item): Promise<Item> {
  const createdOne = await ItemModel.create(category);
  return createdOne.toObject();
}

async function findAll(options: object): Promise<Item[]> {
  return ItemModel.find(options)
}

async function detail(id: string): Promise<Item | null> {
  return ItemModel.findById(id)
}

export default {
  create,
  findAll,
  detail
};
