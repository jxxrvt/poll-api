require("dotenv").config();
const express = require("express");
const db = require("./db/mongodb");
const auth = require("./auth/routes");
const polls = require("./polls/routes");

const app = express();
const mongan = require("morgan");

app.use(express.json());
app.use("/auth", auth);

app.use(mongan());
app.use("/polls", polls);

async function start() {
  await db.init();

  app.listen(process.env.PORT, () => {
    console.log("server is running on port " + process.env.PORT);
  });
}

start()
  .then(() => console.log("start complete"))
  .catch((err) => console.log(err));
