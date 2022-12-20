// const AT = localStorage.getItem("Authorization");
// axios
//   .get("/main", {
//     headers: {
//       Authorization: AT,
//     },
//   })
//   .then(function (result) {
//     console.log(result);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

// 위의 socket.io.js에서 뽑아 쓴다.
const socket = io();
let objDiv = document.getElementById("main_box");
let objDivChat = document.getElementById("chatting");

socket.on("connect", () => {
  const userId = localStorage.getItem("userId");
  socket.emit("user", userId);

  socket.on("userInfo", (userInfo) => {
    if (!userInfo.nickname) userInfo.nickname = "뉴비";
    if (!userInfo.job) userInfo.job = "무직";
    $("#nickname").text(userInfo.nickname);
    $("#job").text(userInfo.job);
    $("#level").text(userInfo.level);
    $("#exp").text(userInfo.exp);
    $("#power").text(userInfo.power);
    $("#defense").text(userInfo.defense);
    $("#HP").text(userInfo.HP);
    $("#MP").text(userInfo.MP);
    $("#money").text(userInfo.money);
  });

  socket.on("connectUser", (connectUser) => {
    $("#chattingList").append(`${connectUser.user} 접속!<br>`);
    objDivChat.scrollTop = objDivChat.scrollHeight;
  });

  socket.on("start", (data) => {
    // $("#story *").remove();
    $("#story").append(`${data.msg}<br><br>`);

    // 뉴비일 때
    if (data.code === "newUser") {
      localStorage.setItem("stage", "nickname");
      socket.on("nickname", (nickname) => {
        localStorage.setItem("stage", "checkNickname");
        localStorage.setItem("nickname", nickname.msg);
        $("#story").append(`신입 열쇠 수리공: ${nickname.msg}<br><br>`);
        $("#story").append(`닉네임이 ${nickname.msg}이(가) 맞습니까?<br>1.네<br>2.아니오<br><br>`);
        objDiv.scrollTop = objDiv.scrollHeight;
      });
      socket.on("checkNickname", (checkNickname) => {
        if (checkNickname.msg === "1" || checkNickname.msg === "네") {
          $("#story").append(`그래요 ${checkNickname.nickname} 반가워요<br><br>`);
          $("#nickname").text(checkNickname.nickname);
          localStorage.setItem("stage", "닉네임 다음");
        } else if (checkNickname.msg === "2" || checkNickname.msg === "아니오") {
          $("#story").append(`그럼 뭐죠??<br><br>`);
          localStorage.setItem("stage", "nickname");
        } else $("#story").append(`??? 똑바로 대답해 시발럼아<br>`);
        objDiv.scrollTop = objDiv.scrollHeight;
      });
    }
    objDiv.scrollTop = objDiv.scrollHeight;
  });
});

function send() {
  // let name = document.getElementById("name").value;
  let msg = document.getElementById("text").value;
  let stage = localStorage.getItem("stage");
  let nickname = localStorage.getItem("nickname");
  let userId = localStorage.getItem("userId");
  let data = { msg, stage, nickname, userId };
  if (msg === "") return;
  socket.emit("msg", data);
  $("#text").val("");
}

const logout = () => {
  localStorage.clear();
  location.href = "/";
};
