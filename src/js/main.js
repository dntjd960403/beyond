// 위의 socket.io.js에서 뽑아 쓴다.
const socket = io.connect("http://localhost:3000", {
  // ws:// 를 안쓰고 http를 쓴다
  // path: '/socket.io', // 서버 path와 일치시켜준다
  //    transports: ['websocket']
});
let count = 0;
socket.on("connect", () => {
  console.log("커넥트");
  socket.on("a", (data) => {
    $("#story").append(data.msg);
  });
  $("#RoomName").val("main");
  $("#chatting").append(data.msg);
  socket.on("newUser", (data) => {
    $("#chatting").append(data.msg);
  });
  socket.on("userName", (data) => {
    $("#name").val(data);
  });
  socket.on("newMessage", (data) => {
    $("#chatting").append(`${data.name} : ${data.msg}<br>`);
    let objDiv = document.getElementById("chattingMom");
    objDiv.scrollTop = objDiv.scrollHeight;
  });
});

function send() {
  let room = document.getElementById("RoomName").value;
  let name = document.getElementById("name").value;
  let text = document.getElementById("text").value;
  let data = { room, name, text };
  if (text === "") return;
  socket.emit("newMessage", data);
  $("#text").val("");
}
function enter() {
  let data = $("#inputRoomName").val();
  let room = $("#RoomName").val();
  if ($("#RoomName").val() === data || $("#inputRoomName").val("") == data) {
    $("#inputRoomName").val("");
    return;
  }
  socket.emit("join", { data: data, room: room });
  $("#RoomName").val(data);
  $("#chatting").append("방" + data + "입장\n");
  $("#rooms").append(`<button onclick="enter()">${data}</button><br>`);
  $("#inputRoomName").val("");
}
