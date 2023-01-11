const AT = localStorage.getItem("Authorization");
// axios
//   .get("/main", {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: AT,
//     },
//   })
//   .then(function (result) {
//     console.log(result);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
// fetch(`/main`, {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: localStorage.getItem("Authorization"),
//   },
// });
// 위의 socket.io.js에서 뽑아 쓴다.
const socket = io();
let objDiv = document.getElementById("story");
let objDivChat = document.getElementById("chatting");
let objDivGet = document.getElementById("get");

socket.on("connect", () => {
  const userId = localStorage.getItem("userId");
  socket.emit("user", userId);
});

socket.on("userInfo", (userInfo) => {
  document.getElementById("R_vs_profile").src = `../css/images/profile.png`;
  if (!userInfo.nickname) userInfo.nickname = "뉴비";
  if (!userInfo.job) userInfo.job = "무직";
  $("#nickname").text(userInfo.nickname);
  $("#job").text(userInfo.job);
  $("#level").text(userInfo.level);
  $("#level2").text(userInfo.level);
  $("#exp").text(userInfo.exp);
  $("#needExp").text(userInfo.needExp);
  $("#power").text(userInfo.power);
  $("#magic").text(userInfo.magic);
  $("#defense").text(userInfo.defense);
  $("#HP").text(userInfo.HP);
  $("#maxHP").text(userInfo.maxHP);
  $("#MP").text(userInfo.MP);
  $("#maxMP").text(userInfo.maxMP);
  $("#money").text(userInfo.money);
  $("#helmet").text(userInfo.helmet || "미착용");
  $("#armor").text(userInfo.armor || "미착용");
  $("#weapon").text(userInfo.weapon || "미착용");
  $("#keyRing1").text(userInfo.keyRing1 || "미착용");
  $("#keyRing2").text(userInfo.keyRing2 || "미착용");
  $("#keyRing3").text(userInfo.keyRing3 || "미착용");
  $("#subPower").text(userInfo.subPower);
  $("#subMagic").text(userInfo.subMagic);
  $("#subDefense").text(userInfo.subDefense);
  let HPper = ($("#HP").text() / $("#maxHP").text()) * 100;
  document.getElementById("R_vs_hp_content").style.width = `${HPper}%`;
});

socket.on("connectUser", (connectUser) => {
  $("#chattingList").append(`${connectUser.user} 접속!<br>`);
  objDivChat.scrollTop = objDivChat.scrollHeight;
});

