const { decode } = require("jsonwebtoken");
const authServices = require("./auth/services");

function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  if (!authServices.validateAccessToken(token)) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = decode;
  next();
}

module.exports = {
  auth,
};
