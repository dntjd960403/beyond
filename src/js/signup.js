"use strict";

let id = document.getElementById("id"),
  password = document.getElementById("password");

function signup() {
  if (id.value === "" || id.value.length < 3) alert("아이디는 3글자 이상 적어라");
  else if (password.value === "" || password.value.length < 3)
    alert("비밀번호는 3글자 이상 적어라");
  else
    axios
      .post("/users/signup", {
        userId: id.value,
        password: password.value,
      })
      .then(function (result) {
        alert(result.data.message);
        return (location.href = "/");
      })
      .catch(function (error) {
        alert(error.response.data.errorMsg);
      });
}
