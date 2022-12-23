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
let objDiv = document.getElementById("story");
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
    $("#needExp").text(userInfo.needExp);
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
    if (data.code === "newUser") {
      $("#story").append(`<div class="story_chat">
    <div class="story_chat_profile">
    </div>
    <div class="story_chat_content">
    어이, 신입<br>
    나는 너의 지도를 맡게 된 ‘윤달’이다<br>
    네 이름은?<br>
    </div>
    </div><br>`);

      // 뉴비일 때
      localStorage.setItem("stage", "nickname");
      socket.on("nickname", (nickname) => {
        localStorage.setItem("stage", "checkNickname");
        localStorage.setItem("nickname", nickname.msg);
        $("#main_box div").empty();
        $("#story").append(
          `<div class="story_chat">
              <div class="story_chat_profile"></div>
              <div class="story_chat_content">
                ${nickname.msg}입니다!
              </div>
            </div><br>`
        );
        $("#story").append(`<div class="story_chat">
        <div class="story_chat_profile"></div>
        <div class="story_chat_content">
         ${nickname.msg}.. 확실해?<br>
        1.네<br>
        2.아니오<br><br>
        </div>
        </div><br>`);
        objDiv.scrollTop = objDiv.scrollHeight;
      });
      socket.on("checkNickname", async (checkNickname) => {
        if (checkNickname.msg === "1" || checkNickname.msg === "네") {
          localStorage.setItem("stage", "tutorial");
          $("#nickname").text(checkNickname.nickname);
          $("#main_box div").empty();
          $("#story").append(`<div class="story_chat">
          <div class="story_chat_profile"></div>
          <div class="story_chat_content">
          그래, ${checkNickname.nickname} 바로 본론으로 들어가지..<br>
          열쇠 수리공으로서 네가 알아야 할 건 딱 세 가지
          </div>
        </div><br>
          `);
          $("#story").append(`<div class="story_chat">
          <div class="story_chat_profile"></div>
          <div class="story_chat_content">
          첫 번째, 인간의 마음은 큰 상처를 입었을 때 ‘트라우마’에 잠식하게된다<br>
          트라우마에 빠진 인간을 그대로’ 트라우마’라고 부르기로 했다<br>
          이성을 잃고 타인을 죽일 수도 자신을 죽일 수 있는 상태가 되지
          </div>
        </div><br>
          `);
          setTimeout(() => {
            $("#story").append(`<div class="story_chat">
            <div class="story_chat_profile"></div>
            <div class="story_chat_content">
            두 번째, 트라우마가 잠식하는 동시에 굳게 닫힌 문을 남기게 되는데<br>
            우린 그 문을 ‘비욘드’라고 부르기로 했다<br>
            문을 따게 되면 트라우마의 아픔을 구현한 자기만의 세계가 만들어져있지
            </div>
          </div><br>
            `);
            objDiv.scrollTop = objDiv.scrollHeight;
          }, 6000);
          setTimeout(() => {
            $("#story").append(`<div class="story_chat">
            <div class="story_chat_profile"></div>
            <div class="story_chat_content">
            게임 같은 세상이 만들어져 고블린을 물리치거나<br>
            온갖 괴물들을 상대하는 경우도 있고<br>
            불바다가 된 집에서 누군가를 구해야 하는 경우도 있지
            </div>
          </div><br>
            `);
            objDiv.scrollTop = objDiv.scrollHeight;
          }, 12000);
          setTimeout(() => {
            $("#story").append(`<div class="story_chat">
            <div class="story_chat_profile"></div>
            <div class="story_chat_content">
            비욘드에서는 비현실적인 일들이 벌어진다<br>
            판타지 세계 같은 거라고 생각하면 편할 거야<br>
            한데.. 그곳은 가상이나 헛것 따위가 아닌 현실이다<br>
            비욘드에 들어간 열쇠 수리공은 죽을 수도 있지
            </div>
          </div><br>
            `);
            objDiv.scrollTop = objDiv.scrollHeight;
          }, 18000);
          setTimeout(() => {
            $("#story").append(`<div class="story_chat">
            <div class="story_chat_profile"></div>
            <div class="story_chat_content">
            세 번째, 비욘드로 들어가 트라우마의 아픔을 치료할 방법을 찾는 게<br>
            우리 ‘열쇠 수리공’의 임무다<br>
            비욘드에선 트라우마를 치료하려는 마음가짐에 따라 마법 같은 능력이<br>
            발현될 수도 있지 그건 너의 재량이다
            </div>
          </div><br>
            `);
            objDiv.scrollTop = objDiv.scrollHeight;
          }, 24000);
          setTimeout(() => {
            $("#story").append(`<div class="story_chat">
            <div class="story_chat_profile"></div>
            <div class="story_chat_content">
            “띠링!(문자 알림음)”<br>
            마침 임무가 떨어졌군<br>
            따라와라 ${checkNickname.nickname}<br>
            1. 준비됐습니다
            </div>
          </div><br>
            `);
            objDiv.scrollTop = objDiv.scrollHeight;
          }, 30000);
          objDiv.scrollTop = objDiv.scrollHeight;
        } else if (checkNickname.msg === "2" || checkNickname.msg === "아니오") {
          $("#story").append(`<div class="story_chat">
          <div class="story_chat_profile"></div>
          <div class="story_chat_content">그럼 뭐야??</div>
          </div><br>`);
          localStorage.setItem("stage", "nickname");
        } else $("#story").append(`뭐? 똑바로 대답해!<br>`);
        objDiv.scrollTop = objDiv.scrollHeight;
      });
      socket.on("tutorial", (nickname) => {
        $("#main_box div").empty();
        $("#story").append(`<div class="story_chat">
        <div class="story_chat_profile">
        </div>
        <div class="story_chat_content">
        간단하다. 문이 보이면<br>
        1이나 얼어붙은문을 입력창에 치고 비욘드에 들어가서<br>
        전투를 하면 된다<br>
        1. 네!
        </div>
        </div><br>`);
      });
    } else if (data.code === "user") {
      $("#story").append(`<div class="story_chat">
    <div class="story_chat_profile">
    </div>
    <div class="story_chat_content">
    튜토리얼을 이미 진행했군
    </div>
    </div><br>`);
    }
    objDiv.scrollTop = objDiv.scrollHeight;
  });

  socket.on("fight", (data) => {
    $("#main_box div").empty();
    localStorage.setItem("stage", "fight");
    $("#story").append(
      `좋아요 훈련 공간 입니다.<br>어느 몬스터와 훈련을 하시겠어요?<br>1. 고블린<br>2. 슬라임<br><br>`
    );
  });
  socket.on("monster", (monster) => {
    $("#story").append(`${monster.msg.name}과(와) 전투를 시작합니다.<br>`);
    socket.emit("fight", { monster: monster.msg.name });
  });
});
socket.on("send_chat", (data) => {
  $("#chattingList").append(`${data.nickname} : ${data.msg}<br>`);
  objDivChat.scrollTop = objDivChat.scrollHeight;
});
function send() {
  let msg = document.getElementById("text").value;
  let stage = localStorage.getItem("stage");
  let nickname = localStorage.getItem("nickname");
  let userId = localStorage.getItem("userId");
  let data = { msg, stage, nickname, userId };
  if (msg === "") return;
  socket.emit("msg", data);
  $("#text").val("");
}

function send_chat() {
  let msg = document.getElementById("chat_box2").value;
  let nickname = localStorage.getItem("nickname");
  if (!nickname) nickname = "뉴비";
  let data = { msg, nickname };
  if (msg === "") return;
  socket.emit("send_chat", data);
  $("#chat_box2").val("");
}

const clear_chat = () => {
  $("#chattingList").empty();
};
const logout = () => {
  localStorage.clear();
  location.href = "/";
};
