const id = document.getElementById("id"),
  // #id: 태그에 id로 부여되어있는 값을 가져오라는 명령
  password = document.getElementById("password"),
  // #password: 태그에 password로 부여되어있는 값을 가져오라는 명령
  loginButton = document.getElementById("loginBtn");

loginButton.addEventListener("click", login);

const checkUser = localStorage.getItem("Authorization");
console.log(checkUser);
if (checkUser) {
  alert("이미 로그인 하셨습니다.");
  location.href = "/main";
}

function login() {
  $.ajax({
    url: "/users/login",
    type: "POST",
    data: {
      userId: id.value,
      password: password.value,
    },
    success: function (data) {
      localStorage.setItem("Authorization", data.accessToken);
      localStorage.setItem("userId", id.value);
      alert(data.message);
      return (location.href = "/main");
    },
    error: function (data) {
      return alert(data.responseJSON.errorMsg);
    },
  });
}
