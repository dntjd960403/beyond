const socketIo = require("socket.io");
const { Users, Bags, Items, Equips } = require("./models");
const auth = require("./middlewares/auth");
const monster = require("./js/monster");
const { Op } = require("sequelize");

// const redis = require("redis");
// const redisClient = redis.createClient({ legacyMode: true });
// redisClient.on("connect", () => {
//   console.info("Redis connected!");
// });
// redisClient.on("error", (err) => {
//   console.error("Redis Client Error", err);
// });
// redisClient.connect().then();
// redisCli = redisClient.v4;

module.exports = (server) => {
  const io = socketIo(server, { path: "/socket.io", cors: "*" });
  io.on("connect", (socket) => {
    try {
      socket.on("user", async (userId) => {
        try {
          let user = await Users.findOne({ where: { userId } });
          let needExp = parseInt(user.level * (50 * (0.7 * user.level)));
          let maxHP = 100 + (user.level - 1) * 50;
          let maxMP = 100 + (user.level - 1) * 25;
          console.log(user.userId + "접속");
          const userInfo = async () => {
            user = await Users.findOne({ where: { userId } });
            let userEquip = await Equips.findOne({
              where: { nickname: user.nickname },
            });
            let helmet, armor, weapon, keyRing1, keyRing2, keyRing3;
            let subDefense = 0,
              subMagic = 0,
              subPower = 0;
            if (userEquip) {
              helmet = await Items.findOne({
                attributes: ["name", "explanation"],
                where: { name: userEquip.helmet },
              });
              armor = await Items.findOne({
                attributes: ["name", "explanation"],
                where: { name: userEquip.armor },
              });
              weapon = await Items.findOne({
                attributes: ["name", "explanation"],
                where: { name: userEquip.weapon },
              });
              keyRing1 = await Items.findOne({
                attributes: ["name", "explanation"],
                where: { name: userEquip.keyRing1 },
              });
              keyRing2 = await Items.findOne({
                attributes: ["name", "explanation"],
                where: { name: userEquip.keyRing2 },
              });
              keyRing3 = await Items.findOne({
                attributes: ["name", "explanation"],
                where: { name: userEquip.keyRing3 },
              });
              let items = [helmet, armor, weapon, keyRing1, keyRing2, keyRing3];
              // const statType = {
              //   공격력: "power",
              //   방어력: "defense",
              // };
              items.forEach((v) => {
                if (v) {
                  let [stat, val] = v.explanation.split(" +");
                  if (stat === "공격력") subPower += val * 1;
                  else if (stat === "마법공격력") subMagic += val * 1;
                  else if (stat === "방어력") subDefense += val * 1;
                }
              });
              if (helmet) helmet = helmet.name;
              if (armor) armor = armor.name;
              if (weapon) weapon = weapon.name;
              if (keyRing1) keyRing1 = keyRing1.name;
              if (keyRing2) keyRing2 = keyRing2.name;
              if (keyRing3) keyRing3 = keyRing3.name;
            }
            needExp = parseInt(user.level * (50 * (0.7 * user.level)));
            maxHP = 100 + (user.level - 1) * 50;
            maxMP = 100 + (user.level - 1) * 25;
            socket.emit("userInfo", {
              nickname: user.nickname,
              job: user.job,
              level: user.level,
              exp: user.exp,
              needExp: needExp,
              power: user.power,
              magic: user.magic,
              defense: user.defense,
              HP: user.HP,
              MP: user.MP,
              maxHP: maxHP,
              maxMP: maxMP,
              money: user.money,
              helmet: helmet,
              armor: armor,
              weapon: weapon,
              keyRing1: keyRing1,
              keyRing2: keyRing2,
              keyRing3: keyRing3,
              subPower: subPower,
              subMagic: subMagic,
              subDefense: subDefense,
            });
          };
          userInfo();
          if (user.level === 1 && user.exp === 0) {
            io.emit("connectUser", { user: "뉴비" });
            // if (!user.nickname) {
            socket.emit("start", {
              name: "윤달",
              code: "newUser",
            });
            userInfo();
            // } else {
            //   socket.emit("start", {
            //     code: "onlyNick",
            //   });
            // }
          } else {
            io.emit("connectUser", { user: user.nickname });
            socket.emit("lobby");
          }
          const random = () => {
            return Math.floor(Math.random() * 101);
          };
          socket.on("msg", async (data) => {
            try {
              data.msg = data.msg.split(" ").join("");
              if (data.stage === "nickname") socket.emit("nickname", { msg: data.msg });
              if (data.stage === "checkNickname") {
                if (data.msg === "1" || data.msg === "네") {
                  try {
                    await Users.update(
                      { nickname: data.nickname },
                      { where: { userId: data.userId } }
                    );
                  } catch (err) {
                    return socket.emit("error", { msg: "중복된 닉네임" });
                  }
                }
                socket.emit("checkNickname", { msg: data.msg, nickname: data.nickname });
              }
              if (data.stage === "tutorial") {
                socket.emit("tutorial", { nickname: data.nickname });
              }
              if (data.stage === "tutorial2") {
                socket.emit("tutorial2", { nickname: data.nickname });
              }
              if (data.stage === "lobby") {
                if (data.msg === "1" || data.msg === "비욘드" || data.msg == "비욘드입장") {
                  socket.emit("beyond");
                }
                if (data.msg === "2" || data.msg === "키링" || data.msg == "키링상점") {
                  socket.emit("keyRing");
                }
                if (data.msg === "3" || data.msg === "주점") {
                  await recovery();
                  await userInfo();
                  socket.emit("pub");
                }
                if (data.msg === "4" || data.msg === "대장간") {
                  socket.emit("smithy");
                }
                if (data.msg === "5" || data.msg === "가방") {
                  socket.emit("bag");
                  if (!data.nickname) data.nickname = user.nickname;
                  const myBag = await Bags.findAll({
                    attributes: ["quantity"],
                    include: [
                      {
                        // join한다.
                        attributes: ["name", "type", "explanation"],
                        model: Items, // join할 테이블을 고른다.
                      },
                    ],
                    where: { nickname: data.nickname },
                  });
                  socket.emit("myBag", { item: myBag });
                }
                if (data.msg === "6" || data.msg === "스토리") {
                  socket.emit("storytelling");
                }
                if (data.msg === "7" || data.msg === "퀘스트") {
                  socket.emit("quest");
                }
                if (data.msg === "8" || data.msg === "도움말") {
                  socket.emit("help");
                }
              }
              if (data.stage === "stage1") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
                if (data.msg === "1" || data.msg === "입장") {
                  let number = random();
                  if (number <= 40) number = 2;
                  else if (number <= 65) number = 3;
                  else if (number <= 85) number = 4;
                  else if (number <= 95) number = 5;
                  else if (number <= 100) number = 6;
                  socket.emit("monster", { msg: monster[number] });
                }
                if (data.msg === "2" || data.msg === "보스") {
                  const checkItem = await Bags.findOne({
                    where: { nickname: data.nickname, itemName: "보스입장권(1)" },
                  });
                  if (!checkItem || checkItem.quantity < 1) {
                    return socket.emit("error", { msg: "입장권이 부족합니다." });
                  }
                  await Bags.decrement(
                    { quantity: 1 },
                    { where: { nickname: data.nickname, itemName: "보스입장권(1)" } }
                  );
                  socket.emit("monster", { msg: monster[7] });
                }
                if (data.msg === "6" || data.msg === "다음") {
                  socket.emit("stage2");
                }
              }
              if (data.stage === "stage2") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
                if (data.msg === "1" || data.msg === "입장") {
                }
                if (data.msg === "2" || data.msg === "보스") {
                  // const checkItem = await Bags.findOne({
                  //   where: { nickname: data.nickname, itemName: "보스입장권(2)" },
                  // });
                  // if (!checkItem || checkItem.quantity < 1) {
                  //   return socket.emit("error", { msg: "입장권이 부족합니다." });
                  // }
                  // await Bags.decrement(
                  //   { quantity: 1 },
                  //   { where: { nickname: data.nickname, itemName: "보스입장권(2)" } }
                  // );
                  // socket.emit("monster", { msg: monster[7] });
                }
                if (data.msg === "4" || data.msg === "이전") {
                  socket.emit("beyond");
                }
              }
              if (data.stage === "keyRing") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
              }
              if (data.stage === "pub") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
                if (data.msg === "1" || data.msg === "김민재" || data.msg === "민재") {
                  socket.emit("minjae", data.nickname);
                }
                if (data.msg === "2" || data.msg === "이하나" || data.msg === "하나") {
                  socket.emit("hana", data.nickname);
                }
                if (data.msg === "3" || data.msg === "표지성" || data.msg === "지성") {
                  socket.emit("jisung", data.nickname);
                }
                if (data.msg === "4" || data.msg === "차차") {
                  socket.emit("chacha", data.nickname);
                }
              }
              if (data.stage === "smithy") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
                if (data.msg === "강화" || data.msg === "3") {
                  const myEquips = await Bags.findAll({
                    attributes: ["quantity"],
                    include: [
                      {
                        attributes: ["name", "type"],
                        where: { [Op.or]: [{ type: "투구" }, { type: "갑옷" }, { type: "무기" }] },
                        model: Items,
                      },
                    ],
                    where: {
                      nickname: data.nickname,
                      quantity: { [Op.gt]: 0 },
                    },
                  });
                  socket.emit("ganghwa", { item: myEquips });
                }
              }
              if (data.stage === "ganghwa") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("smithy");
              }
              if (data.stage === "bag") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
                if (data.msg.slice(-2) === "장착") {
                  const [item] = data.msg.split("장착");
                  const findItem = await Bags.findOne({
                    include: [
                      {
                        attributes: ["name", "type", "explanation"],
                        model: Items,
                      },
                    ],
                    where: { nickname: data.nickname, itemName: item },
                  });
                  if (!findItem || findItem.quantity < 1)
                    socket.emit("error", { msg: `아이템을 다시 확인해 주세요\n입력값:${item}` });
                  const equipUser = await Equips.findOne({ where: { nickname: data.nickname } });
                  if (!equipUser) await Equips.create({ nickname: data.nickname });
                  if (findItem.Item.type === "투구") {
                    if (equipUser.helmet) {
                      await Bags.increment(
                        { quantity: 1 },
                        { where: { itemName: equipUser.helmet } }
                      );
                    }
                    await Bags.decrement(
                      { quantity: 1 },
                      { where: { itemName: findItem.Item.name } }
                    );
                    await Equips.update(
                      { helmet: findItem.Item.name },
                      { where: { nickname: data.nickname } }
                    );
                  } else if (findItem.Item.type === "갑옷") {
                    if (equipUser.armor) {
                      await Bags.increment(
                        { quantity: 1 },
                        { where: { itemName: equipUser.armor } }
                      );
                    }
                    await Bags.decrement(
                      { quantity: 1 },
                      { where: { itemName: findItem.Item.name } }
                    );
                    await Equips.update(
                      { armor: findItem.Item.name },
                      { where: { nickname: data.nickname } }
                    );
                  } else if (findItem.Item.type === "무기") {
                    if (equipUser.weapon) {
                      await Bags.increment(
                        { quantity: 1 },
                        { where: { itemName: equipUser.weapon } }
                      );
                    }
                    await Bags.decrement(
                      { quantity: 1 },
                      { where: { itemName: findItem.Item.name } }
                    );
                    await Equips.update(
                      { weapon: findItem.Item.name },
                      { where: { nickname: data.nickname } }
                    );
                  } else socket.emit("error", { msg: "장착할 수 없는 아이템 입니다" });
                  await socket.emit("error", { msg: `${item}을 장착하셨습니다` });
                  const myBag = await Bags.findAll({
                    attributes: ["quantity"],
                    include: [
                      {
                        // join한다.
                        attributes: ["name", "type", "explanation"],
                        model: Items, // join할 테이블을 고른다.
                      },
                    ],
                    where: { nickname: data.nickname, quantity: { [Op.gt]: 0 } },
                  });
                  await socket.emit("myBag", { item: myBag });
                  await userInfo();
                }
              }
              if (data.stage === "storytelling") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
              }
              if (data.stage === "quest") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
              }
              if (data.stage === "help") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
              }
              if (data.stage === "fight") {
                socket.emit("monster", { msg: monster[data.msg] });
              }
              if (data.stage === "end_fight") {
                socket.emit("lobby");
              }
              // if (data.msg === "전투") {
              //   socket.emit("fight");
              // }
            } catch (err) {
              console.log(err);
            }
          });
          socket.on("fight", async (fight) => {
            const HPUpdate = await Users.update({ HP: fight.HP }, { where: { userId } });
            if (fight.money) await Users.increment({ money: fight.money }, { where: { userId } });
            if (fight.exp) await Users.increment({ exp: fight.exp }, { where: { userId } });
            user = await Users.findOne({ where: { userId } });
            await userInfo();
            if (user.exp >= needExp) {
              levelup(user);
              socket.emit("levelup");
            }
          });
          socket.on("getItem", async (item) => {
            const checkItem = await Bags.findOne({
              where: { nickname: item.nickname, itemName: item.item },
            });
            if (!checkItem) {
              await Bags.create({ nickname: item.nickname, itemName: item.item, quantity: 1 });
            } else
              await Bags.increment(
                { quantity: 1 },
                {
                  where: { nickname: item.nickname, itemName: item.item },
                }
              );
          });
          socket.on("send_chat", (data) => {
            io.emit("send_chat", {
              nickname: data.nickname,
              msg: data.msg,
            });
          });
          const levelup = async (user) => {
            await Users.update({ exp: user.exp - needExp }, { where: { userId } });
            await Users.increment(
              { power: 3, magic: 2, defense: 1, level: 1 },
              { where: { userId } }
            );
            maxHP = 100 + user.level * 50;
            maxMP = 100 + user.level * 25;
            await recovery();
            await userInfo();
          };
          const recovery = async () => {
            await Users.update({ HP: maxHP, MP: maxMP }, { where: { userId } });
          };
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
};
