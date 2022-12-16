const socketIo = require("socket.io");
const { Users } = require("./models");
module.exports = (server) => {
  const io = socketIo(server, { path: "/socket.io", cors: "*" });

  io.on("connect", (socket) => {
    console.log("커넥트");
    io.emit("a", {
      msg: `인간들은 마음에 큰 상처를 입게 되면 트라우마에 빠져 비현실적인 일들이 일어난다 우리는 그 인간을 그대로 ‘트라우마’ 라고 부르기로 했고 ‘트라우마'는 본인 영역에 아픔을 실제로 구현한 판타지세계를 만들어버린다 우리는 그 구역을  “비욘드”라고 부르기로 했다. 열쇠 수리공은 문을 따고 들어가 비욘드에서 트라우마를 찾아 치료하는게 목표다 "아 오늘 처음뵙네요 이번 비욘드에 지원오게된 ‘마키마'입니다" “그쪽은?..”`,
    });
    socket.on("chatting", (data) => {
      console.log(data);
      io.emit("receive", data);
    });
    // socket.join("main");
    // let name = "유저" + count++;
    // io.emit("newUser", name);
    // socket.emit("userName", name);
    // socket.on("newMessage", (data) => {
    //   io.to(data.room).emit("newMessage", { name: data.name, msg: data.text });
    // });
  });
};
