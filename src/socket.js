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
          if (!user.nickname) {
            io.emit("connectUser", { user: "뉴비" });
            socket.emit("start", {
              msg: `인간들은 마음에 큰 상처를 입게 되면 트라우마에 빠져 비현실적인 일들이 일어난다. 우리는 그 인간을 그대로 ‘트라우마’ 라고 부르기로 했고,<br>‘트라우마'는 본인 영역에 아픔을 실제로 구현한 판타지세계를 만들어버린다.”`,
            });
            socket.emit("start", {
              msg: `우리는 그 구역을  “비욘드”라고 부르기로 했다. 열쇠 수리공은 문을 따고 들어가 비욘드에서 트라우마를 찾아 치료하는게 목표다<br>"아 오늘 처음뵙네요 이번 비욘드에 지원오게된 ‘마키마'입니다"<br>“그쪽은?..”`,
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
              if (data.msg === "전투") {
                socket.emit("fight");
              }
              if (data.stage === "fight") {
                socket.emit("monster", { msg: monster[data.msg] });
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
