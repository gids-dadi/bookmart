// const jwt = require("jsonwebtoken");

// const verifyJwt = (req, res, next) => {
//   const authHeader = req.headers.authorization || req.headers.Authorization;

//   if (!authHeader?.startsWith("Bearer ")) {
//     return res.status(401).json({ Message: "Unauthorized" });
//   }
//   const token = authHeader.split(" ")[1];

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) return res.status(403).json({ message: "Forbidden" });
//     req.user = decoded.UserInfo.id;
//     next();
//   });
// };

// module.exports = verifyJwt;

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");

const auth = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      //extract header from authHeader string
      token = authHeader.split(" ")[1];

      //verified token returns user id
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      //find user's obj in db and assign it to req.user
      req.user = await User.findById(decoded.UserInfo.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized,invalid token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized,invalid token");
  }
});

module.exports = auth;