socket.on("start", (data) => {
  if (data.code === "newUser") {
    leftProfile("yundal2");
    $("#L_nickname").text("윤달");
    $("#L_nickname").text(data.name);
    $("#main_box div").empty();
    $("#story").append(`<div class="story_chat">
      <div class="story_chat_profile">
      <img id="story_chat_profile">
      </div>
      <div class="story_chat_content">
      어이, 신입<br>
      나는 너의 지도를 맡게 된 ‘윤달’이다<br>
      네 이름은?<br>
      </div>
      </div><br>`);
    storyProfile("yundal2");

    // 뉴비일 때
    localStorage.setItem("stage", "nickname");
    socket.on("nickname", (nickname) => {
      localStorage.setItem("stage", "checkNickname");
      localStorage.setItem("nickname", nickname.msg);
      $("#main_box div").empty();

      $("#story").append(`<div class="story_chat">
        <div class="story_chat_profile">
        <img id="story_chat_profile"></div>
        <div class="story_chat_content">
        ${nickname.msg}.. 확실해?<br>
        1.네<br>
        2.아니오<br><br>
        </div>
        </div><br>`);
      storyProfile("yundal2");
      objDiv.scrollTop = objDiv.scrollHeight;
    });
    socket.on("checkNickname", async (checkNickname) => {
      if (checkNickname.msg === "1" || checkNickname.msg === "네") {
        localStorage.setItem("stage", "tutorial");
        $("#nickname").text(checkNickname.nickname);
        $("#main_box div").empty();
        $("#story").append(`<div class="story_chat">
          <div class="story_chat_profile">
          <img id="story_chat_profile"></div>
          <div class="story_chat_content">
          그래, ${checkNickname.nickname} 바로 본론으로 들어가지..<br>
          열쇠 수리공으로서 네가 알아야 할 건 딱 세 가지
          </div>
          </div><br>
          `);
        storyProfile("yundal2");
        $("#story").append(`<div class="story_chat">
          <div class="story_chat_profile">
          <img id="story_chat_profile"></div>
          <div class="story_chat_content">
          첫 번째, 인간의 마음은 큰 상처를 입었을 때 ‘트라우마’에 잠식하게된다<br>
          트라우마에 빠진 인간을 그대로’ 트라우마’라고 부르기로 했다<br>
          이성을 잃고 타인을 죽일 수도 자신을 죽일 수 있는 상태가 되지
          </div>
          </div><br>
          `);
        storyProfile("yundal2");
        setTimeout(() => {
          $("#story").append(`<div class="story_chat">
            <div class="story_chat_profile">
            <img id="story_chat_profile"></div>
            <div class="story_chat_content">
            두 번째, 트라우마가 잠식하는 동시에 굳게 닫힌 문을 남기게 되는데<br>
            우린 그 문을 ‘비욘드’라고 부르기로 했다<br>
            문을 따게 되면 트라우마의 아픔을 구현한 자기만의 세계가 만들어져있지
            </div>
          </div><br>
            `);
          storyProfile("yundal2");
          objDiv.scrollTop = objDiv.scrollHeight;
        }, 6000);
        setTimeout(() => {
          $("#story").append(`<div class="story_chat">
            <div class="story_chat_profile">
            <img id="story_chat_profile"></div>
            <div class="story_chat_content">
            게임 같은 세상이 만들어져 고블린을 물리치거나<br>
            온갖 괴물들을 상대하는 경우도 있고<br>
            불바다가 된 집에서 누군가를 구해야 하는 경우도 있지
            </div>
          </div><br>
            `);
          storyProfile("yundal2");
          objDiv.scrollTop = objDiv.scrollHeight;
        }, 12000);
        setTimeout(() => {
          $("#story").append(`<div class="story_chat">
            <div class="story_chat_profile">
            <img id="story_chat_profile"></div>
            <div class="story_chat_content">
            비욘드에서는 비현실적인 일들이 벌어진다<br>
            판타지 세계 같은 거라고 생각하면 편할 거야<br>
            한데.. 그곳은 가상이나 헛것 따위가 아닌 현실이다<br>
            비욘드에 들어간 열쇠 수리공은 죽을 수도 있지
            </div>
          </div><br>
            `);
          storyProfile("yundal2");
          objDiv.scrollTop = objDiv.scrollHeight;
        }, 18000);
        setTimeout(() => {
          $("#story").append(`<div class="story_chat">
            <div class="story_chat_profile">
            <img id="story_chat_profile"></div>
            <div class="story_chat_content">
            세 번째, 비욘드로 들어가 트라우마의 아픔을 치료할 방법을 찾는 게<br>
            우리 ‘열쇠 수리공’의 임무다<br>
            비욘드에선 트라우마를 치료하려는 마음가짐에 따라 마법 같은 능력이<br>
            발현될 수도 있지 그건 너의 재량이다
            </div>
          </div><br>
            `);
          storyProfile("yundal2");
          objDiv.scrollTop = objDiv.scrollHeight;
        }, 24000);
        setTimeout(() => {
          $("#story").append(`<div class="story_chat">
            <div class="story_chat_profile">
            <img id="story_chat_profile"></div>
            <div class="story_chat_content">
            “띠링!(문자 알림음)”<br>
            마침 임무가 떨어졌군<br>
            따라와라 ${checkNickname.nickname}<br>
            1. 준비됐습니다
            </div>
          </div><br>
            `);
          storyProfile("yundal2");
          objDiv.scrollTop = objDiv.scrollHeight;
        }, 30000);
        objDiv.scrollTop = objDiv.scrollHeight;
      } else if (checkNickname.msg === "2" || checkNickname.msg === "아니오") {
        $("#story").append(`<div class="story_chat">
          <div class="story_chat_profile">
          <img id="story_chat_profile"></div>
          <div class="story_chat_content">그럼 뭐야??</div>
          </div><br>`);
        storyProfile("yundal2");
        localStorage.setItem("stage", "nickname");
      } else $("#story").append(`뭐? 똑바로 대답해!<br>`);
      objDiv.scrollTop = objDiv.scrollHeight;
    });
    socket.on("tutorial", (nickname) => {
      $("#main_box div").empty();
      localStorage.setItem("stage", "tutorial2");
      $("#story").append(`<div class="story_chat">
        <div class="story_chat_profile">
        <img id="story_chat_profile">
        </div>
        <div class="story_chat_content">
        간단하다. 문이 보이면<br>
        1이나 훈련의문을 입력창에 치고 비욘드에 들어가서<br>
        전투를 하면 된다<br>
        1. 네!
        </div>
        </div><br>`);
      storyProfile("yundal2");
    });
    socket.on("tutorial2", (nickname) => {
      $("#main_box div").empty();
      localStorage.setItem("stage", "fight");
      $("#story").append(`
        <br>
        <div class="door"></div>
        <p style="text-align : center">1. 훈련의 문</P>
    `);
    });
  } else if (data.code === "lobby") {
  }
  objDiv.scrollTop = objDiv.scrollHeight;
});

