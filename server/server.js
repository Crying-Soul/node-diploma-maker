"use strict";
require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const userRouter = require("../routes/user.routes");
const authRouter = require("../routes/auth.routes");
const cors = require("cors");
const os = require("os");

class Server {
  constructor() {
    this.PORT = process.env.PORT || 5000;
    this.ROOT = require("path").dirname(require.main.filename);
    this.app = express();
  }
  getLocalIp() {
    return Object.values(os.networkInterfaces()).reduce((r, list) =>r.concat(list.reduce((rr, i) => rr.concat((i.family === "IPv4" && !i.internal && i.address) || []),[])),[])[0];
  }
  start() {
    this.app.listen(this.PORT, () => {
      console.log(`App listening at ${this.getLocalIp()}:${this.PORT}`);
    });
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use("/api", userRouter);
    this.app.use("/api", authRouter);
    if (process.env.NODE_ENV === "production") {
      this.app.use(
        "/",
        express.static(path.join(this.ROOT, "client", "build"))
      );
      this.app.get("*", (req, res) => {
        res.sendFile(path.resolve(this.ROOT, "client", "build", "index.html"));
      });
    }
  }
}

module.exports = Server;
