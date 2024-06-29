const jwt = require("jsonwebtoken");
const userModels = require("../models/user");
exports.checkAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await userModels.findById(decoded.id);
    } catch (error) {
      return res
        .status(401)
        .json({ message: "You need to be logged in to access this route" });
    }
  }
  next();
};
exports.isLogged = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ message: "You need to be logged in to access this route" });
  }
  next();
};
