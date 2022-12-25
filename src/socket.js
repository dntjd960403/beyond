const socketIo = require("socket.io");
const { Users } = require("./models");
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
            needExp = parseInt(parseInt(user.level * (50 * (0.7 * user.level))));
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
              }
              if (data.stage === "beyond") {
                if (data.msg === "나가기") socket.emit("lobby");
              }
              if (data.stage === "keyRing") {
                if (data.msg === "나가기") socket.emit("lobby");
              }
              if (data.stage === "pub") {
                if (data.msg === "나가기") socket.emit("lobby");
              }
              if (data.stage === "smithy") {
                if (data.msg === "나가기") socket.emit("lobby");
              }
              if (data.stage === "bag") {
                if (data.msg === "나가기") socket.emit("lobby");
              }
              if (data.stage === "storytelling") {
                if (data.msg === "나가기") socket.emit("lobby");
              }
              if (data.stage === "fight") {
                socket.emit("monster", { msg: monster[data.msg] });
              }
              if (data.stage === "end_fight") {
                socket.emit("lobby");
              }
              if (data.msg === "전투") {
                socket.emit("fight");
              }
            } catch (err) {
              console.log(err);
            }
          });
          socket.on("fight", async (fight) => {
            const HPUpdate = await Users.update({ HP: fight.HP }, { where: { userId } });
            if (fight.money) await Users.increment({ money: fight.money }, { where: { userId } });
            const expUpdate = await Users.increment({ exp: fight.exp }, { where: { userId } });
            user = await Users.findOne({ where: { userId } });
            userInfo();
            console.log(user.level);
            if (user.exp >= needExp) {
              levelup(user);
              socket.emit("levelup");
            }
          });
          socket.on("send_chat", (data) => {
            io.emit("send_chat", {
              nickname: data.nickname,
              msg: data.msg,
            });
          });
          const levelup = async (user) => {
            await Users.update({ exp: user.exp - needExp }, { where: { userId } });
            await Users.increment({ power: 3 }, { where: { userId } });
            await Users.increment({ magic: 2 }, { where: { userId } });
            await Users.increment({ defense: 1 }, { where: { userId } });
            await Users.increment({ level: 1 }, { where: { userId } });
            maxHP = 100 + user.level * 50;
            maxMP = 100 + user.level * 25;
            await Users.update({ HP: maxHP }, { where: { userId } });
            await Users.update({ MP: maxMP }, { where: { userId } });
            userInfo();
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
