const ItemsService = require("../services/items");
class ItemsController {
  itemsService = new ItemsService();

  MakeItem = async (req, res) => {
    try {
      const { name, type, explanation } = req.body;

      const makeItem = await this.itemsService.MakeItem(name, type, explanation);
      res.json({ message: "아이템 생성 성공" });
    } catch (err) {
      console.log(err);
    }
  };
}
module.exports = ItemsController;
