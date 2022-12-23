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
          const user = await Users.findOne({ where: { userId } });
          let needExp = user.level * 50;
          console.log(user.userId + "접속");

          socket.emit("userInfo", {
            nickname: user.nickname,
            job: user.job,
            level: user.level,
            exp: user.exp,
            needExp: needExp,
            power: user.power,
            defense: user.defense,
            HP: user.HP,
            MP: user.MP,
            money: user.money,
          });
          if (user.exp === 0) {
            io.emit("connectUser", { user: "뉴비" });
            socket.emit("start", {
              code: "newUser",
            });
          } else {
            io.emit("connectUser", { user: user.nickname });
            socket.emit("start", {
              msg: "튜토리얼을 이미 진행한 유저",
              code: "user",
            });
          }
          socket.on("msg", async (data) => {
            try {
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
              if (data.stage === "fight") {
                socket.emit("monster", { msg: monster[data.msg] });
              }
              if (data.msg === "전투") {
                socket.emit("fight");
              }
            } catch (err) {
              console.log(err);
            }
          });
        } catch (err) {
          console.log(err);
        }
      });
      socket.on("fight", (data) => {
        console.log(data);
      });
      socket.on("send_chat", (data) => {
        io.emit("send_chat", {
          nickname: data.nickname,
          msg: data.msg,
        });
      });
    } catch (err) {
      console.log(err);
    }
  });
};
