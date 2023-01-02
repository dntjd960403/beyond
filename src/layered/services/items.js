const ItemsRepository = require("../repositories/items");
class ItemsService {
  itemsRepository = new ItemsRepository();

  MakeItem = async (name, type, explanation) => {
    const makeItem = await this.itemsRepository.MakeItem(name, type, explanation);
  };
}
module.exports = ItemsService;
