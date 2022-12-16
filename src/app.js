const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const socket = require("./socket");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.set("view engine", "ejs");
app.set("views", "./views");

const Router = require("./routes");

app.get("/", (req, res) => {
  res.render("login");
});

app.use("/", Router);

server.listen(3000, () => {
  console.log(`서버 연결띠~`);
});

socket(server);