socket.on("lobby", (data) => {
  $("#main_box div").empty();
  $("#story").append(`<img id="lobby">`);
  localStorage.setItem("stage", "lobby");
  document.getElementById("lobby").src = `../css/images/lobby.png`;
});

socket.on("beyond", () => {
  $("#main_box div").empty();
  $("#story").append(`<img id="lobby">`);
  localStorage.setItem("stage", "beyond");
  document.getElementById("lobby").src = `../css/images/stage1.png`;
});

socket.on("keyRing", () => {
  $("#main_box div").empty();
  $("#story").append(`<img id="lobby">`);
  localStorage.setItem("stage", "keyRing");
  leftProfile("keyringmachine");
  $("#L_nickname").text("뽑기");
  document.getElementById("lobby").src = `../css/images/keyring.png`;
});

socket.on("pub", () => {
  $("#main_box div").empty();
  $("#story").append(`<img id="lobby">`);
  localStorage.setItem("stage", "pub");
  document.getElementById("lobby").src = `../css/images/hideout.png`;
  socket.on("minjae", () => {
    leftProfile("minjae");
    $("#main_box div").empty();
    $("#story").append(`<div class="story_chat">
    <div class="story_chat_profile">
    <img id="story_chat_profile">
    </div>
    <div class="story_chat_content">
    축구선수.. 아니야..
    </div>
    </div><br>`);
    storyProfile("minjae");
  });
  socket.on("hana", (nickname) => {
    leftProfile("hana");
    $("#main_box div").empty();
    $("#story").append(`<div class="story_chat">
    <div class="story_chat_profile">
    <img id="story_chat_profile">
    </div>
    <div class="story_chat_content">
    ${nickname}.. 또야?<br>
    조심했어야지~ 이리와바<br>
    짠! 다 됐다! 이제 얼른 가봐.
    </div>
    </div><br>`);
    storyProfile("hana");
  });
  socket.on("jisung", () => {
    leftProfile("jisung");
    $("#main_box div").empty();
    $("#story").append(`<div class="story_chat">
    <div class="story_chat_profile">
    <img id="story_chat_profile">
    </div>
    <div class="story_chat_content">
    뭐? 염색?<br>
    아니 자연 흰색이다
    </div>
    </div><br>`);
    storyProfile("jisung");
  });
  socket.on("chacha", () => {
    leftProfile("chacha");
    $("#main_box div").empty();
    $("#story").append(`<div class="story_chat">
      <div class="story_chat_profile">
    <img id="story_chat_profile">
      </div>
      <div class="story_chat_content">
      왈!!<br>
      이라 할줄 알았나?<br>
      뭐<br>
      개는 사람말 하면 안돼?
      </div>
      </div><br>`);
    storyProfile("chacha");
  });
});

