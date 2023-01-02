const { Items } = require("../../models");
class ItemsRepository {
  MakeItem = async (name, type, explanation) => {
    const makeItem = await Items.create({ name, type, explanation });
  };
}
module.exports = ItemsRepository;
