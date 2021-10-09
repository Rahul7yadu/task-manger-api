const jwt = require("jsonwebtoken");
const User = require("../models/users.js");
// app.use((req, res, next) => {
//   console.log(req.method, req.path);
//   if (req.method == "GET") {
//     return res.send("GET request disabled");
//   }
//   next();
// });

// app.use((req, res, next) => {
//   res.send("site under construction");
// });

const auth = async (req, res, next) => {
  try {
    // if (!req.header("Authorization")) throw new Error("please provide header");
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    req.user = user;

    next();
  } catch (error) {
    res.send("error:please login ");
  }
};
module.exports = auth;