socket.on("smithy", () => {
  $("#main_box div").empty();
  $("#story").append(`<img id="lobby">`);
  localStorage.setItem("stage", "smithy");
  document.getElementById("lobby").src = `../css/images/smithy.png`;
  socket.on("ganghwa", (ganghwa) => {
    $("#main_box div").empty();
    $("#story").append(`<img id="lobby">`);
    localStorage.setItem("stage", "ganghwa");
    document.getElementById("lobby").src = `../css/images/ganghwa.png`;
    $("#story").append(`<div class="ganghwa_box" id="ganghwa_box"></div>`);
    $("#ganghwa_box").append(`
    <div class="ganghwa_list">
      <div class="ganghwa_type">투구</div>
      <div class="ganghwa_name">어쩌구저쩌구+1</div>
      <div class="ganghwa_quantity">x111</div>
    </div>`);
  });
});

socket.on("bag", () => {
  $("#main_box div").empty();
  localStorage.setItem("stage", "bag");
  alert("아이템 장착 방법: 해당 아이템 이름 + 장착");
  socket.on("myBag", (item) => {
    $("#story").empty();
    item.item.forEach((item) => {
      if (item.quantity > 0) {
        $("#story").append(`
        <div class="item_box">
          <div class="item_type">${item.Item.type}</div>
          <div class="item_name">${item.Item.name}</div>
          <div class="item_content">${item.Item.explanation}</div>
          <div class="item_quantity">x${item.quantity}</div>
        </div> 
      `);
      }
    });
  });
});

socket.on("storytelling", () => {
  $("#main_box div").empty();
  localStorage.setItem("stage", "storytelling");
  $("#story").append(`이곳은 스토리`);
});

socket.on("quest", () => {
  $("#main_box div").empty();
  localStorage.setItem("stage", "storytelling");
  $("#story").append(`이곳은 퀘스트`);
});

socket.on("help", () => {
  $("#main_box div").empty();
  localStorage.setItem("stage", "storytelling");
  $("#story").append(`이곳은 도움말`);
});

// socket.on("fight", (data) => {
//   $("#main_box div").empty();
//   localStorage.setItem("stage", "fight");
//   $("#story").append(
//     `좋아요 훈련 공간 입니다.<br>어느 몬스터와 훈련을 하시겠어요?<br>1. 고블린<br>2. 슬라임<br><br>`
//   );
// });

