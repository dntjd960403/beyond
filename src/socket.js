const socketIo = require("socket.io");
const { Users } = require("./models");
const { Bags } = require("./models");
const { Items } = require("./models");
// const redis = require("redis");
const auth = require("./middlewares/auth");
const monster = require("./js/monster");

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
              data.msg.split(" ").join("");
              if (data.stage === "nickname") socket.emit("nickname", { msg: data.msg });
              if (data.stage === "checkNickname") {
                if (data.msg === "1" || data.msg === "네") {
                  await Users.update(
                    { nickname: data.nickname },
                    { where: { userId: data.userId } }
                  );
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
              if (data.stage === "beyond") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
                if (data.msg === "1" || data.msg === "입장") {
                  let number = random();
                  if (number >= 90) {
                    number = 3;
                  } else number = 2;
                  socket.emit("monster", { msg: monster[number] });
                }
              }
              if (data.stage === "keyRing") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
              }
              if (data.stage === "pub") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
              }
              if (data.stage === "smithy") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
              }
              if (data.stage === "bag") {
                if (data.msg === "나가기" || data.msg === "0") socket.emit("lobby");
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
            recovery();
            userInfo();
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
