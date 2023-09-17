const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // validate data
  if (!name || !email || !password) {
    res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing Email
  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User already exists" });
  });

  // Create salt and hash
  const hashedPwd = await bcrypt.hash(password, 10);

  const userData = { name, email, password: hashedPwd, role };

  const newUser = await User.create(userData);
  res.json(newUser);
  if (newUser) {
    res.json({ user: newUser });
  } else {
    res.status(400).json({ message: "User data is invalid" });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: "Please enter all fields" });
  }

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) {
    return res.status(401).json({ message: "Unauthorized user" });
  }
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { name: foundUser.name },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    // secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken, userInfo: foundUser });
});

const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({ name: decoded.name });

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
      );
      res.json({ accessToken });
    })
  );
});

const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
});

const getUser = asyncHandler(async (req, res) => {
  User.findById(req.user)
    .select("-password")
    .then((user) => res.json({ user }));
});

module.exports = {
  createUser,
  login,
  refresh,
  logout,
  getUser,
};
