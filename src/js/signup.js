"use strict";

let id = document.getElementById("id"),
  password = document.getElementById("password");

function signup() {
  if (id.value === "" || id.value.length < 3) alert("아이디는 3글자 이상 적어라");
  else if (password.value === "" || password.value.length < 3)
    alert("비밀번호는 3글자 이상 적어라");
  else
    $.ajax({
      url: "/users/signup",
      type: "POST",
      data: {
        userId: id.value,
        password: password.value,
      },
      success: function (data) {
        console.log(data);
        alert("회원가입이 완료되었습니다");
        return (location.href = "/");
      },
      error: function (data) {
        return alert(data.responseJSON.errorMsg);
      },
    });
}