socket.on("monster", (monster) => {
  $("#main_box div").empty();
  localStorage.setItem("stage", "end_fight");
  leftProfile(monster.msg.img);
  $("#story").append(`${monster.msg.name}과(와) 전투를 시작합니다.<br>`);
  let nickname = $("#nickname").text();
  let monsterHP = monster.msg.HP;
  let myHP = $("#HP").text();
  let myMaxHP = $("#maxHP").text();
  let myMP = $("#MP").text();
  let myPower = $("#power").text() * 1 + $("#subPower").text() * 1;
  let myDefense = $("#defense").text() * 1 + $("#subDefense").text() * 1;
  let myHPPer = (myHP / myMaxHP) * 100;
  let monsterHPPer = 100;
  $("#L_lv").text(monster.msg.level);
  $("#L_nickname").text(monster.msg.name);
  setTimeout(() => {
    while (monsterHP > 0 || myHP > 0) {
      let attack = myPower - monster.msg.defense;
      if (attack <= 0) attack = 1;
      let damage = monster.msg.power - myDefense;
      if (damage <= 0) damage = 1;
      myHPPer = (myHP / myMaxHP) * 100;
      monsterHPPer = (monsterHP / monster.msg.HP) * 100;
      $("#story").append(`
            ======================<br>`);
      let ranDmg1 = ranDmg();
      let ranDmg2 = ranDmg();
      if (ranDmg1 === 11) {
        ranDmg1 = 15;
        $("#story").append(`${nickname}의 크리티컬 공격<br>`);
      }
      attack = parseInt((attack * ranDmg1) / 10);
      monsterHP -= attack;
      if (ranDmg2 === 11) {
        ranDmg2 = 15;
        $("#story").append(`${monster.msg.name}의 크리티컬 공격<br>`);
      }
      damage = parseInt((damage * ranDmg2) / 10);
      myHP -= damage;
      $("#story").append(`
            ${nickname}의 베기 공격<br>
            ${monster.msg.name}의 둔기 내려치기<br>
            ${monster.msg.name}에게 ${attack} 데미지<br>
            ${damage} 데미지를 입었다.<br>
            `);
      $("#story").append(`
            ${monster.msg.name}의 HP ${monsterHP}/${monster.msg.HP}
            <br>`);
      $("#story").append(`
            ======================<br>`);
      if (monsterHP <= 0) {
        document.getElementById("L_vs_hp_content").style.width = `0%`;
        document.getElementById("R_vs_hp_content").style.width = `${myHPPer}%`;
        $("#HP").text(myHP);
        $("#story").append(`
          ${monster.msg.name}을 처치 하였습니다<br>
          1. 전투종료
          `);
        let ranMoney = Math.floor(Math.random() * 101);
        let money = parseInt((monster.msg.money * ranMoney) / 100);
        $("#get").append(`경험치 [${monster.msg.exp}] 획득<br>`);
        $("#get").append(`[${money}]골드 획득<br>`);
        let random = randomPer();
        const itemList = monster.msg.item;
        let itemPer1 = 0;
        let itemPer2 = 0;
        for (let i = 0; i < itemList.length; i++) {
          itemPer1 += itemList[i][0];
          if (random > itemPer2 && itemPer1 >= random) {
            $("#get").append(`[${itemList[i][1]}] 획득<br>`);
            socket.emit("getItem", { item: itemList[i][1], nickname: nickname });
          }
          itemPer2 = itemPer1;
        }
        socket.emit("fight", {
          HP: myHP,
          exp: monster.msg.exp,
          money: money,
        });
        objDivGet.scrollTop = objDivGet.scrollHeight;
        objDiv.scrollTop = objDiv.scrollHeight;
        return;
      } else if (myHP <= 0) {
        document.getElementById("L_vs_hp_content").style.width = `${monsterHPPer}%`;
        document.getElementById("R_vs_hp_content").style.width = `0%`;
        $("#story").append(`
          패배했습니다.<br>
          1. 전투종료
          `);
        socket.emit("fight", {
          HP: 10,
        });
        objDiv.scrollTop = objDiv.scrollHeight;
        return;
      }
    }
  }, 1000);
  objDiv.scrollTop = objDiv.scrollHeight;
});

socket.on("send_chat", (data) => {
  $("#chattingList").append(`${data.nickname} : ${data.msg}<br>`);
  objDivChat.scrollTop = objDivChat.scrollHeight;
});

socket.on("levelup", () => {
  $("#get").append(`레벨이 올랐습니다!<br>`);
  objDivGet.scrollTop = objDivGet.scrollHeight;
});

socket.on("error", (error) => {
  alert(error.msg);
});

socket.on("warning", (warning) => {
  const result = confirm(warning.msg);
  socket.emit("warn_response", { msg: result });
});

function send() {
  let msg = document.getElementById("text").value;
  let stage = localStorage.getItem("stage");
  let nickname = $("#nickname").text();
  if (nickname === "뉴비") nickname = localStorage.getItem("nickname");
  let userId = localStorage.getItem("userId");
  let data = { msg, stage, nickname, userId };
  if (msg === "") return;
  socket.emit("msg", data);
  $("#text").val("");
}

function send_chat() {
  let msg = document.getElementById("chat_box2").value;
  let nickname = $("#nickname").text();
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

const leftProfile = (img) => {
  document.getElementById("L_vs_profile").src = `../css/images/${img}.png`;
};
const storyProfile = (img) => {
  document.getElementById("story_chat_profile").src = `../css/images/${img}.png`;
};

const ranDmg = () => {
  return Math.floor(Math.random() * 12);
};

const randomPer = () => {
  return Math.floor(Math.random() * 101);
};
